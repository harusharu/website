---
title: "Tenant Sandbox Environments: Reproducible Demos Without Leaking Customer Data"
description: "A blueprint for spinning up isolated, seed-loaded sandbox tenants per prospect so solution engineers can demo and reproduce bugs without touching production."
date: "2026-06-28"
---

## Overview

A demo that breaks in front of a prospect is unrecoverable. A demo that uses real customer data is a compliance incident. This post describes the sandbox tenant pattern we use: one ephemeral environment per prospect, seeded from a versioned fixture, isolated at the namespace level.

## Prerequisites

- A multi-tenant backend that supports namespace/tenant routing
- A container orchestrator (k8s, ECS, or Nomad) — or a serverless platform with per-env isolation
- Object storage with signed URLs (S3, GCS, R2)
- A seed dataset that is large enough to feel real and synthetic enough to be safe

## The Problem We Solved

Our SEs were demoing against a shared `demo` tenant. Two problems:

1. **State leakage** — rep A would mutate a record rep B was about to show.
2. **Reproducibility** — when a prospect hit a bug, we could not reproduce locally because the bug depended on 6 weeks of accumulated state in the shared tenant.

We needed: a fresh tenant per demo, reproducible from a known fixture, tearable down after the call.

## Solution: Tenant-as-a-Pod

### Step 1: Versioned Seed Fixtures

Store seed data as a versioned artifact, not a script that runs against prod. Each fixture is a snapshot of an empty-but-realistic tenant.

```yaml
# fixtures/v3/prospect.yaml
schema: tenant-seed/v3
resources:
  users: 47
  projects: 12
  api_keys: 3
  integration_runs: 180
relationships:
  - "users[].id → projects[].owner_id"
overrides:
  - user.email: prospect+demo@example.com
rng_seed: 0xC0FFEE
```

The `rng_seed` makes the fixture deterministic. The same seed produces the same fake users every time, which means screenshots and recordings stay valid across re-runs.

### Step 2: Provisioning Pipeline

When an SE clicks "New Demo Tenant" in our internal tool:

```ts
async function provisionSandbox(tenantId: string, fixtureTag = "v3") {
	// 1. Create namespace in the control plane.
	await controlPlane.createTenant({
		id: tenantId,
		isolation: "namespace",
		ttl: "24h",
	});

	// 2. Run seed job in that namespace.
	await jobs.enqueue("seed-tenant", {
		tenantId,
		fixture: `oci://registry/fixtures/${fixtureTag}.tar.zst`,
		seed: hash(tenantId + fixtureTag), // per-tenant variation
	});

	// 3. Wait for health check.
	await waitForHealthy(`https://${tenantId}.demo.example.com/health`, {
		timeoutMs: 90_000,
	});

	return { url: `https://${tenantId}.demo.example.com`, expiresAt: Date.now() + 86_400_000 };
}
```

The per-tenant seed hash (`hash(tenantId + fixtureTag)`) gives each prospect a *unique* deterministic dataset — same structure, different names/emails. Screenshots from one tenant never appear in another.

### Step 3: Isolation Boundaries

Three boundaries, each enforced:

| Boundary | Mechanism | Failure mode if breached |
|---|---|---|
| Network | k8s NetworkPolicy / namespace | tenant A reads tenant B's DB |
| Auth | tenant_id claim in JWT, enforced at middleware | cross-tenant API call succeeds |
| Storage | per-tenant prefix + signed URL scope | tenant A reads tenant B's files |

Enforce all three. Two is not enough — middleware bugs ship, network policy misconfigs happen.

### Step 4: Teardown

A timer job that runs every 5 minutes and deletes tenants past their TTL. Hard delete, not soft — sandboxes must not accumulate.

```ts
const stale = await db.query(
	`SELECT id FROM tenants WHERE expires_at < now() AND kind = 'sandbox'`,
);
for (const { id } of stale.rows) {
	await controlPlane.deleteTenant(id);
	await auditLog.record("sandbox.tenant.expired", { id });
}
```

## What Goes Wrong

**Cold-start latency.** First-request latency on a fresh tenant is 3–8 seconds while containers warm. Warm-pool 2–3 standby tenants per region and hand them out round-robin.

**Seed drift.** Production adds a column, fixtures do not, seed job crashes. Solution: run the seed job in CI on every migration PR. Block the migration if the seed fails.

**Cost.** 50 sandboxes × 24h × full replica footprint adds up. Mitigation: scale sandboxes to 0.1 replicas and burst on first request. Most demo traffic fits in a single small instance.

## The SE Workflow

1. SE opens internal tool, picks fixture version (default: latest).
2. Tool provisions tenant, returns URL + 6-digit join code.
3. SE shares URL with prospect; prospect logs in via SSO with a seeded "demo viewer" role.
4. SE has a debug sidebar showing tenant ID, fixture version, expiry timer.
5. After the call, SE clicks "Convert to trial" — sandbox data migrates to the prospect's new production tenant, schema-aligned.

## Anti-Patterns to Avoid

- **Reset on demand** ("just re-seed before each demo") — hides real bugs and erases session state the prospect cares about.
- **Shared demo tenant** — see above, do not do this.
- **Production data masking** — masking is bypass-able; synthetic data is not.
- **Manual provisioning** — anything manual gets skipped at 5 PM on a Friday before a critical call.