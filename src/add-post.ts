import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { readFileSync } from "fs";
import { join } from "path";
import type { Post } from "./types";

// ── Put the filename of your new post here ───────────────────
const FILENAME = "my-new-post.md";
// ────────────────────────────────────────────────────────────

function parseFrontmatter(content: string) {
  content = content.replace(/\r\n/g, "\n");
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid frontmatter — make sure your md file starts with ---");
  const [, frontmatterText, body] = match;
  const fm: any = {};
  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return;
    const key = line.slice(0, colonIndex).trim();
    let value: any = line.slice(colonIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((v: string) => v.trim()).filter(Boolean);
    }
    if (key === "readingTime" && !isNaN(Number(value))) value = Number(value);
    if (value === "true") value = true;
    if (value === "false") value = false;
    fm[key] = value;
  });
  return { frontmatter: fm, body: body.trim() };
}

const filePath = join(import.meta.dir, "../content", FILENAME);
const raw = readFileSync(filePath, "utf-8");
const { frontmatter, body } = parseFrontmatter(raw);

const post: Post = {
  id: String(Date.now()),
  slug: frontmatter.slug,
  title: frontmatter.title,
  excerpt: frontmatter.excerpt,
  tags: frontmatter.tags,
  publishedAt: new Date(frontmatter.publishedAt).toISOString(),
  readingTime: frontmatter.readingTime,
  content: body,
};

const client = new DynamoDBClient({ region: "us-east-1" });

await client.send(new PutItemCommand({
  TableName: "foomi-dev-posts",
  Item: marshall(post),
}));

console.log(`✓ published: ${post.slug}`);