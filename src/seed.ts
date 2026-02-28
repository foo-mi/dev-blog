import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { getAllPosts } from "./data-backup";

const client = new DynamoDBClient({ region: "us-east-1" });

const posts = getAllPosts();

for (const post of posts) {
  await client.send(new PutItemCommand({
    TableName: "foomi-dev-posts",
    Item: marshall(post),
  }));
  console.log(`seeded: ${post.slug}`);
}

console.log(`done — seeded ${posts.length} posts`);