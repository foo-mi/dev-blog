# foo-mi's devlog

Personal tech blog focused on **DevSecOps**, **AWS**, and **Game Dev**. Built with **Bun**, **TypeScript**, markdown files, and deployed on **AWS App Runner**.

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Runtime  | Bun 1+                      |
| Language | TypeScript (no build step)  |
| Frontend | Vanilla HTML/CSS/JS         |
| Content  | Markdown files w/ frontmatter |
| Container| Docker (oven/bun:1-alpine)  |
| Registry | AWS ECR                     |
| Hosting  | AWS App Runner              |

## Features

-  **Markdown-based posts** with frontmatter (no CMS, no database)
-  **Interactive calendar** showing post publish dates
-  **Tag filtering** and stats sidebar
-  **Dark/light theme toggle** with localStorage persistence
-  **Fully responsive** with mobile sidebar
-  **CI/CD with GitHub Actions** - push to deploy
-  **Zero frontend dependencies** - pure HTML/CSS/JS

---

## Run locally

```bash
bun install
bun run dev     # → http://localhost:3000
```

---

## Project structure

```
tech-blog/
├── content/          ← Markdown posts with frontmatter
│   ├── designing-this-blog.md
│   ├── bun-typescript-apis.md
│   └── ...
├── src/
│   ├── server.ts     ← Bun HTTP server + API routes
│   ├── data.ts       ← Markdown parser + post loader
│   └── types.ts      ← Shared TypeScript types
├── public/
│   └── index.html    ← Full frontend (no framework)
├── .github/workflows/
│   └── deploy.yml    ← CI/CD pipeline
├── Dockerfile
├── package.json
└── tsconfig.json
```

## API

| Method | Path              | Response                       |
|--------|-------------------|--------------------------------|
| GET    | /api/posts        | PostSummary[] (no content)     |
| GET    | /api/posts/:slug  | Post (full content)            |
| GET    | /api/dates        | string[] (YYYY-MM-DD)          |

---

## Deploy to AWS

### Prerequisites

Add these secrets to your GitHub repo (Settings → Secrets → Actions):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `APPRUNNER_SERVICE_ARN` (after creating the service)

### 1. Create ECR repository

```bash
export AWS_ACCOUNT_ID=123456789012
export AWS_REGION=us-east-1

aws ecr create-repository --repository-name tech-blog --region $AWS_REGION
```

### 2. Build & push image

```bash
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS \
  --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker build -t tech-blog .
docker tag tech-blog:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/tech-blog:latest
docker push \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/tech-blog:latest
```

### 3. Create App Runner service

```bash
aws apprunner create-service \
  --service-name tech-blog \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "'$AWS_ACCOUNT_ID'.dkr.ecr.'$AWS_REGION'.amazonaws.com/tech-blog:latest",
      "ImageConfiguration": { "Port": "3000" },
      "ImageRepositoryType": "ECR"
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{ "Cpu": "0.25 vCPU", "Memory": "0.5 GB" }'
```

App Runner provisions HTTPS, load balancing, and auto-scaling automatically.

---

## Adding posts

Create a new markdown file in `content/` with frontmatter:

```markdown
---
title: "My New Post Title"
slug: my-new-post
excerpt: "Brief description shown in the post list"
tags: [devsecops, aws, security]
publishedAt: 2026-02-26
readingTime: 5
draft: false
---

## Introduction

Your content here in markdown...

```typescript
code blocks supported
```

## Next Section

More content...
```

**Drafts:** Set `draft: true` to hide from the live site.

Push to `main` — GitHub Actions builds and deploys automatically.

---

## Cost estimate

| Resource          | ~Monthly cost |
|-------------------|---------------|
| App Runner 0.25 vCPU | $5–10      |
| App Runner 0.5 GB RAM| $2–4       |
| ECR storage       | < $1          |
| **Total**         | **~$7–15**    |

> Set minimum instances to **0** for near-zero idle cost.
