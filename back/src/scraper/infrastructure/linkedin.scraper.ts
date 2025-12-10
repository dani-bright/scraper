import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import { Scraper, ScrapedPost } from '../domain/scraper.interface';

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

  async scrapePostsFromPage(url: string): Promise<ScrapedPost[]> {
    const html = await this.fetchHtml(url);
    const $ = load(html);

    const posts: ScrapedPost[] = [];

    $('.mb-1\\.5').each((_, el) => {
      const node = $(el);

      const reactionsText = node.find('.font-normal.ml-0\\.5').text().trim();
      if (!reactionsText) return;

      const reactionsCount = parseInt(reactionsText);
      if (isNaN(reactionsCount) || reactionsCount < 300) return;

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
        comments: commentText.trim().substring(0, commentText.indexOf(' ')),
        url: node.find('div.share-button').attr('data-share-url') ?? '',
      });
    });

    return posts;
  }

  async fetchPosts(): Promise<ScrapedPost[]> {
    const links = await this.fetchTopicLinks();
    const posts: ScrapedPost[] = [];

    for (const link of links) {
      const pagePosts = await this.scrapePostsFromPage(link);
      posts.push(...pagePosts);
    }

    return posts;
  }
}
