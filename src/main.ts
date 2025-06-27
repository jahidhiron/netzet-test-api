/* eslint-disable @typescript-eslint/no-floating-promises */
import * as fs from 'fs';
import * as path from 'path';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger, HttpErrorFilter, LoggingInterceptor } from './common';
import {
  ALLOW_METHODS,
  API_PREFIX,
  API_VERSION,
  LOG_DIR,
  SWAGGER_PATH,
} from './shared';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Logs directory
  const logDir = path.join(__dirname, '..', LOG_DIR);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') as number;
  const swaggerUser = configService.get<string>('swaggerUser') as string;
  const swaggerPassword = configService.get<string>(
    'swaggerPassword',
  ) as string;

  // Logger
  const logger = app.get(AppLogger);
  app.useLogger(logger);

  // Security middleware
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get<string>('corsOrigin')?.split(',') || '*',
    methods: ALLOW_METHODS,
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix(API_PREFIX, { exclude: [`/${SWAGGER_PATH}`] });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });

  // Global interceptors and filters
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new HttpErrorFilter(logger));

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  // Setup Swagger
  app.use(
    `/${SWAGGER_PATH}`,
    basicAuth({
      challenge: true,
      users: {
        [swaggerUser]: swaggerPassword,
      },
      unauthorizedResponse: () => 'Unauthorized',
    }),
  );
  setupSwagger(app);

  // Start server
  await app.listen(port);
  logger.log(`Application started on port ${port}`, 'Bootstrap');
}

bootstrap();
