import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle, } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('/generateOutline')
  async generateOutline(
    @Body() body: { topic: string, email: string }
  ): Promise<any> {
    const { email, topic } = body
    return this.appService.generateOutline(topic, email);
  }
}
