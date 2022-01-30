import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const main = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  await app.listen(4444)
}

main().catch(console.error)