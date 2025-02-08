import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import configuration from './configs/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = configuration();

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = config.port || 3000;

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
