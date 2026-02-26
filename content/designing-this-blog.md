---
title: "Designing This Blog: From Idea to Live Site"
slug: designing-this-blog
excerpt: "What goes into building a personal tech blog from scratch? Here is the full story: the stack decisions, the design thinking, and the lessons picked up along the way."
tags: [design, bun, typescript, css]
publishedAt: 2026-02-26
readingTime: 5
---

## Why Build Instead of Buy

There are plenty of platforms that would host a blog for free. Substack, Hashnode, Dev.to, Ghost. I chose to build my own for two reasons: I wanted full control over the design, and I wanted something I could put on a resume that shows I actually ship things.

The constraint I set for myself was simple. No frontend framework, no database, no CMS. Just a Bun server, TypeScript, and one HTML file.

## Picking the Stack

Bun was the obvious runtime choice. It runs TypeScript natively with no build step, its built-in HTTP server is fast, and startup time is nearly instant. For a blog serving a handful of JSON endpoints and static files, it is genuinely overkill in the best way.

The frontend is a single HTML file with vanilla JavaScript. No React, no Vite, no bundler. The whole thing loads in one request and renders immediately. There is something satisfying about a site that has zero dependencies in the browser.

Posts live in a TypeScript array in src/data.ts. Adding a new post means adding one object to that array, committing, and pushing. GitHub Actions handles the rest.

## The Design Process

I wanted the visual direction to feel editorial and technical at the same time. The combination I landed on was DM Serif Display for headings, IBM Plex Mono for labels and metadata, and Lora for body text. The serif and monospace pairing creates tension that feels right for a coding blog.

The color palette is almost entirely dark neutrals with two accent colors: a deep burgundy and an olive green. The burgundy handles interactive states and highlights. The olive handles tags and inline code. They sit far enough apart on the color wheel to read as distinct without clashing.

## The Calendar Sidebar

The feature I am most happy with is the calendar in the sidebar. Every date with a published post is highlighted. Empty dates are grayed out. You can click any highlighted date to filter the post list to that day.

It started as a nice-to-have and ended up being the thing that makes the blog feel alive. You can see at a glance how consistently someone is writing, which is its own form of accountability.

## What I Would Do Differently

The markdown renderer I built is minimal by design, but I already feel the edges. Blockquotes, tables, and nested lists are not supported. If the blog grows, that will need to change.

I would also add draft support earlier. Right now every post in data.ts is live immediately. A simple draft: true field filtered out in getAllPosts() would take ten minutes to add and save a lot of accidental publishing.

## Deployment

The site runs on AWS App Runner behind a Cloudflare DNS entry pointing to a .dev domain. App Runner handles HTTPS, load balancing, and rolling deployments automatically. The total infrastructure cost is around ten dollars a month, which feels right for a personal project that I actually use.
