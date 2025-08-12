import { registerAs } from '@nestjs/config';


export const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  url: process.env.DATABASE_URL,
  pool: {
    min: Number(process.env.DB_POOL_MIN),
    max: Number(process.env.DB_POOL_MAX),
    idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT),
    connectionTimeoutMillis: Number(process.env.DB_POOL_CONNECTION_TIMEOUT),
  },
}));
