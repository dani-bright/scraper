import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { SQLiteTopicRepository } from './infrastucture/SQLite/topic.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './domain/topic.entity';
import { TopicService } from './topic.service';
import { SQLitePostRepository } from 'src/post/infrastucture/SQLite/post.repository';
import { Post } from 'src/post/domain/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Post])],
  controllers: [TopicController],
  providers: [SQLiteTopicRepository, SQLitePostRepository, TopicService],
  exports: [SQLiteTopicRepository, TopicService],
})
export class TopicModule {}
