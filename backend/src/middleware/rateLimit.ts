import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { env } from '../config/env';

// In-memory store for rate limiting (use Redis in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
  keyGenerator?: (c: Context) => string;
  skip?: (c: Context) => boolean;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 100,           // 100 requests per minute
};

/**
 * Rate limiting middleware
 */
export function rateLimiter(config: Partial<RateLimitConfig> = {}) {
  const { windowMs, max, keyGenerator, skip } = { ...defaultConfig, ...config };

  // Cleanup old entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requestCounts.entries()) {
      if (value.resetAt < now) {
        requestCounts.delete(key);
      }
    }
  }, windowMs);

  return async (c: Context, next: Next) => {
    // Skip rate limiting if configured
    if (skip?.(c)) {
      await next();
      return;
    }

    // Generate key for rate limiting
    const key = keyGenerator?.(c) || getClientIp(c);
    const now = Date.now();

    // Get or create rate limit entry
    let entry = requestCounts.get(key);

    if (!entry || entry.resetAt < now) {
      entry = { count: 0, resetAt: now + windowMs };
      requestCounts.set(key, entry);
    }

    entry.count++;

    // Set rate limit headers
    c.header('X-RateLimit-Limit', String(max));
    c.header('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    c.header('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

    // Check if rate limit exceeded
    if (entry.count > max) {
      c.header('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      throw new HTTPException(429, {
        message: 'Too many requests, please try again later',
      });
    }

    await next();
  };
}

/**
 * Stricter rate limiter for authentication endpoints
 */
export const authRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 requests per minute
  keyGenerator: (c) => `auth:${getClientIp(c)}`,
});

/**
 * Stricter rate limiter for webhook endpoints
 */
export const webhookRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 requests per minute (1 per second avg)
  keyGenerator: (c) => `webhook:${getClientIp(c)}`,
});

/**
 * Helper to get client IP
 */
function getClientIp(c: Context): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    'unknown'
  );
}
