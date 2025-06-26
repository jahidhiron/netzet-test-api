import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/logger.service';
import { ignoredLogPaths } from '../logger';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  /**
   * Handles all HttpExceptions thrown in the application.
   * Logs error details unless the request path is in the ignored list,
   * and returns a structured JSON response to the client.
   *
   * @param exception - The thrown HttpException instance.
   * @param host - The arguments host containing context.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    const message =
      typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any).message;

    // Skip logging if the URL matches any ignored log paths
    if (
      ignoredLogPaths.some((path) =>
        typeof path === 'string'
          ? request.url === path
          : path instanceof RegExp && path.test(request.url),
      )
    ) {
      return response.status(status).send();
    }

    // Log the error with method, URL, status, and stack trace
    this.logger.error(
      `[${request.method}] ${request.url} → ${status} | Message: ${JSON.stringify(message)}`,
      exception.stack,
      'HTTP_ERROR', 
    );

    // Send structured error response
    response.status(status).json({
      statusCode: status,
      path: request.url,
      method: request.method,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
