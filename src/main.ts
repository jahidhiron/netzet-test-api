/* eslint-disable @typescript-eslint/no-floating-promises */
import * as fs from 'fs';
import * as path from 'path';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger, HttpErrorFilter, LoggingInterceptor } from './common';
import { LOG_DIR } from './shared';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './swagger'; 
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // create logs directory
  const logDir = path.join(__dirname, '..', LOG_DIR);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  // Create Nest app with buffered logs to capture logs before logger instantiation
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Setup ConfigService to get env variables
  const configService = app.get(ConfigService);

  // Setup your custom logger
  const logger = app.get(AppLogger);
  app.useLogger(logger);

  // Enable security middleware
  app.use(helmet());

  // Enable CORS 
  app.enableCors({
    origin: configService.get<string>('corsOrigin')?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Add global prefix '/api'
  app.setGlobalPrefix('api');

  // Enable global versioning 
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global interceptors and filters for logging and error handling
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new HttpErrorFilter(logger));

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  // Setup Basic Auth for Swagger docs
  const swaggerUser = configService.get<string>('swaggerUser') as string;
  const swaggerPassword = configService.get<string>('swaggerPassword') as string;

  app.use(
    '/api-docs',
    basicAuth({
      challenge: true,
      users: {
        [swaggerUser]: swaggerPassword,
      },
      unauthorizedResponse: () => 'Unauthorized',
    }),
  );

  // Setup Swagger docs
  setupSwagger(app);

  // Start server
  const port = configService.get<number>('PORT') as number;
  await app.listen(port);

  logger.log(`Application started on port ${port}`, 'Bootstrap');
}

bootstrap();
