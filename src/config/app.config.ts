import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  apiRateLimit: Number(process.env.API_RATE_LIMIT),
  logLevel: process.env.LOG_LEVEL,
  logFileEnabled: process.env.LOG_FILE_ENABLED === 'true',
}));