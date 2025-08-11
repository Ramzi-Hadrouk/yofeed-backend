import { registerAs } from '@nestjs/config';
import { validateEnv, EnvConfig } from './env.validation';

export const appConfig = registerAs('app', () => {
  const env = validateEnv(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,                    // ✅ number
    jwtSecret: env.JWT_SECRET,
    apiRateLimit: env.API_RATE_LIMIT,  // ✅ number
    logLevel: env.LOG_LEVEL,
    logFileEnabled: env.LOG_FILE_ENABLED, // ✅ boolean
  };
});
