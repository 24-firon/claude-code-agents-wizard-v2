import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32).default('development-secret-key-min-32-chars!!'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
