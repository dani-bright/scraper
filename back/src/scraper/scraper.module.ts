import { Module } from '@nestjs/common';
import { ScraperService } from './application/scraper.service';
import { LinkedInScraper } from './infrastructure/linkedin.scraper';
import { PostModule } from 'src/post/post.module';
import { AiModule } from 'src/ai/ai.module';
import { BootstrapScraperService } from './infrastructure/bootstrap-scraper.service';

@Module({
  imports: [PostModule, AiModule],
  providers: [ScraperService, LinkedInScraper, BootstrapScraperService],
})
export class ScraperModule {}
