import { Controller, Post } from '@nestjs/common';
import { ScraperService } from './application/scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post()
  Scrap(): Promise<number> {
    return this.scraperService.run();
  }
}
