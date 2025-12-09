/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { chromium, Browser, Page } from 'playwright';
import { Scraper, ScrapedPost } from '../domain/scraper.interface';
import { KEYWORDS } from 'src/shared/constants';

// const res = await fetch(
//   `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(
//     query,
//   )}`,
//   {
//     headers: {
//       accept:
//         'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
//       'accept-language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7',
//       'cache-control': 'max-age=0',
//       priority: 'u=0, i',
//       'sec-ch-prefers-color-scheme': 'dark',
//       'sec-ch-ua':
//         '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
//       'sec-ch-ua-mobile': '?0',
//       'sec-ch-ua-platform': '"macOS"',
//       'sec-fetch-dest': 'document',
//       'sec-fetch-mode': 'navigate',
//       'sec-fetch-site': 'same-origin',
//       'sec-fetch-user': '?1',
//       'upgrade-insecure-requests': '1',
//       cookie:
//         'bcookie="v=2&97e380b7-6491-4543-8ccc-d30ac41d8042"; bscookie="v=1&202311161539107d114b68-3216-4f3e-8801-34bfccc4deb4AQHpK3Xu1A0RwXSeTfdVBdqBfmaJsnzV"; li_rm=AQGsdvFgUUxx0gAAAY8HSRaRstLJqDZvU6Ax82g_a41ewPULDwZpXtVjDe7wyOHMG8Aupa4QSk8HXukthYMQVxx9IgvUaZHYVR3YtMcv5Fzfp5sC8GS-73p8; liap=true; JSESSIONID="ajax:4929244205075706801"; li_theme=light; li_theme_set=app; li_sugr=bb03fb1b-6525-44ba-97cb-af28ef7c87ea; dfpfpt=72139368084c4db6937c042209c193d8; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C20344%7CMCMID%7C77782831537052531982336809842062375063%7CMCAAMLH-1758276638%7C6%7CMCAAMB-1758276638%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1757679038s%7CNONE%7CMCCIDH%7C1828164703%7CvVersion%7C5.1.1; sdui_ver=sdui-flagship:0.1.19572+SduiFlagship0; _pxvid=0252755c-8e57-11f0-950e-214e69c6f921; lang=v=2&lang=fr-fr; timezone=Europe/Paris; AnalyticsSyncHistory=AQLYQLz7Hm6abwAAAZr9kccIyYeWBCdedwgUq-M8OtmoYa-wQVoPACaIEIffRFpgKEGDw8eML4nUZTSUF6VkzQ; lms_ads=AQEfpt25puXmLwAAAZr9kciJgtyJpWlB3StPcLnzS7l8yoxksftaLO4kjGnjjZISv1uvDpIhrjLJm0P3ZKIEmXYvNwlk7xdD; lms_analytics=AQEfpt25puXmLwAAAZr9kciJgtyJpWlB3StPcLnzS7l8yoxksftaLO4kjGnjjZISv1uvDpIhrjLJm0P3ZKIEmXYvNwlk7xdD; li_at=AQEDASQ_mdAFw_AQAAABlZPt8AYAAAGbKFKkI1YAJX4dsOhKKKonvrnj3xakmWHvz1vcI5NbDqN4InuLTiCvW5KSmVFxV-n6g09dEvjTcujSsjvzMkmnmRIcebYJR3WYaJvfhhVSC6aC3s_L1XSbbCbZ; fptctx2=taBcrIH61PuCVH7eNCyH0B9zcK90d%252bIeoo1r5v7Zc26t0mg32e4QB5yfzscjgTGuPomLTcAXujphfa1YlXMtw0hr4dql%252fOKg%252bKyMEuzDLS1jC9%252f19aVH3uAgHr%252fr%252ftI%252fO7fHj1CmhdZWdBBmV%252f8BrWGRBxwSSJlaIgLlYfJUvHnw31wz1VSSZYLpoMDNzyIiHR%252bIUAcK5eYVa25wawnCADEJuaRYniln5lNWpUHbbbBsjmtOULJBV%252fB8L8PRKnnBdfiM%252fr4aeBdVcVpIq6%252fmMT09IIXc%252fqM69AYsTUyyYOqS62qqyU2Xi30ZywPI%252bxDr7F%252fTar6GVqpC%252fqcn1HSh5HVYpOMyxIDXoamTUGwcqMHKdFmzwkqAokmKUHpA%252bDHExUoH2EJbyWI0OzToB8x%252fJg%253d%253d; UserMatchHistory=AQIP3DzBhXpuZAAAAZsEdPfIb7fS4iwNrghtHWoyftE1Hyy1_zBTAmdW7a6wt_8Eq2G-tvRJDne3ySra0sUJNZePKlGjFsZZnHqo2-fEXG0Zlt-_tQcqDzJmXuMNHoM_smjA2Bij2VKJmK5-UeZtPGGLwb4W0-Fj7cQ9yVyEmSq3LHg7ssZJZwMStyofMBt-NV7l7WaOCwIJi6eFEC51P2ZCfsSSA0-mv70AQp9zCFTGf3gn6GtJZCyYnpv7SfFvB12HYWPNRYqbIFtc5zQSlq-hygPRVOI2GfufVzr8XktTIXJHY54LUgjLlrt_OS3MKjJn3LTxmn8q8-Q3D5SOKTUGuEbFgw-t7b9Bxi7_05Av2uenKg; lidc="b=TB20:s=T:r=T:a=T:p=T:g=5520:u=2966:x=1:i=1765306333:t=1765386551:v=2:sig=AQGRE18uocJxsqvwTFjI3a9n7wb-hVeR"; __cf_bm=SpcH5B_Udqb3LVQNl_oGqqI1Jxm4xwWwWAlqWDIuiCU-1765306873-1.0.1.1-RQKnlYzosoRmdwjBeBQuJzFMHGbOSO71nEKpy4wgMHGj_TAE7WZtBs8VDb8_BA0i9SGE8T_G3AkRP998DfSLKBqukACaVSuCvKzL_tHBguo; li_mc=MTsyMTsxNzY1MzA3MDUzOzI7MDIxosqlmhQvfJzl+aMvBV/Ftx/p6ygbYdAXS/onzRKHkyA=',
//     },
//     body: null,
//     method: 'GET',
//   },
// );

@Injectable()
export class LinkedInScraper implements Scraper {
  private browser: Browser;

  async init() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
      });
    }
  }

  async fetchPosts(mode: keyof typeof KEYWORDS): Promise<ScrapedPost[]> {
    await this.init();
    const context = await this.browser.newContext({
      extraHTTPHeaders: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7',
        'cache-control': 'max-age=0',
        priority: 'u=0, i',
        'sec-ch-prefers-color-scheme': 'dark',
        'sec-ch-ua':
          '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
      },
    });
    const page: Page = await context.newPage();

    // await page.context().addCookies([
    //   {
    //     name: 'li_at',
    //     value: 'v=2&97e380b7-6491-4543-8ccc-d30ac41d8042',
    //     domain: '.linkedin.com',
    //     path: '/',
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'Strict',
    //   },
    // ]);

    const query = KEYWORDS[mode].join(' OR ');
    await page.goto(
      `https://www.linkedin.com/top-content/artificial-intelligence/`,
    );

    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(1500);

    console.log('After goto, URL =', page.url());
    const keywords = KEYWORDS[mode];

    const posts: ScrapedPost[] = await page.$$eval(
      '.mb-1\\.5',
      (nodes, keywords) => {
        const filteredNode = nodes.filter((node) => {
          const reactions = node
            .querySelector('.font-normal.ml-0\\.5')
            ?.textContent?.trim();
          if (!reactions) {
            return false;
          }
          const reactionsCount = parseInt(reactions);
          const content =
            node
              .querySelector('.attributed-text-segment-list__content')
              ?.textContent?.toLowerCase() || '';

          const containsKeyword = keywords.some((keyword) =>
            content.includes(keyword.toLowerCase()),
          );
          return containsKeyword && reactionsCount >= 100;
        });

        return filteredNode.map((node) => ({
          authorName:
            node
              .querySelector('.entity-result__title-text')
              ?.textContent?.trim() || '',
          authorAvatar: node.querySelector('img')?.getAttribute('src') || '',
          authorBio:
            node
              .querySelector('.entity-result__primary-subtitle')
              ?.textContent?.trim() || '',
          content:
            node
              .querySelector('.attributed-text-segment-list__content')
              ?.textContent?.toLowerCase() || '',
          createdAt:
            node.querySelector('time')?.textContent?.toLowerCase() || '',
          reactions: node
            .querySelector('.font-normal.ml-0\\.5')
            ?.textContent?.trim(),
          comments: '',
          url: node.querySelector('a')?.getAttribute('href') || '',
        }));
      },
      keywords,
    );

    await page.close();
    return posts;
  }

  async close() {
    await this.browser?.close();
  }
}
