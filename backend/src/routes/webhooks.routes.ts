import { Hono } from 'hono';
import { webhookAuthMiddleware } from '../middleware/webhook';
import { workflowEventSchema } from '../schemas/webhooks.schema';
import * as webhooksService from '../services/webhooks.service';
import { logger } from '../utils/logger';

const webhooks = new Hono();

// All webhook routes require signature verification
webhooks.use('/*', webhookAuthMiddleware);

// POST /webhooks/n8n/workflow - Handle all workflow events
webhooks.post('/n8n/workflow', async (c) => {
  const payload = c.get('webhookPayload');

  // Validate payload
  const result = workflowEventSchema.safeParse(payload);

  if (!result.success) {
    logger.warn('Invalid webhook payload', result.error.issues);
    return c.json({
      success: false,
      error: 'Invalid payload',
      details: result.error.issues,
    }, 400);
  }

  const event = result.data;

  // Route to appropriate handler based on event type
  let response;
  switch (event.event) {
    case 'workflow_started':
      response = await webhooksService.handleWorkflowStarted(event);
      break;
    case 'workflow_completed':
      response = await webhooksService.handleWorkflowCompleted(event);
      break;
    case 'workflow_failed':
      response = await webhooksService.handleWorkflowFailed(event);
      break;
    default:
      return c.json({ success: false, error: 'Unknown event type' }, 400);
  }

  return c.json({
    success: true,
    data: response,
  });
});

// POST /webhooks/n8n/workflow-started - Explicit started endpoint
webhooks.post('/n8n/workflow-started', async (c) => {
  const payload = c.get('webhookPayload') as Record<string, unknown>;
  const event = {
    ...payload,
    event: 'workflow_started' as const,
  };

  const result = workflowEventSchema.safeParse(event);
  if (!result.success) {
    return c.json({ success: false, error: 'Invalid payload' }, 400);
  }

  const response = await webhooksService.handleWorkflowStarted(result.data);
  return c.json({ success: true, data: response });
});

// POST /webhooks/n8n/workflow-completed - Explicit completed endpoint
webhooks.post('/n8n/workflow-completed', async (c) => {
  const payload = c.get('webhookPayload') as Record<string, unknown>;
  const event = {
    ...payload,
    event: 'workflow_completed' as const,
  };

  const result = workflowEventSchema.safeParse(event);
  if (!result.success) {
    return c.json({ success: false, error: 'Invalid payload' }, 400);
  }

  const response = await webhooksService.handleWorkflowCompleted(result.data);
  return c.json({ success: true, data: response });
});

// POST /webhooks/n8n/workflow-failed - Explicit failed endpoint
webhooks.post('/n8n/workflow-failed', async (c) => {
  const payload = c.get('webhookPayload') as Record<string, unknown>;
  const event = {
    ...payload,
    event: 'workflow_failed' as const,
  };

  const result = workflowEventSchema.safeParse(event);
  if (!result.success) {
    return c.json({ success: false, error: 'Invalid payload' }, 400);
  }

  const response = await webhooksService.handleWorkflowFailed(result.data);
  return c.json({ success: true, data: response });
});

// POST /webhooks/n8n/register - Register new workflow
webhooks.post('/n8n/register', async (c) => {
  const payload = c.get('webhookPayload') as {
    projectId: string;
    n8nId: string;
    name: string;
    description?: string;
  };

  if (!payload.projectId || !payload.n8nId || !payload.name) {
    return c.json({
      success: false,
      error: 'Missing required fields: projectId, n8nId, name'
    }, 400);
  }

  const workflow = await webhooksService.registerWorkflow(
    payload.projectId,
    payload.n8nId,
    payload.name,
    payload.description
  );

  return c.json({
    success: true,
    data: workflow,
  }, 201);
});

// GET /webhooks/health - Webhook endpoint health check
webhooks.get('/health', async (c) => {
  return c.json({
    success: true,
    message: 'Webhook endpoint is healthy',
    timestamp: new Date().toISOString(),
  });
});

export { webhooks };
