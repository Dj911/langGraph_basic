import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: "*",
    methods: "POST",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(4000);
}
bootstrap();
