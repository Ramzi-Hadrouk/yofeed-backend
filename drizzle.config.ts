import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment-specific config
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFile });

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});