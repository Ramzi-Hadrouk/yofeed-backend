import { registerAs } from '@nestjs/config';
import { validateEnv, EnvConfig } from './env.validation';

export const databaseConfig = registerAs('database', () => {
  const env = validateEnv(process.env);

  return {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT, // ✅ number
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    url: env.DATABASE_URL,
    pool: {
      min: env.DB_POOL_MIN,                               // ✅ number
      max: env.DB_POOL_MAX,                               // ✅ number
      idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT,        // ✅ number
      connectionTimeoutMillis: env.DB_POOL_CONNECTION_TIMEOUT, // ✅ number
    },
  };
});
