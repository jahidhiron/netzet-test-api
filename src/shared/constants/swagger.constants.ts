import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { SwaggerCustomOptions } from '@nestjs/swagger';

export const SWAGGER_PATH = 'api-docs';
export const SWAGGER_VERSION = '1.0.0';
export const SWAGGER_BEARER_AUTH: SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  name: 'Authorization',
  in: 'header',
};
export const SWAGGER_BEARER_AUTH_NAME = 'access-token';
export const SWAGGER_CONFIG: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true,
  },
  customSiteTitle: 'API Documentation | Netzet Test',
};
export const SWAGGER_CUSTOM_SITE_TITLE = 'Netzet Test API Documentation';
export const SWAGGER_DESCRIPTION = 'API documentation for Netzet Test project';
export const SWAGGER_TITLE = 'Netzet Test API Documentation';
