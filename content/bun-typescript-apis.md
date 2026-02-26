---
title: "Building High-Performance APIs with Bun and TypeScript"
slug: bun-typescript-apis
excerpt: "Bun's native HTTP server is blazingly fast out of the box. Here's how to structure a production-ready API without sacrificing developer ergonomics."
tags: [bun, typescript, api, performance]
publishedAt: 2026-02-24
readingTime: 6
---

## Why Bun?

The JavaScript runtime wars have been fascinating. Node.js gave us the event loop. Deno gave us security-first design and native TypeScript. Bun gives us raw performance — startup times in milliseconds, bundling built in, and a test runner requiring zero configuration.

## Structuring the Server

The fetch handler mirrors the browser Fetch API — familiar if you've written Cloudflare Workers.

```typescript
const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/posts") return getPosts();
    return new Response("Not found", { status: 404 });
  },
});
```

## TypeScript Without the Build Step

Bun runs TypeScript natively. No ts-node, no tsx, no Babel. Just bun run server.ts and you're live.
