/* eslint-disable @typescript-eslint/no-floating-promises */
import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger, HttpErrorFilter, LoggingInterceptor } from './common';

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new HttpErrorFilter(logger));

  await app.listen(process.env.PORT ?? 3000);
  logger.log(
    `Application started on port ${process.env.PORT || 3000}`,
    'Bootstrap',
  );
}

bootstrap();
