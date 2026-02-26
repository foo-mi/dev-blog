import type { Post } from "./types";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const CONTENT_DIR = join(import.meta.dir, "../content");

interface Frontmatter {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  draft?: boolean;
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  // Normalize line endings to \n
  content = content.replace(/\r\n/g, "\n");
  
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid frontmatter");

  const [, frontmatterText, body] = match;
  const frontmatter: any = {};

  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value: any = line.slice(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse arrays
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v: string) => v.trim())
        .filter(Boolean);
    }

    // Parse numbers
    if (key === "readingTime" && !isNaN(Number(value))) {
      value = Number(value);
    }

    // Parse booleans
    if (value === "true") value = true;
    if (value === "false") value = false;

    frontmatter[key] = value;
  });

  return { frontmatter: frontmatter as Frontmatter, body: body.trim() };
}

function loadPosts(): Post[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts: Post[] = [];

  files.forEach((file, index) => {
    const filePath = join(CONTENT_DIR, file);
    const content = readFileSync(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    // Skip drafts
    if (frontmatter.draft) return;

    posts.push({
      id: String(index + 1),
      slug: frontmatter.slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      tags: frontmatter.tags,
      publishedAt: new Date(frontmatter.publishedAt).toISOString(),
      readingTime: frontmatter.readingTime,
      content: body,
    });
  });

  return posts;
}

const posts = loadPosts();

export const getAllPosts = (): Post[] =>
  [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

export const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const getPostDates = (): string[] =>
  posts.map((p) => p.publishedAt.slice(0, 10));