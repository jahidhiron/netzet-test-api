import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config';
import { WinstonModule } from 'nest-winston';
import { AppLogger, createWinstonConfig } from './common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createWinstonConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppLogger],
})
export class AppModule {}
