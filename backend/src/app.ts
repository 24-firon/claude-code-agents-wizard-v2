import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { prettyJSON } from 'hono/pretty-json';

import { errorHandler } from './middleware/error';
import { rateLimiter } from './middleware/rateLimit';
import { securityMiddleware, requestIdMiddleware } from './middleware/security';
import { requestLoggingMiddleware } from './middleware/logging';
import { routes } from './routes';
import { env } from './config/env';

const app = new Hono();

// Request ID (first, for tracing)
app.use('*', requestIdMiddleware);

// Logging
if (env.NODE_ENV !== 'test') {
  app.use('*', requestLoggingMiddleware);
}

// Security
app.use('*', securityMiddleware);
app.use('*', secureHeaders());

// CORS
app.use('*', cors({
  origin: env.NODE_ENV === 'production'
    ? ['https://portal.ki-agentur.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposeHeaders: ['X-Request-Id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400,
}));

// Rate Limiting (global)
app.use('*', rateLimiter());

// Pretty JSON in development
if (env.NODE_ENV === 'development') {
  app.use('*', prettyJSON());
}

// Health Check (no auth required)
app.get('/health', (c) => c.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  environment: env.NODE_ENV,
}));

// API Routes
app.route('/api', routes);

// Error Handler
app.onError(errorHandler);

// 404 Handler
app.notFound((c) => c.json({
  success: false,
  error: 'Not Found',
  path: c.req.path,
}, 404));

export { app };
