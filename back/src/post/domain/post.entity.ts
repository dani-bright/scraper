import { Topic } from 'src/topic/domain/topic.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Topic, { eager: true })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @Column()
  topicId: number;

  @Column()
  authorName: string;

  @Column({ nullable: true })
  authorAvatarUrl: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  url: string;

  @Column()
  postedAt: string;

  @Column({ default: 0 })
  reactions: number;

  @Column({ default: 0 })
  comments: number;

  @Column({ default: 0 })
  shares: number;
}
