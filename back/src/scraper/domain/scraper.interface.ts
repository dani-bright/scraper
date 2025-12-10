export interface Scraper {
  fetchPosts(): Promise<ScrapedPost[]>;
}

export interface ScrapedPost {
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  reactions: string;
  comments: string;
  url: string;
}
