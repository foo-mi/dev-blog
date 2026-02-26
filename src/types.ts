export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
}

export type PostSummary = Omit<Post, "content">;
