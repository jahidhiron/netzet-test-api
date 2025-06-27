import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../logger/logger.service';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  /**
   * Intercepts incoming HTTP requests and logs method, URL, execution time, IP, and user agent.
   * This is helpful for tracking request performance and usage analytics.
   *
   * @param context - The execution context for the request.
   * @param next - The next handler in the request pipeline.
   * @returns Observable of the response stream.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.originalUrl || request.url;
    const ip =
      (request.headers['x-forwarded-for'] as string) ||
      request.ip ||
      request.socket?.remoteAddress ||
      'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(
          `[${method}] ${url} - ${duration}ms | IP: ${ip} | Agent: ${userAgent}`,
          'HTTP_SUCCESS',
        );
      }),
    );
  }
}
