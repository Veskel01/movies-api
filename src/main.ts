import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getGlobalProperties } from './main.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const appPort = configService.get<number>('APP_PORT');

  const { filters, pipes } = getGlobalProperties();

  app.useGlobalFilters(...filters);

  app.useGlobalPipes(...pipes);

  app.enableShutdownHooks();

  await app.listen(appPort || 4000);
}
bootstrap();
