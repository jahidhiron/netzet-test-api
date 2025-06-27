import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/logger.service';
import { ignoredLogPaths } from '../logger';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: number = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception.getResponse();

    // Extract message
    let message: string | string[] | undefined;

    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (
      errorResponse &&
      typeof errorResponse === 'object' &&
      ('message' in errorResponse || 'messages' in errorResponse)
    ) {
      if ('message' in errorResponse) {
        message = (errorResponse as { message?: string | string[] }).message;
      } else if ('messages' in errorResponse) {
        message = (errorResponse as { messages?: string | string[] }).messages;
      }
    } else {
      message = undefined;
    }

    // Skip logging
    if (
      ignoredLogPaths.some((path) =>
        typeof path === 'string'
          ? request.url === path
          : path instanceof RegExp && path.test(request.url),
      )
    ) {
      return response.status(status).send();
    }

    const trace = HttpStatus.INTERNAL_SERVER_ERROR
      ? exception.stack
      : undefined;

    this.logger.error(
      `[${request.method}] ${request.url} → ${status} | Message: ${JSON.stringify(
        message,
      )}`,
      trace,
      'HTTP_ERROR',
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      path: request.url,
      method: request.method,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
