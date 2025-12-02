import { Context, Next } from 'hono';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/**
 * Request logging middleware
 */
export async function requestLoggingMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  const requestId = c.get('requestId') || 'unknown';

  // Log request
  logger.info(`→ ${method} ${path}`, { requestId });

  try {
    await next();
  } catch (error) {
    // Error will be handled by error middleware
    throw error;
  } finally {
    const duration = Date.now() - start;
    const status = c.res.status;

    // Log response
    const logLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    logger[logLevel](`← ${method} ${path} ${status} ${duration}ms`, {
      requestId,
      duration,
      status,
    });

    // Log slow requests
    if (duration > 1000 && env.NODE_ENV === 'production') {
      logger.warn(`Slow request: ${method} ${path} took ${duration}ms`, {
        requestId,
        duration,
      });
    }
  }
}
