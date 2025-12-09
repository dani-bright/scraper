import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  postsCount: number;

  @Column({ type: 'float', default: 0 })
  popularityScore: number;

  @CreateDateColumn()
  createdAt: Date;
}
