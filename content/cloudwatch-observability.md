---
title: "Observability on a Budget with CloudWatch"
slug: cloudwatch-observability
excerpt: "Full observability doesn't require Datadog at $500/month. CloudWatch Logs Insights and custom metrics cover 90% of your needs for a fraction of the cost."
tags: [aws, cloudwatch, observability, logging]
publishedAt: 2026-02-05
readingTime: 7
---

## Structured Logging from Bun

```typescript
function log(level: "info"|"warn"|"error", msg: string, meta?: object) {
  console.log(JSON.stringify({ level, msg, ts: Date.now(), ...meta }));
}
```

CloudWatch Logs Insights queries JSON fields directly. Find all errors in the last hour:

```sql
fields @timestamp, msg
| filter level = "error"
| sort @timestamp desc
| limit 50
```

## Embedded Metrics Format

EMF lets you emit custom metrics via log lines — no SDK required. Your p99 latency costs nothing extra to track.
