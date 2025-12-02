import { Hono } from 'hono';

const routes = new Hono();

// Placeholder routes - will be expanded in later phases
routes.get('/', (c) => c.json({
  message: 'KI Agentur Portal API v1.0.0',
  endpoints: {
    auth: '/api/auth/*',
    dashboard: '/api/dashboard/*',
    documents: '/api/documents/*',
    workflows: '/api/workflows/*',
    webhooks: '/api/webhooks/*',
  }
}));

export { routes };
