import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import { TopicService } from 'src/topic/application/topic.service';
import { SQLitePostRepository } from '../infrastucture/SQLite/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: SQLitePostRepository,
    private readonly topicService: TopicService,
  ) {}

  async createPost(
    postData: Partial<Post>,
    mainKeyword: string,
  ): Promise<void> {
    const existingPost = await this.postRepo.findByUrl(postData.url);
    if (existingPost) {
      console.log(`Post already exists. Skipping creation.`);
      return;
    }
    const topic = await this.topicService.findOrCreate(mainKeyword);

    await this.postRepo.save({
      authorAvatarUrl: postData.authorAvatarUrl,
      authorName: postData.authorName,
      content: postData.content,
      url: postData.url,
      postedAt: postData.postedAt,
      reactions: postData.reactions ?? 0,
      comments: postData.comments ?? 0,
      shares: postData.shares ?? 0,
      topicId: topic.id,
    });

    await this.topicService.incrementPostCount(topic);
  }
}
