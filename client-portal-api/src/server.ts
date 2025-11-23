import express, { Application } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { env } from './config/env';
import { morganStream } from './utils/logger';
import { helmetMiddleware, corsMiddleware } from './middleware/security.middleware';
import { globalRateLimiter } from './middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { detectAttacks } from './middleware/validation.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import webhookRoutes from './routes/webhook.routes';

export const createApp = (): Application => {
  const app = express();

  // Trust proxy (for Railway/Vercel deployments)
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmetMiddleware);
  app.use(corsMiddleware);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // Compression
  app.use(compression());

  // Logging
  app.use(
    morgan(
      env.NODE_ENV === 'development'
        ? 'dev'
        : ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
      { stream: morganStream }
    )
  );

  // Attack detection
  app.use(detectAttacks);

  // Rate limiting
  app.use(globalRateLimiter);

  // Health check (no auth required)
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    });
  });

  // API version prefix
  const apiPrefix = `/api/${env.API_VERSION}`;

  // Routes
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}`, dashboardRoutes);
  app.use(`${apiPrefix}/webhooks`, webhookRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
