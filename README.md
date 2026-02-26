# devlog — Tech Blog

Minimal tech blog built with **Bun**, **TypeScript**, deployed on **AWS App Runner**.

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Runtime  | Bun 1+                      |
| Language | TypeScript (no build step)  |
| Frontend | Vanilla HTML/CSS/JS         |
| Container| Docker (oven/bun:1-alpine)  |
| Registry | AWS ECR                     |
| Hosting  | AWS App Runner              |

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
├── src/
│   ├── server.ts     ← Bun HTTP server + API routes
│   ├── data.ts       ← Post data + query helpers
│   └── types.ts      ← Shared TypeScript types
├── public/
│   └── index.html    ← Full frontend (no framework)
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

Edit `src/data.ts` — add a new entry to the `posts` array:

```typescript
{
  id: "6",
  slug: "my-new-post",
  title: "My New Post",
  excerpt: "One or two sentence summary shown in the list.",
  content: `## Section\n\nYour content here.`,
  tags: ["tag1", "tag2"],
  publishedAt: new Date().toISOString(),
  readingTime: 5,
}
```

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
