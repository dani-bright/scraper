import { KEYWORDS } from 'src/shared/constants';

export interface Scraper {
  fetchPosts(mode: keyof typeof KEYWORDS): Promise<ScrapedPost[]>;
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
