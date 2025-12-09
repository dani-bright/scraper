import { Module } from '@nestjs/common';
import { ScraperService } from './application/scraper.service';
import { ScraperController } from './scraper.controller';
import { LinkedInScraper } from './infrastructure/linkedin.scraper';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [PostModule],
  controllers: [ScraperController],
  providers: [ScraperService, LinkedInScraper],
})
export class ScraperModule {}
