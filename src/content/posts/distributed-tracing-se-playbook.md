---
title: "Distributed Tracing Playbook: Finding the Slow Span in a 3rd-Party Integration"
description: "A solution engineer's workflow for using OpenTelemetry traces to localize latency in a chain that crosses your service, a customer VPC, and a vendor API."
date: "2026-06-28"
---

## Overview

When a customer reports "your integration is slow," the cause is rarely our service. It is usually their network, their auth setup, the vendor's API, or — most often — DNS. Distributed tracing lets you prove that in five minutes instead of five days.

## Prerequisites

- OpenTelemetry (OTel) SDK instrumenting your service
- A trace backend: Jaeger, Tempo, Honeycomb, or Datadog APM
- W3C Trace Context propagation across HTTP and message boundaries
- A reproducer or a way to capture a trace from a customer's environment

## The Problem We Solved

Customer reported p99 latency of 11s on a workflow we internally measured at 800ms. The customer was right — their workload hit a code path we did not exercise in staging. We needed to find which span in the chain was responsible without shipping a custom build to their environment.

## The Workflow

### Step 1: Get a Trace ID From the Customer

Ask for the trace ID of a single slow request. Most OTel backends expose this as a header or in logs:

```
traceparent: 00-a1b2c3d4e5f6...-00f067aa0ba902b7-01
```

If they have no tracing, ask for: request timestamp, approximate size, the customer-side duration they measured. That is enough to narrow it to a window.

### Step 2: Look at the Span Tree

Open the trace in your backend. The top span is your service entry. Look at three things, in order:

```text
[your-service.handleRequest]                   10,820 ms
├── [db.query: get-account]                       12 ms
├── [http.client: vendor-api /v1/orders]       9,940 ms  ← here
│   ├── [dns.resolve: vendor-api.example.com]  8,100 ms  ← or here
│   └── [tls.handshake]                            85 ms
└── [cache.get: session]                           3 ms
```

The span with the longest self-time is the culprit. In this case it was DNS resolution against a misconfigured customer DNS resolver that took 8 seconds.

### Step 3: Annotate With Context

OpenTelemetry spans carry attributes. The fix is often in the attributes, not the timing:

```ts
span.setAttribute("http.url", sanitizedUrl);
span.setAttribute("http.status_code", res.status);
span.setAttribute("http.request.body.size", body.length);
span.setAttribute("vendor.region", vendorRegion);
span.setAttribute("dns.resolver", "customer-resolver-01");
```

What to attribute:

- **HTTP client spans**: method, route template (not raw URL — PII), status, body size, peer.
- **DB spans**: statement (parameterized), row count, isolation level.
- **Custom business spans**: anything that costs money or time — retries, queue waits, vendor calls.

### Step 4: Trace Context Propagation

The most common reason you cannot see the slow span is that the trace context broke mid-chain. Three places this happens:

1. **Async fan-out** — fire-and-forget calls without `context.with(traceContext, ...)`.
2. **Vendor SDKs** — older vendor SDKs do not propagate W3C headers. Inject them manually:

```ts
import { propagation, context, trace } from "@opentelemetry/api";

const carrier: Record<string, string> = {};
propagation.inject(context.active(), carrier);

await fetch(vendorUrl, {
	headers: {
		...carrier,
		Authorization: `Bearer ${token}`,
	},
});
```

3. **Message queues** — set the trace context as a message header, extract on consume:

```ts
producer.send({
	headers: { traceparent: carrier.traceparent },
	payload,
});

consumer.on("message", (msg) => {
	const ctx = propagation.extract(context.active(), msg.headers);
	context.with(ctx, () => processMessage(msg));
});
```

### Step 5: Build a Reproducer

Once you have localized the slow span, build the smallest possible reproducer. For DNS:

```bash
$ dig @customer-resolver vendor-api.example.com
;; connection timed out; no servers could be reached
```

For vendor latency, compare your internal latency to the customer's. If the customer sees 9s and you see 200ms, the problem is in their path, not the vendor's.

## Span Budgets

Once you can see spans, set budgets. A span budget is a target duration per critical path; if any span blows its budget, alert fires.

```yaml
budgets:
  - service: order-sync
    path: handle-request
    spans:
      - name: db.query.get-account
        budget_ms: 20
      - name: http.client.vendor-api
        budget_ms: 500
      - name: cache.get.session
        budget_ms: 5
    total_budget_ms: 800
```

Span budgets catch regressions before customers do. They also force SE conversations about acceptable latency — "your SLA says 2s, our budget says 800ms, what is the gap?"

## Communicating to the Customer

When you have localized the issue, send the customer one trace, annotated:

> The 9,940 ms vendor call is dominated by 8,100 ms of DNS resolution (`dns.resolve: vendor-api.example.com`). Your resolver `customer-resolver-01` is timing out before falling back. Check the resolver config — `options timeout:1 attempts:1` is too aggressive for this workload.

A trace screenshot beats a thousand lines of logs. The customer sees what you see.

## Anti-Patterns

- **Sampling away the slow traces** — head-based sampling at 1% hides the long tail. Use tail-based sampling that retains slow or errored traces at 100%.
- **Custom span names per request** — `span.name = "/users/12345/orders/67890"` blows up cardinality. Use templates: `span.name = "/users/{id}/orders/{id}"`.
- **Tracing only the happy path** — instrument error branches too. The interesting span is often the one that timed out and retried.