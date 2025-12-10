import { LinkedInScraper } from '../infrastructure/linkedin.scraper';
import { Injectable } from '@nestjs/common';
import { PostService } from 'src/post/application/post.service';
import { toNumber } from 'src/shared/utils';
import { AiClassificationService } from 'src/ai/application/ai-classification.service';
import { CHARACTER_LIMIT, KEYWORDS } from 'src/shared/constants';

@Injectable()
export class ScraperService {
  constructor(
    private readonly linkedin: LinkedInScraper,
    private readonly postService: PostService,
    private readonly ai: AiClassificationService,
  ) {}

  mostFrequentKeyword(article: string, keywords: string[]): string | null {
    const counts: Record<string, number> = {};

    const text = article.toLowerCase().substring(0, CHARACTER_LIMIT);

    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.toLowerCase()}\\b`, 'g');
      const matches = text.match(regex);
      counts[kw] = matches ? matches.length : 0;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    const [word, count] = sorted[0];
    if (count === 0) {
      return null;
    }
    return word;
  }

  async run(withAi = false) {
    console.log('Starting scraping process...');
    const scraped = await this.linkedin.fetchPosts();
    console.log(`Scraped ${scraped.length} posts`);
    let classification: { topic: string; isRegulatory: boolean };
    for (const p of scraped) {
      if (withAi) {
        classification = await this.ai.classifyRegulation(p.content);

        if (!classification.isRegulatory) {
          continue;
        }
      } else {
        const topKeyword = this.mostFrequentKeyword(
          p.content,
          KEYWORDS['regulation'],
        );

        if (!topKeyword) {
          continue;
        }

        classification = {
          topic: topKeyword,
          isRegulatory: true,
        };
      }

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
        classification.topic,
      );
    }

    console.log(`Saved posts to database`);

    return scraped.length;
  }
}
