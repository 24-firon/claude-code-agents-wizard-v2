import { Hono } from 'hono';
import { auth } from './auth.routes';
import { dashboard } from './dashboard.routes';
import { documents } from './documents.routes';
import { workflows } from './workflows.routes';
import { notifications } from './notifications.routes';

const routes = new Hono();

// Mount routes
routes.route('/auth', auth);
routes.route('/dashboard', dashboard);
routes.route('/documents', documents);
routes.route('/workflows', workflows);
routes.route('/notifications', notifications);

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
    workflows: {
      'GET /api/workflows': 'List workflows',
      'GET /api/workflows/:id': 'Get workflow',
      'GET /api/workflows/:id/logs': 'Logs (CTO+)',
      'GET /api/workflows/:id/stats': 'Stats (CTO+)',
      'POST /api/workflows/:id/trigger': 'Trigger (CTO+)',
    },
    notifications: {
      'GET /api/notifications': 'List notifications',
      'GET /api/notifications/unread-count': 'Unread count',
      'PATCH /api/notifications/:id/read': 'Mark read',
      'PATCH /api/notifications/read-all': 'Mark all read',
      'DELETE /api/notifications/:id': 'Delete',
    },
    webhooks: '/api/webhooks/* (Phase 5)',
  },
}));

export { routes };
