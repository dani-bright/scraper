import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { SQLiteTopicRepository } from './infrastucture/SQLite/topic.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './domain/topic.entity';
import { TopicService } from './topic.service';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  controllers: [TopicController],
  providers: [SQLiteTopicRepository, TopicService],
  exports: [SQLiteTopicRepository, TopicService],
})
export class TopicModule {}
