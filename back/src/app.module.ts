import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { TopicModule } from './topic/topic.module';
import { Post } from './post/domain/post.entity';
import { Topic } from './topic/domain/topic.entity';
import { ScraperModule } from './scraper/scraper.module';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Post, Topic],
      synchronize: true,
    }),
    PostModule,
    TopicModule,
    ScraperModule,
    AiModule,
  ],
})
export class AppModule {}
