import { Injectable } from '@nestjs/common';
import { TopicRepository } from '../../domain/topic.repository';
import { Topic } from '../../domain/topic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SQLiteTopicRepository implements TopicRepository {
  constructor(
    @InjectRepository(Topic)
    private readonly repo: Repository<Topic>,
  ) {}

  async findAll(): Promise<Topic[]> {
    return this.repo.find();
  }

  async save(topic: Partial<Topic>): Promise<Topic> {
    const topicEntity = this.repo.create(topic);
    return this.repo.save(topicEntity);
  }

  async findOne(id: number): Promise<Topic | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findbyName(name: string): Promise<Topic | null> {
    return this.repo.findOne({ where: { name } });
  }
}
