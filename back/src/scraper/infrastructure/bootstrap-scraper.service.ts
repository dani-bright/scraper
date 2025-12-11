import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ScraperService } from '../application/scraper.service';

@Injectable()
export class BootstrapScraperService implements OnApplicationBootstrap {
  constructor(private readonly scraperService: ScraperService) {}

  onApplicationBootstrap() {
    process.nextTick(async () => {
      try {
        await this.scraperService.run();
      } catch (err) {
        console.error('Error during bootstrap scraping:', err);
      }
    });
  }
}
