import { serve } from '@hono/node-server';
import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

async function main() {
  logger.info(`Starting server in ${env.NODE_ENV} mode...`);

  serve({
    fetch: app.fetch,
    port: env.PORT,
  }, (info) => {
    logger.info(`🚀 Server running on http://localhost:${info.port}`);
    logger.info(`📋 Health check: http://localhost:${info.port}/health`);
    logger.info(`📡 API base: http://localhost:${info.port}/api`);
  });
}

main().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
