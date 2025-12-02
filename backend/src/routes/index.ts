import { Hono } from 'hono';
import { auth } from './auth.routes';
import { dashboard } from './dashboard.routes';
import { documents } from './documents.routes';

const routes = new Hono();

// Mount routes
routes.route('/auth', auth);
routes.route('/dashboard', dashboard);
routes.route('/documents', documents);

// API Info
routes.get('/', (c) => c.json({
  name: 'KI Agentur Portal API',
  version: '1.0.0',
  endpoints: {
    auth: {
      'POST /api/auth/login': 'Login',
      'POST /api/auth/register': 'Register',
      'POST /api/auth/refresh': 'Refresh token',
      'GET /api/auth/me': 'Get current user',
    },
    dashboard: {
      'GET /api/dashboard': 'Dashboard overview',
      'GET /api/dashboard/health': 'Health score details',
      'GET /api/dashboard/metrics': 'Detailed metrics (CTO+)',
      'GET /api/dashboard/activity': 'Recent activity',
    },
    documents: {
      'GET /api/documents': 'List documents',
      'GET /api/documents/search': 'Search documents',
      'GET /api/documents/:id': 'Get document',
      'POST /api/documents': 'Create document (PM+)',
      'PATCH /api/documents/:id': 'Update document (PM+)',
      'DELETE /api/documents/:id': 'Delete document (ADMIN)',
      'GET /api/documents/:id/versions': 'Get versions',
      'POST /api/documents/:id/versions': 'Create version (PM+)',
    },
    workflows: '/api/workflows/* (coming next)',
    notifications: '/api/notifications/* (coming next)',
  },
}));

export { routes };
