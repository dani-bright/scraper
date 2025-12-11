import { Injectable } from '@nestjs/common';
import { SQLitePostRepository } from 'src/post/infrastucture/SQLite/post.repository';
import { Topic } from '../domain/topic.entity';
import { SQLiteTopicRepository } from '../infrastucture/SQLite/topic.repository';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepo: SQLiteTopicRepository,
    private readonly postRepo: SQLitePostRepository,
  ) {}

  async findOrCreate(name: string): Promise<Topic> {
    let topic = await this.topicRepo.findbyName(name);
    if (topic) {
      return topic;
    }
    console.log(`Creating new topic: ${name}`);
    topic = await this.topicRepo.save({
      name,
      postsCount: 0,
      popularityScore: 0,
    });

    return topic;
  }

  async incrementPostCount(topic: Topic): Promise<void> {
    topic.postsCount += 1;
    await this.topicRepo.save(topic);
  }

  async findAll(): Promise<Topic[]> {
    return this.topicRepo.findAll();
  }

  async findPostsByTopic(topicId: number, page = 1, limit = 10) {
    return this.postRepo.findByTopic(topicId, page, limit);
  }
}
