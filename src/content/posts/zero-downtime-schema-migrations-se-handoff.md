---
title: "Zero-Downtime Schema Migrations: The SE Handoff Checklist"
description: "A practical playbook for shipping database migrations without taking the API offline, including the expand-contract pattern, dual-writes, and the customer-communication checklist SEs actually need."
date: "2026-06-28"
---

## Overview

Schema migrations are where backend reliability meets customer trust. A migration that takes the API down for 30 seconds is a 30-second outage for every customer — and an SE ticket queue that lasts a week. This post covers the expand-contract pattern, why it works, and the customer-facing communication checklist that goes with it.

## Prerequisites

- A relational DB with online DDL support (Postgres, MySQL 8) — or a migration tool like `pgroll`, `gh-ost`, `pt-online-schema-change`
- A deployment pipeline that supports phased rollouts (canary, feature flags)
- Observability: query latency, replication lag, error rate

## The Problem We Solved

We needed to add a `nullable` column to a 200M-row table. The naive `ALTER TABLE ADD COLUMN` with a default value would have rewritten the table, taken a 6-minute AccessExclusiveLock, and caused a customer-visible outage. Instead, we shipped the migration in four phases over two weeks with zero downtime.

## The Expand-Contract Pattern

The principle: every change to a live schema has at least three deployments, not one.

```text
Phase 1 (expand):    Add the new structure. Old code keeps working.
Phase 2 (migrate):   Backfill or dual-write. Both old and new code work.
Phase 3 (switch):    New code reads/writes the new structure.
Phase 4 (contract):  Remove the old structure.
```

Each phase is independently shippable and reversible.

### Worked Example: Adding `users.display_name`

The column needs to be `NOT NULL` eventually, but a `NOT NULL ADD COLUMN` requires a default and rewrites the table.

**Phase 1 — Expand (deploy #1):**

```sql
-- 1a: Add nullable column, no default. Instant in Postgres 11+.
ALTER TABLE users ADD COLUMN display_name TEXT;

-- 1b: Application code still uses old fields. No code change required.
```

**Phase 2 — Migrate (deploy #2 + batch job):**

```sql
-- 2a: Backfill in batches. Never in one transaction.
DO $$
DECLARE
  last_id BIGINT := 0;
BEGIN
  LOOP
    UPDATE users
    SET display_name = COALESCE(raw_name, email)
    WHERE id > last_id
      AND display_name IS NULL
    ORDER BY id
    LIMIT 5000;

    EXIT WHEN NOT FOUND;
    SELECT MAX(id) INTO last_id FROM users WHERE display_name IS NOT NULL;
    PERFORM pg_sleep(0.05); -- throttle to avoid replica lag spikes
  END LOOP;
END $$;
```

Code change in this phase: writes dual-write to both old and new columns. Reads still come from the old column. Roll out behind a feature flag.

```ts
const dualWrite = await featureFlag("users.display_name.dual_write");
const update = {
	raw_name: input.name, // existing column
};
if (dualWrite) {
	update.display_name = input.name; // new column
}
```

**Phase 3 — Switch (deploy #3):**

Reads now come from `display_name`. Fall back to `raw_name` if `display_name IS NULL` for safety.

```ts
const name = user.display_name ?? user.raw_name;
```

**Phase 4 — Contract (deploy #4, weeks later):**

```sql
-- Only after: all reads use display_name, no NULL values remain, monitoring clean.
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
ALTER TABLE users DROP COLUMN raw_name;
```

## Patterns That Need Special Care

### Renaming a Column

Never rename in one deploy. Add the new column, dual-write, switch reads, then drop the old column. Same expand-contract flow.

### Changing a Column Type

`ALTER COLUMN ... TYPE` rewrites the table in Postgres. Instead:

1. Add `new_column` with the new type.
2. Dual-write to both columns.
3. Backfill `new_column` from `old_column`.
4. Switch reads.
5. `BEGIN; DROP old_column; ALTER TABLE new_column RENAME TO old_column; COMMIT;` — done in one short transaction.

### Adding an Index

`CREATE INDEX` without `CONCURRENTLY` takes an AccessExclusiveLock. Always:

```sql
CREATE INDEX CONCURRENTLY idx_users_display_name ON users (display_name);
```

`CONCURRENTLY` does not lock the table for writes, but takes longer and can fail — check for `INVALID` indexes and retry.

### Adding a Foreign Key

Foreign keys take locks on both tables. Add with `NOT VALID`, then `VALIDATE CONSTRAINT` separately:

```sql
ALTER TABLE orders
ADD CONSTRAINT orders_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) NOT VALID;

-- Later, in a separate transaction:
ALTER TABLE orders VALIDATE CONSTRAINT orders_user_id_fkey;
```

`VALIDATE` only takes a ShareUpdateExclusiveLock and does not block writes.

## The Replication Lag Trap

Backfills on a primary can flood the WAL and starve replicas. Throttle:

- Batch size: 1k–10k rows.
- Sleep between batches: 50–100ms.
- Watch replica lag — pause if it exceeds a threshold.

```ts
while (true) {
	const lag = await getReplicaLagSeconds();
	if (lag > 5) {
		await sleep(1000);
		continue;
	}
	const updated = await backfillBatch();
	if (updated === 0) break;
}
```

## The SE Handoff Checklist

Before any migration that touches customer-visible schema, SEs need:

- [ ] **Migration timeline** — when each phase ships, with rollback windows.
- [ ] **API impact** — which endpoints change behavior, and how.
- [ ] **Read-after-write consistency** — if a customer writes and immediately reads, will they see the new shape?
- [ ] **Backfill duration estimate** — and the failure mode if the backfill job dies midway.
- [ ] **Customer-facing changelog entry** — written by the SE, reviewed by engineering. Plain language. What changes, what does not.
- [ ] **Monitoring dashboard** — query latency, error rate, replica lag, migration job status. Shared with the customer if they are deeply integrated.
- [ ] **Rollback plan per phase** — each phase should be reversible without a forward fix.

## When To Take the Outage

Expand-contract is more work than a maintenance window. Take the window instead when:

- The table is small (< 1M rows) and migration is < 60 seconds.
- The customer base is internal-only.
- The change is genuinely incompatible (changing primary key type, dropping a column everyone reads).

Be honest in the SE handoff: "this requires a 90-second maintenance window" is acceptable. "this requires zero downtime" used as a marketing line, then delivered as a 6-minute outage, is not.

## Anti-Patterns

- **Single-deploy migrations** — `ALTER TABLE ... NOT NULL` in the same release that flips the read path. One bad deploy and you are restoring from backup.
- **Backfill inside a transaction** — locks grow, replicas lag, vacuum dies.
- **Skipping Phase 4** — old columns accumulate, queries get ambiguous, the next migration is harder.
- **No feature flag on the code change** — Phase 2 should be flaggable off in seconds.