import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { TopicModule } from './topic/topic.module';
import { Post } from './post/domain/post.entity';
import { Topic } from './topic/domain/topic.entity';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Post, Topic],
      synchronize: true,
    }),
    PostModule,
    TopicModule,
    ScraperModule,
  ],
})
export class AppModule {}
