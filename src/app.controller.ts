import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle, } from '@nestjs/throttler';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@Controller()
  @ApiTags('agent')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Generate Blog Post based on the topic' })
  @ApiResponse({
    status: 201, description: 'Success',
    content: {
      'application/json': {
        schema: { type: 'object' }, examples: {
          default: {
            value: {
              "message": "Your blog has been generated and sent to your email. Hope you like it!"
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests',
    content: {
      'application/json': {
        schema: { type: 'object' }, examples: {
          default: {
            value: {
              "statusCode": 429,
              "message": "ThrottlerException: Too Many Requests"
            }
          }
        }
      }
    }
  })
  @ApiBody({ description: 'Topic and Email', examples: { default: { value: { topic: "string", email: "string" } } } })
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('/generateOutline')
  async generateOutline(
    @Body() body: { topic: string, email: string }
  ): Promise<any> {
    const { email, topic } = body
    return this.appService.generateOutline(topic, email);
  }
}
