import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/post.repository';
import { Post } from '../../domain/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {}

  async findByTopic(topicId: number): Promise<Post[]> {
    return this.repo.find({
      where: { topic: { id: topicId } },
      relations: ['topic'],
    });
  }

  async save(posts: Post[]): Promise<void> {
    await this.repo.save(posts);
  }
}
