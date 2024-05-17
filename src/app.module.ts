import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [
    // GLOBAL LIMITER OF 5 APIS CALLS IN 1 MINUTE
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
