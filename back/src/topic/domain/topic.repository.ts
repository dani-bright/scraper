import { Topic } from './topic.entity';

export const TOPIC_REPOSITORY = 'TOPIC_REPOSITORY';

export interface TopicRepository {
  findAll(): Promise<Topic[]>;
  findOne(id: number): Promise<Topic | null>;
  findbyName(name: string): Promise<Topic | null>;
}
