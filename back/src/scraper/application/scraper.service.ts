import { KEYWORDS } from 'src/shared/constants';
import { LinkedInScraper } from '../infrastructure/linkedin.scraper';
import { Injectable } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { toNumber } from 'src/shared/utils';

@Injectable()
export class ScraperService {
  constructor(
    private readonly linkedin: LinkedInScraper,
    private readonly postService: PostService,
  ) {}

  mostFrequentKeyword(article: string, keywords: string[]) {
    const counts: Record<string, number> = {};

    const text = article.toLowerCase();

    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'g');
      const matches = text.match(regex);
      counts[kw] = matches ? matches.length : 0;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    return sorted[0];
  }

  async run() {
    const scraped = await this.linkedin.fetchPosts('regulation');
    console.log(`Scraped ${scraped.length} posts`);

    for (const p of scraped) {
      const [topKeyword] = this.mostFrequentKeyword(
        p.content,
        KEYWORDS['regulation'],
      );

      await this.postService.createPost(
        {
          authorName: p.authorName,
          authorAvatarUrl: p.authorAvatar,
          content: p.content,
          url: p.url,
          postedAt: p.createdAt,
          reactions: toNumber(p.reactions),
          comments: toNumber(p.comments),
          shares: 0,
        },
        topKeyword,
      );
    }

    return scraped.length;
  }
}
