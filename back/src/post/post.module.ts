import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/post.entity';
import { TopicModule } from '../topic/topic.module';
import { SQLitePostRepository } from './infrastucture/SQLite/post.repository';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), TopicModule],
  providers: [SQLitePostRepository, PostService],
  exports: [SQLitePostRepository, PostService],
})
export class PostModule {}
