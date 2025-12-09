import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './domain/post.entity';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    private readonly topicService: TopicService,
  ) {}

  async createPost(
    postData: Partial<Post>,
    mainKeyword: string,
  ): Promise<Post> {
    const topic = await this.topicService.findOrCreate(mainKeyword);

    console.log('Creating post under topic:', topic.name);
    const post = this.postRepo.create({
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
    await this.postRepo.save(post);

    await this.topicService.incrementPostCount(topic);

    return post;
  }
}
