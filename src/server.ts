import { getAllPosts, getPostBySlug, getPostDates } from "./data";
import type { PostSummary } from "./types";

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC = import.meta.dir + "/../public";

const JSON_HEADERS = new Headers({ "Content-Type": "application/json" });

function ok<T>(data: T): Response {
  return new Response(JSON.stringify({ data }), { headers: JSON_HEADERS });
}

function err(msg: string, status = 404): Response {
  return new Response(JSON.stringify({ error: msg }), { status, headers: JSON_HEADERS });
}

async function staticFile(path: string): Promise<Response> {
  const file = Bun.file(`${PUBLIC}${path}`);
  const exists = await file.exists();
  if (!exists) return err("Not found", 404);
  return new Response(file);
}

Bun.serve({
  port: PORT,

  async fetch(req) {
    const { pathname } = new URL(req.url);

    // ── API ──────────────────────────────────────────────────
    if (pathname === "/api/posts") {
      const posts = await getAllPosts();
      const summaries: PostSummary[] = posts.map(
        ({ id, slug, title, excerpt, tags, publishedAt, readingTime }) =>
          ({ id, slug, title, excerpt, tags, publishedAt, readingTime })
      );
      return ok(summaries);
    }

    if (pathname.startsWith("/api/posts/")) {
      const slug = pathname.slice("/api/posts/".length);
      const post = await getPostBySlug(slug);
      return post ? ok(post) : err("Post not found");
    }

    if (pathname === "/api/dates") {
      const dates = await getPostDates();
      return ok(dates);
    }

    // ── Static ───────────────────────────────────────────────
    return staticFile(pathname === "/" ? "/index.html" : pathname);
  },

  error(e) {
    console.error(e);
    return new Response("Server error", { status: 500 });
  },
});

console.log(`🚀  http://localhost:${PORT}`);