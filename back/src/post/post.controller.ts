import { Controller, Get } from '@nestjs/common';

@Controller()
export class PostController {
  constructor() {}

  @Get()
  getHello(): any {
    return;
  }
}
