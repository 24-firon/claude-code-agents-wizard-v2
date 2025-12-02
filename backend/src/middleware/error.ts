import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { env } from '../config/env';

export function errorHandler(err: Error, c: Context) {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Zod validation errors
  if (err instanceof ZodError) {
    return c.json({
      error: 'Validation Error',
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    }, 400);
  }

  // HTTP Exceptions
  if (err instanceof HTTPException) {
    return c.json({
      error: err.message,
    }, err.status);
  }

  // Generic errors
  return c.json({
    error: env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  }, 500);
}
