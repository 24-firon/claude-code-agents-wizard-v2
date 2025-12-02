import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { requireMinRole } from '../middleware/rbac';
import {
  workflowQuerySchema,
  workflowLogsQuerySchema,
  triggerWorkflowSchema,
} from '../schemas/workflows.schema';
import * as workflowsService from '../services/workflows.service';

const workflows = new Hono();

// All workflow routes require authentication
workflows.use('/*', authMiddleware);

// GET /workflows - List workflows
workflows.get('/', zValidator('query', workflowQuerySchema), async (c) => {
  const user = c.get('user');
  const query = c.req.valid('query');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const result = await workflowsService.getWorkflows(user.projectId, query);

  return c.json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
});

// GET /workflows/:id - Get workflow details
workflows.get('/:id', async (c) => {
  const user = c.get('user');
  const workflowId = c.req.param('id');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const workflow = await workflowsService.getWorkflowById(workflowId, user.projectId);

  return c.json({
    success: true,
    data: workflow,
  });
});

// GET /workflows/:id/logs - Get workflow execution logs (CTO+ only)
workflows.get('/:id/logs', requireMinRole('CTO'), zValidator('query', workflowLogsQuerySchema), async (c) => {
  const user = c.get('user');
  const workflowId = c.req.param('id');
  const query = c.req.valid('query');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const result = await workflowsService.getWorkflowLogs(workflowId, user.projectId, query);

  return c.json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
});

// GET /workflows/:id/stats - Get workflow statistics (CTO+ only)
workflows.get('/:id/stats', requireMinRole('CTO'), async (c) => {
  const user = c.get('user');
  const workflowId = c.req.param('id');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const stats = await workflowsService.getWorkflowStats(workflowId, user.projectId);

  return c.json({
    success: true,
    data: stats,
  });
});

// POST /workflows/:id/trigger - Manually trigger workflow (CTO+ only)
workflows.post('/:id/trigger', requireMinRole('CTO'), zValidator('json', triggerWorkflowSchema), async (c) => {
  const user = c.get('user');
  const workflowId = c.req.param('id');
  const { inputData } = c.req.valid('json');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const result = await workflowsService.triggerWorkflow(workflowId, user.projectId, inputData);

  return c.json({
    success: true,
    data: result,
  }, 202);
});

export { workflows };
