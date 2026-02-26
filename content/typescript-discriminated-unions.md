---
title: "TypeScript Discriminated Unions Are Underrated"
slug: typescript-discriminated-unions
excerpt: "Pattern matching on tagged union types eliminates entire categories of runtime errors. Most TypeScript codebases are leaving this on the table."
tags: [typescript, patterns, type-system]
publishedAt: 2026-02-12
readingTime: 5
---

## The Problem with Optional Fields

```typescript
interface State {
  data?: User;
  error?: Error;
  loading: boolean;
}
```

This allows nonsensical combinations: loading: true with data set. The type system won't save you.

## Discriminated Unions

```typescript
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };
```

TypeScript narrows the type automatically inside switch statements. Access data outside the success branch and you get a compile error — not a runtime surprise.
