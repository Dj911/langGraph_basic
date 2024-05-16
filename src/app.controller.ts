import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/generateOutline')
  async generateOutline(
    @Body() body: { topic: string, email: string }
  ): Promise<any> {
    const { email, topic } = body
    return this.appService.generateOutline(topic, email);
  }
}
