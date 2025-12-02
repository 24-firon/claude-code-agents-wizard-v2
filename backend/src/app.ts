import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { prettyJSON } from 'hono/pretty-json';
import { errorHandler } from './middleware/error';
import { routes } from './routes';

const app = new Hono();

// Global Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://portal.ki-agentur.com'],
  credentials: true,
}));
app.use('*', secureHeaders());
app.use('*', prettyJSON());

// Health Check
app.get('/health', (c) => c.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}));

// API Routes
app.route('/api', routes);

// Error Handler
app.onError(errorHandler);

// 404 Handler
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

export { app };
