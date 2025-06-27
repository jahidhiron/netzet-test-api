import { Injectable, LoggerService } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class AppLogger implements LoggerService {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    if (trace) {
      this.logger.error(message, { context });
    } else {
      this.logger.error(message, { context, trace });
    }
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
