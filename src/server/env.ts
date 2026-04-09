import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3000),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_ADMIN_EMAILS: z.string().optional(),
  AUTH_STYLIST_EMAILS: z.string().optional(),
  MINIO_ENDPOINT: z.string().optional(),
  MINIO_PORT: z.coerce.number().int().positive().optional(),
  MINIO_USE_SSL: z.string().optional(),
  MINIO_ACCESS_KEY: z.string().optional(),
  MINIO_SECRET_KEY: z.string().optional(),
  MINIO_BUCKET: z.string().optional(),
  MINIO_PUBLIC_URL: z.string().url().optional(),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  API_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120)
});

export type ServerEnv = z.infer<typeof envSchema>;

const DEFAULT_DEV_AUTH_SECRET = "mandala-dev-session-secret";

export function getServerEnv(): ServerEnv {
  return envSchema.parse(process.env);
}

export function getStartupWarnings(env = getServerEnv()) {
  const warnings: string[] = [];

  if (!env.DATABASE_URL) {
    warnings.push("DATABASE_URL is not configured. Database-backed commerce flows will be unavailable.");
  }

  if (!env.AUTH_SECRET || env.AUTH_SECRET === "change-me" || env.AUTH_SECRET === DEFAULT_DEV_AUTH_SECRET) {
    warnings.push("AUTH_SECRET is using a non-production value. Replace it before any public deployment.");
  }

  if (!env.MINIO_ENDPOINT || !env.MINIO_ACCESS_KEY || !env.MINIO_SECRET_KEY) {
    warnings.push("MinIO storage is not fully configured. Uploads will fail until storage credentials are set.");
  }

  return warnings;
}

export function assertProductionEnv(env = getServerEnv()) {
  if (env.NODE_ENV !== "production") {
    return env;
  }

  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be configured in production.");
  }

  if (!env.AUTH_SECRET || env.AUTH_SECRET === "change-me" || env.AUTH_SECRET === DEFAULT_DEV_AUTH_SECRET) {
    throw new Error("AUTH_SECRET must be configured with a strong private value in production.");
  }

  if (!env.NEXT_PUBLIC_APP_URL) {
    throw new Error("NEXT_PUBLIC_APP_URL must be configured in production.");
  }

  return env;
}

