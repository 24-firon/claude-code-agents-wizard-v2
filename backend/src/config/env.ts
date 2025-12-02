import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/ki_portal'),

  // Redis (optional for now)
  REDIS_URL: z.string().url().optional(),

  // JWT
  JWT_SECRET: z.string().min(32).default('development-secret-key-min-32-chars!!'),
  JWT_REFRESH_SECRET: z.string().min(32).default('development-refresh-secret-32-chars!!'),

  // R2/S3 (optional for now)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().default('ki-portal-documents'),

  // Email (optional for now)
  RESEND_API_KEY: z.string().optional(),

  // n8n
  N8N_WEBHOOK_SECRET: z.string().min(32).default('n8n-webhook-secret-minimum-32-chars!!'),
  N8N_BASE_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
