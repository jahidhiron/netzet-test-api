import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export const createWinstonConfig = (
  configService: ConfigService,
): winston.LoggerOptions => {
  const prod = configService.get<string>('prod');

  const onlyHttpSuccess = winston.format((info) =>
    info.context === 'HTTP_SUCCESS' ? info : false,
  );

  const onlyErrors = winston.format((info) =>
    info.level === 'error' ? info : false,
  );

  return {
    transports: [
      // Console transport
      new winston.transports.Console({
        level: prod ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          nestWinstonModuleUtilities.format.nestLike('App', {
            prettyPrint: true,
          }),
        ),
      }),

      // File transports for error
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
        format: winston.format.combine(
          onlyErrors(),
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),

      // File transports for success
      new winston.transports.File({
        filename: path.join('logs', 'success.log'),
        level: 'info',
        format: winston.format.combine(
          onlyHttpSuccess(),
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  };
};
