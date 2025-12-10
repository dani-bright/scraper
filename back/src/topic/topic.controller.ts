import { Controller, Get, Param } from '@nestjs/common';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  async findAll() {
    return this.topicService.findAll();
  }

  @Get(':id/posts')
  async findPosts(@Param('id') id: number) {
    return this.topicService.findPostsByTopic(id);
  }
}
