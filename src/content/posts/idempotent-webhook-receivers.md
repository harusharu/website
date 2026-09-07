---
title: "Designing Idempotent Webhook Receivers for Noisy Upstreams"
description: "How to build webhook endpoints that survive retries, duplicate deliveries, and out-of-order arrivals without corrupting downstream state."
date: "2026-06-28"
---

## Overview

Solution engineers live downstream of customer systems. Every integration we ship becomes someone else's retry loop. This post covers the minimum bar for a webhook receiver: idempotent, replay-safe, and observable enough to debug a partner's misconfiguration at 2 AM.

## Prerequisites

- A backend with a relational or key-value store (Postgres, MySQL, Redis)
- An HTTP framework that exposes raw request bodies before JSON parsing
- A clock you trust (UTC, monotonic for tests)

## The Problem We Solved

A partner's CRM retried every webhook for 24 hours on any non-2xx, including transient 500s from our DB pool exhaustion. We processed the same `lead.updated` event 40+ times per incident, double-counting conversions and corrupting attribution. The downstream consumer had no way to distinguish a retry from a new event.

## Solution: Three Idempotency Layers

### Layer 1: Provider Event ID

Most webhook providers (Stripe, GitHub, HubSpot) attach a stable event ID per logical delivery. Treat it as the source of truth.

```ts
// Extract BEFORE JSON parsing so a malformed body still records a receipt.
const rawBody = await req.text();
const signature = req.headers.get("x-signature") ?? "";
const eventId = req.headers.get("x-event-id") ?? crypto.randomUUID();

if (!verifySignature(secret, rawBody, signature)) {
	return new Response("bad signature", { status: 401 });
}
```

### Layer 2: Receipt Table

Insert the event ID into a `webhook_receipts` table with a unique constraint. If the insert fails with a duplicate-key error, the event has already been processed — return 200 and exit.

```sql
CREATE TABLE webhook_receipts (
  event_id      TEXT PRIMARY KEY,
  source        TEXT NOT NULL,
  received_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  status        TEXT NOT NULL CHECK (status IN ('received', 'processed', 'failed')),
  payload_hash  BYTEA NOT NULL,
  processed_at  TIMESTAMPTZ
);

-- Insert first, process after. This is the "outbox-ish" pattern.
INSERT INTO webhook_receipts (event_id, source, payload_hash)
VALUES ($1, $2, digest($3, 'sha256'))
ON CONFLICT (event_id) DO NOTHING
RETURNING event_id;
```

If the `RETURNING` is empty, the event is a duplicate. Acknowledge it and stop.

### Layer 3: Idempotent Business Operations

The receipt stops the webhook receiver from double-handling. The downstream operation must also be idempotent on a *business* key — `lead_id + updated_at`, `order_id + version`, etc. — so that a legitimate state change applied twice is a no-op.

```ts
await db.transaction(async (tx) => {
	const receipt = await tx.query(
		`UPDATE webhook_receipts
		 SET status = 'processed', processed_at = now()
		 WHERE event_id = $1 AND status = 'received'
		 RETURNING event_id`,
		[eventId],
	);

	if (receipt.rowCount === 0) return; // already processed or not ours

	await applyBusinessChange(tx, payload); // must be idempotent on business key
});
```

## Out-of-Order Arrivals

Providers do not guarantee order. A `lead.updated` with `updated_at = T2` may arrive before the `updated_at = T1` event. Two options:

1. **Reject stale events** — compare `updated_at` against the current row version, skip if older.
2. **Buffer and reorder** — keep a small in-memory or Redis sorted set per resource key, flush when contiguous.

Pick (1) unless your downstream is order-sensitive (billing, audit logs).

## What to Return

- `200` for "received and processed" (including duplicates).
- `202` for "received, processing async" — only if you have a queue that durably enqueues inside the same transaction.
- `4xx` for "your request will never succeed" (bad signature, malformed body) — do **not** retry these.
- `5xx` for "transient infra failure, retry me" — but use these sparingly. A partner's retry storm will DDoS you.

## Observability Checklist

- Emit a metric per webhook source: `webhook_processed_total{source, status}` and `webhook_processing_seconds{source}`.
- Log `event_id`, `source`, `payload_hash` — never the full payload (PII risk).
- Alert on `status=failed` rate > 1% over 5 minutes.
- Expose a `GET /webhooks/receipts/:event_id` debug endpoint for partner SEs to self-serve.

## The SE Handoff

When handing this to a customer's integration team, document three things:

1. Which headers carry the event ID and signature.
2. The exact retry policy (max attempts, backoff schedule, final failure behavior).
3. The deduplication window — how long receipts live before pruning.

Receipt pruning matters. Keep 30 days minimum for Stripe (replays within 30 days are valid), longer for finance workflows.