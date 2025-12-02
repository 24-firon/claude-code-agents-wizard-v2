import { Hono } from 'hono';
import { auth } from './auth.routes';

const routes = new Hono();

// Mount auth routes
routes.route('/auth', auth);

// API Info
routes.get('/', (c) => c.json({
  name: 'KI Agentur Portal API',
  version: '1.0.0',
  endpoints: {
    auth: {
      'POST /api/auth/login': 'Login with email/password',
      'POST /api/auth/register': 'Register new user',
      'POST /api/auth/refresh': 'Refresh access token',
      'POST /api/auth/logout': 'Logout (revoke refresh token)',
      'GET /api/auth/me': 'Get current user (protected)',
      'PATCH /api/auth/me': 'Update profile (protected)',
      'POST /api/auth/change-password': 'Change password (protected)',
      'POST /api/auth/logout-all': 'Logout all devices (protected)',
    },
    dashboard: '/api/dashboard/* (coming soon)',
    documents: '/api/documents/* (coming soon)',
    workflows: '/api/workflows/* (coming soon)',
    webhooks: '/api/webhooks/* (coming soon)',
  },
}));

export { routes };
