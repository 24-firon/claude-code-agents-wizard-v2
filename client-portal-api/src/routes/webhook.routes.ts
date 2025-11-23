import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';
import { webhookRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Webhook endpoint (no authentication - verified via HMAC signature)
router.post(
  '/n8n/:projectId',
  webhookRateLimiter,
  webhookController.handleN8nWebhook.bind(webhookController)
);

export default router;
