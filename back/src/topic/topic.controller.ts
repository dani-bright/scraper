import { Controller, Get, Param, Query } from '@nestjs/common';
import { TopicService } from './application/topic.service';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  async findAll() {
    return this.topicService.findAll();
  }

  @Get(':id/posts')
  async findPosts(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.topicService.findPostsByTopic(id, Number(page), Number(limit));
  }
}
