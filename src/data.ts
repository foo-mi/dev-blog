import { DynamoDBClient, ScanCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import type { Post } from "./types";

const client = new DynamoDBClient({ region: process.env.AWS_REGION ?? "us-east-1" });
const TABLE = "foomi-dev-posts";

export async function getAllPosts(): Promise<Post[]> {
  const result = await client.send(new ScanCommand({ TableName: TABLE }));
  const posts = (result.Items ?? []).map(item => unmarshall(item) as Post);
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const result = await client.send(new GetItemCommand({
    TableName: TABLE,
    Key: marshall({ slug }),
  }));
  return result.Item ? unmarshall(result.Item) as Post : undefined;
}

export async function getPostDates(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map(p => p.publishedAt.slice(0, 10));
}