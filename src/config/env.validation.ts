import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Server
  PORT: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().default(3000)
  ),

  // Database
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().default(5432)
  ),
  DATABASE_USERNAME: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  DATABASE_URL: z.url(),

  // Connection Pool
  DB_POOL_MIN: z.preprocess(
    (val) => Number(val),
    z.number().int().nonnegative().default(2)
  ),
  DB_POOL_MAX: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().default(10)
  ),
  DB_POOL_IDLE_TIMEOUT: z.preprocess(
    (val) => Number(val),
    z.number().int().nonnegative().default(30000)
  ),
  DB_POOL_CONNECTION_TIMEOUT: z.preprocess(
    (val) => Number(val),
    z.number().int().nonnegative().default(5000)
  ),

  // Security
  JWT_SECRET: z.string().min(8),
  API_RATE_LIMIT: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().default(100)
  ),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_FILE_ENABLED: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(true)
  ),
});

// ----------------------
// 2. Create type from schema
// ----------------------
export type EnvConfig = z.infer<typeof envSchema>;

// ----------------------
// 3. Validation function
// ----------------------
export function validateEnv(config: unknown): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
  }

  return result.data;
}

// ----------------------
// 4. Example usage
// ----------------------
//export const env = validateEnv(process.env);

/*
Now you can do:
env.DATABASE_URL
env.PORT
env.LOG_FILE_ENABLED
...with full type safety and autocomplete
*/
