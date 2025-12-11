import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../domain/post.repository';
import { Post } from '../../domain/post.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { normalizeUrl } from 'src/shared/utils';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {}

  async save(post: Partial<Post>): Promise<Post> {
    const postEntity = this.repo.create(post);
    return this.repo.save(postEntity);
  }

  async findByTopic(topicId: number): Promise<Post[]> {
    return this.repo.find({
      where: { topic: { id: topicId } },
      relations: ['topic'],
    });
  }

  async findByUrl(url: string): Promise<Post | null> {
    const normalizedUrl = normalizeUrl(url);
    return this.repo.findOne({
      where: {
        url: Like(`${normalizedUrl}%`),
      },
    });
  }
}
