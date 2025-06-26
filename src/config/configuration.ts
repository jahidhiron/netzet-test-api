const env = process.env.NODE_ENV || 'development';

export default () => ({
  env,
  logDir: process.env.LOG_DIR || 'logs',
  dev: env === 'development',
  staging: env === 'staging',
  prod: env === 'production',
  port: parseInt(process.env.PORT ?? '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'mydb',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  swaggerUser: process.env.SWAGGER_USER,
  swaggerPassword: process.env.SWAGGER_PASSWORD,
});
