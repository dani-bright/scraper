import { Post } from './post.entity';

export const POST_REPOSITORY = 'POST_REPOSITORY';

export interface PostRepository {
  findByTopic(topicId: number): Promise<Post[]>;
  save(posts: Post[]): Promise<void>;
}
