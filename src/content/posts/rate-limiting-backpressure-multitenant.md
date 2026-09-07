---
title: "Rate Limiting and Backpressure for Multi-Tenant APIs"
description: "How to design rate limits, queue-based backpressure, and circuit breakers across tenants with very different traffic profiles — without throttling your biggest customer to protect your smallest."
date: "2026-06-28"
---

## Overview

A single global rate limit is the laziest and most common backend mistake. It treats a noisy free-tier user the same as an enterprise tenant doing 5,000 RPS. This post covers a layered approach: per-tenant quotas, per-endpoint budgets, queue-based backpressure, and circuit breakers for downstream dependencies.

## Prerequisites

- A backend that can identify tenants at the edge (JWT claim, API key, header)
- A fast in-memory store (Redis, Dragonfly, or in-process token buckets)
- A queue with visibility timeouts (SQS, NATS JetStream, Kafka, Postgres SKIP LOCKED)
- Metrics + alerting on queue depth and circuit state

## The Problem We Solved

A single noisy tenant (legitimately — they were migrating their entire fleet overnight) pushed p99 latency for everyone else from 200ms to 4s. Our "fair" global rate limit was the wrong tool: it would have throttled nine small tenants to protect one large one.

## Layer 1: Per-Tenant Token Bucket

Every tenant gets a bucket sized to their plan. Use a leaky bucket or token bucket — token bucket handles bursts better for human-driven traffic.

```ts
import { Redis } from "ioredis";

const redis = new Redis();

async function takeToken(tenantId: string, route: string): Promise<boolean> {
	const key = `rl:${tenantId}:${route}`;
	const capacity = await getCapacityForPlan(tenantId); // e.g. 1000 burst
	const refillRate = await getRefillRateForPlan(tenantId); // e.g. 100/sec

	const now = Date.now();
	const result = await redis.eval(
		`local bucket = redis.call('HMGET', KEYS[1], 'tokens', 'last')
		local capacity = tonumber(ARGV[1])
		local refill = tonumber(ARGV[2])
		local now = tonumber(ARGV[3])
		-- ... refill + take logic
		return tokens_remaining`,
		1, key, capacity, refillRate, now,
	);
	return result >= 0;
}
```

Store the bucket state in Redis with a TTL equal to 2× the refill window. Stale state is harmless — the bucket just resets.

### Plan-Aware Buckets

Do not hardcode limits. Read from a config service that SEs can update per tenant without a deploy:

```ts
async function getCapacityForPlan(tenantId: string): Promise<number> {
	const tenant = await controlPlane.getTenant(tenantId);
	const plan = PLANS[tenant.plan];
	return plan.burstCapacity ?? 100;
}
```

When a customer is hitting limits, an SE can bump their bucket in the control plane and see effect in seconds. No code change, no deploy, no escalation.

## Layer 2: Per-Route Budgets

Some routes are expensive (`POST /reports/generate`), some are cheap (`GET /healthz`). A single per-tenant bucket hides this.

```ts
const ROUTE_CLASSES = {
	"GET /v1/healthz":      { weight: 0 },     // free
	"GET /v1/users/:id":    { weight: 1 },
	"POST /v1/reports":     { weight: 50 },
	"POST /v1/imports":     { weight: 200 },   // very expensive
};
```

Take tokens from the route's bucket, not the tenant's. A tenant on a low plan can still call cheap routes freely.

## Layer 3: Queue-Based Backpressure

For genuinely expensive operations (report generation, bulk imports, ML inference), do not let them block the request thread. Enqueue, return a job ID, process async.

```ts
async function enqueueReport(tenantId: string, params: ReportParams) {
	const jobId = ulid();
	await db.transaction(async (tx) => {
		await tx.query(
			`INSERT INTO report_jobs (id, tenant_id, params, status)
			 VALUES ($1, $2, $3, 'queued')`,
			[jobId, tenantId, JSON.stringify(params)],
		);
	});
	await queue.send("report.generate", { jobId, tenantId });
	return { jobId, status: "queued" };
}
```

The request thread returns in 10ms. The actual work happens off-thread. Queue depth becomes your backpressure signal:

- Depth < 1000: healthy.
- Depth 1000–5000: slow consumers, page on-call.
- Depth > 5000: refuse new jobs with `503 Service Unavailable, Retry-After: 30`.

### Per-Tenant Queue Fairness

A single queue means one tenant can starve others. Use per-tenant queues with a round-robin dispatcher:

```ts
while (true) {
	const tenants = await getActiveTenantQueues();
	const batch = [];
	for (const t of tenants) {
		const job = await t.queue.pop({ visibilityMs: 30_000 });
		if (job) batch.push(job);
		if (batch.length >= CONCURRENCY) break;
	}
	await Promise.all(batch.map(processJob));
}
```

## Layer 4: Circuit Breakers for Downstream

A tenant calls your API; your API calls a vendor; the vendor goes down. Without a breaker, every request waits the full timeout, queue fills, your service falls over.

```ts
class CircuitBreaker {
	private failures = 0;
	private state: "closed" | "open" | "half-open" = "closed";
	private openedAt = 0;

	async call<T>(fn: () => Promise<T>): Promise<T> {
		if (this.state === "open") {
			if (Date.now() - this.openedAt < this.cooldownMs) {
				throw new Error("circuit open");
			}
			this.state = "half-open";
		}
		try {
			const result = await fn();
			this.onSuccess();
			return result;
		} catch (err) {
			this.onFailure();
			throw err;
		}
	}
}
```

When the circuit opens, return a fast `503` with a `Retry-After` header. The customer's request fails cleanly instead of hanging. After the cooldown, allow one probe request (half-open); if it succeeds, close the circuit.

### Breaker Per-Dependency

Different vendor APIs have different reliability profiles. One breaker per downstream, not one breaker for "external calls."

## Layer 5: Customer-Facing Headers

Always return rate-limit state in the response:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1719561600
Retry-After: 12
```

Customers build against these. They will warn themselves before they hit zero. Support tickets drop dramatically when you expose this.

## Communicating Limits to Customers

SEs must be able to answer:

- "What is my current limit?"
- "What happens when I hit it?"
- "Can I get a temporary bump?"
- "How do I know I'm close?"

Ship a `GET /v1/me/limits` endpoint that returns the tenant's plan, current bucket state, and queue depth. SEs paste this into Slack; customers see it in their dashboard. The conversation shifts from "your API is broken" to "how do we tune our client."