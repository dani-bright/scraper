import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import { Scraper, ScrapedPost } from '../domain/scraper.interface';
import {
  AUTHOR_MIN_RELEVANT_FOLLOWERS,
  CONCURRENCY,
  POST_MIN_RELEVANT_REACTIONS,
} from 'src/shared/constants';

@Injectable()
export class LinkedInScraper implements Scraper {
  private readonly headers = {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7',
    'cache-control': 'max-age=0',
    'upgrade-insecure-requests': '1',
    'sec-ch-ua':
      '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
  };

  async fetchHtml(url: string): Promise<string> {
    const res = await fetch(url, {
      method: 'GET',
      headers: this.headers as any,
    });
    return res.text();
  }

  async fetchTopicLinks(): Promise<string[]> {
    const html = await this.fetchHtml('https://www.linkedin.com/top-content');
    const $ = load(html);

    const links: string[] = [];

    $('.topic-category').each((_, el) => {
      const link = $(el).attr('data-url');
      if (link) links.push(link);
    });

    return links;
  }

  fetchRelatedTopicLinks(html: string): string[] {
    const $ = load(html);
    const links: string[] = [];

    $(
      '.top-content-related-topics a[data-tracking-control-name="keyword-landing-page-top_content__pill"]',
    ).each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        links.push(href);
      }
    });

    return links;
  }

  async scrapePostsFromPage(url: string): Promise<ScrapedPost[]> {
    const html = await this.fetchHtml(url);
    const $ = load(html);

    const posts: ScrapedPost[] = [];

    $('.mb-1\\.5').each((_, el) => {
      const node = $(el);

      const reactionsText = node.find('.font-normal.ml-0\\.5').text().trim();
      if (!reactionsText) return;

      const followersText = node
        .find('span.text-color-text-low-emphasis.px-0\\.25.pr-0\\.5')
        .text()
        .trim();
      const reactionsCount = parseInt(reactionsText);
      const followersCount = parseInt(followersText.replace(/\D/g, ''));
      if (
        isNaN(reactionsCount) ||
        reactionsCount < POST_MIN_RELEVANT_REACTIONS ||
        isNaN(followersCount) ||
        followersCount < AUTHOR_MIN_RELEVANT_FOLLOWERS
      )
        return;

      const commentText = node.find('a[data-num-comments]').text();
      posts.push({
        authorName: node
          .find('.text-sm.link-styled.no-underline.leading-open')
          .text()
          .trim(),
        authorAvatar: node.find('img.w-6.h-6').attr('src') ?? '', //url is delayed and not appearing in result
        content: node
          .find('.attributed-text-segment-list__content')
          .text()
          .trim()
          .toLowerCase(),
        createdAt: node.find('time').text().trim().toLowerCase(),
        reactions: reactionsText,
        comments: commentText.trim().replace(/\D/g, ''),
        url: node.find('div.share-button').attr('data-share-url') ?? '',
      });
    });

    return posts;
  }

  async *fetchPosts(): AsyncGenerator<ScrapedPost> {
    const links = await this.fetchTopicLinks();

    const allRelatedLinksArrays = await Promise.all(
      links.map(async (link) => {
        const html = await this.fetchHtml(link);
        return this.fetchRelatedTopicLinks(html);
      }),
    );

    const relatedLinks = allRelatedLinksArrays.flat();
    const allLinks = [...links, ...relatedLinks];

    console.log(`Found ${allLinks.length} topic links to scrape.`);

    const totalBatches = Math.ceil(allLinks.length / CONCURRENCY);

    for (let i = 0; i < allLinks.length; i += CONCURRENCY) {
      const batch = allLinks.slice(i, i + CONCURRENCY);
      console.log(`Batch ${Math.floor(i / CONCURRENCY) + 1} / ${totalBatches}`);

      const results = await Promise.all(
        batch.map((link) => this.scrapePostsFromPage(link)),
      );
      const scrapedPosts = results.flat();

      for (const post of scrapedPosts) {
        yield post;
      }
    }
  }
}
