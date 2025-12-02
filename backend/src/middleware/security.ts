import { Context, Next } from 'hono';
import { env } from '../config/env';

/**
 * Apply additional security headers
 */
export async function securityMiddleware(c: Context, next: Next) {
  await next();

  // HSTS - Enforce HTTPS
  if (env.NODE_ENV === 'production') {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Prevent XSS
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');

  // Content Security Policy
  c.header('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; '));

  // Referrer Policy
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  c.header('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
  ].join(', '));

  // Remove server header
  c.header('X-Powered-By', '');
}

/**
 * Request ID middleware for tracing
 */
export async function requestIdMiddleware(c: Context, next: Next) {
  const requestId = c.req.header('x-request-id') || generateRequestId();
  c.header('X-Request-Id', requestId);
  c.set('requestId', requestId);
  await next();
}

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

declare module 'hono' {
  interface ContextVariableMap {
    requestId: string;
  }
}
