---
title: "AWS App Runner: The Simplest Path to Production"
slug: aws-app-runner-guide
excerpt: "App Runner abstracts away load balancers, ECS clusters, and VPC configuration. If your app runs in a container, you can be live in under ten minutes."
tags: [aws, app-runner, devops, docker]
publishedAt: 2026-02-19
readingTime: 8
---

## The Deployment Flow

1. Push a Dockerfile to ECR
2. Create an App Runner service pointing at your image
3. Set environment variables
4. Deploy

App Runner handles the rest — load balancing, TLS certificates, rolling deployments.

## Dockerfile for Bun

```dockerfile
FROM oven/bun:1-alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["bun", "run", "src/server.ts"]
```

## Cost

App Runner charges per vCPU-second and GB-second. For a low-traffic blog: pennies per month. Set minimum instances to 0 for true serverless billing.
