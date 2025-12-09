import { Injectable } from '@nestjs/common';
import { Topic } from './domain/topic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {}

  async findOrCreate(name: string): Promise<Topic> {
    const topic = await this.topicRepo.save({
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
}
