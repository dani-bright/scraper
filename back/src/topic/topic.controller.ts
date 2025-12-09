import { Controller, Get } from '@nestjs/common';

@Controller()
export class TopicController {
  constructor() {}

  @Get()
  getHello(): any {
    return;
  }
}
