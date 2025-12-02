import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { requireMinRole } from '../middleware/rbac';
import { dateRangeSchema, activityQuerySchema } from '../schemas/dashboard.schema';
import * as dashboardService from '../services/dashboard.service';

const dashboard = new Hono();

// All dashboard routes require authentication
dashboard.use('/*', authMiddleware);

// GET /dashboard - Overview
dashboard.get('/', async (c) => {
  const user = c.get('user');
  const overview = await dashboardService.getDashboardOverview(user.sub, user.projectId);

  return c.json({
    success: true,
    data: overview,
  });
});

// GET /dashboard/health - Health Score Details
dashboard.get('/health', async (c) => {
  const user = c.get('user');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const health = await dashboardService.getHealthScoreDetails(user.projectId);

  return c.json({
    success: true,
    data: health,
  });
});

// GET /dashboard/metrics - Detailed Metrics (CTO+ only)
dashboard.get('/metrics', requireMinRole('CTO'), zValidator('query', dateRangeSchema), async (c) => {
  const user = c.get('user');
  const { startDate, endDate } = c.req.valid('query');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const metrics = await dashboardService.getDashboardMetrics(
    user.projectId,
    startDate ? new Date(startDate) : undefined,
    endDate ? new Date(endDate) : undefined
  );

  return c.json({
    success: true,
    data: metrics,
  });
});

// GET /dashboard/activity - Recent Activity
dashboard.get('/activity', zValidator('query', activityQuerySchema), async (c) => {
  const user = c.get('user');
  const { limit, offset } = c.req.valid('query');

  const activity = await dashboardService.getRecentActivity(user.sub, limit, offset);

  return c.json({
    success: true,
    data: activity,
  });
});

export { dashboard };
