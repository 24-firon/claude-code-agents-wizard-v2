import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError, BadRequestError } from '../utils/errors';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { emailService } from '../services/email.service';

export class WebhookController {
  async handleN8nWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;

      // Verify webhook signature
      const signature = req.headers['x-n8n-signature'] as string;
      if (!signature) {
        throw new UnauthorizedError('Missing webhook signature');
      }

      const payload = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', env.WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

      // Timing-safe comparison
      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature.replace('sha256=', '')),
        Buffer.from(expectedSignature)
      );

      if (!isValid) {
        logger.warn('Invalid webhook signature', { projectId, signature });
        throw new UnauthorizedError('Invalid webhook signature');
      }

      // Store webhook event for debugging
      await prisma.webhookEvent.create({
        data: {
          projectId,
          eventType: req.body.event || 'unknown',
          payload: req.body,
        },
      });

      // Process workflow event
      const { event, workflow, execution } = req.body;

      if (!event || !workflow || !execution) {
        throw new BadRequestError('Invalid webhook payload');
      }

      // Create workflow log
      const workflowLog = await prisma.workflowLog.create({
        data: {
          projectId,
          n8nWorkflowId: workflow.id,
          n8nWorkflowName: workflow.name || 'Unknown Workflow',
          executionId: execution.id,
          status: execution.status === 'success' ? 'SUCCESS' : execution.status === 'error' ? 'FAILED' : 'IN_PROGRESS',
          executionTimeMs: execution.executionTime || null,
          errorMessage: execution.errorMessage || null,
          executionDetails: execution,
          inputData: execution.input || null,
          outputData: execution.output || null,
        },
      });

      // Update project health score (async)
      this.updateProjectHealth(projectId).catch((error) => {
        logger.error('Failed to update project health:', error);
      });

      // Send notifications (async)
      if (execution.status === 'error') {
        this.sendWorkflowFailedNotifications(projectId, workflow.name, execution.errorMessage)
          .catch((error) => logger.error('Failed to send notifications:', error));
      } else if (execution.status === 'success') {
        this.sendWorkflowCompletedNotifications(projectId, workflow.name)
          .catch((error) => logger.error('Failed to send notifications:', error));
      }

      // Mark webhook as processed
      await prisma.webhookEvent.updateMany({
        where: { projectId, processed: false },
        data: { processed: true, processedAt: new Date() },
      });

      logger.info(`Webhook processed for project ${projectId}`, {
        event,
        workflowId: workflow.id,
        status: execution.status,
      });

      sendSuccess(res, {
        message: 'Webhook processed successfully',
        workflowLogId: workflowLog.id,
      });
    } catch (error) {
      next(error);
    }
  }

  private async updateProjectHealth(projectId: string) {
    // Calculate health score from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const workflowStats = await prisma.workflowLog.groupBy({
      by: ['status'],
      where: {
        projectId,
        createdAt: { gte: sevenDaysAgo },
        status: { not: 'IN_PROGRESS' },
      },
      _count: { id: true },
    });

    const total = workflowStats.reduce((sum, s) => sum + s._count.id, 0);
    const successful = workflowStats.find(s => s.status === 'SUCCESS')?._count.id || 0;
    const healthScore = total > 0 ? Math.round((successful / total) * 100) : 100;

    // Determine status
    let status: 'ON_TRACK' | 'AT_RISK' | 'BLOCKED';
    if (healthScore >= 80) status = 'ON_TRACK';
    else if (healthScore >= 50) status = 'AT_RISK';
    else status = 'BLOCKED';

    await prisma.project.update({
      where: { id: projectId },
      data: { healthScore, status },
    });
  }

  private async sendWorkflowFailedNotifications(
    projectId: string,
    workflowName: string,
    errorMessage: string | null
  ) {
    // Get users who want workflow failure notifications
    const users = await prisma.user.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      include: {
        notificationPreferences: true,
      },
    });

    for (const user of users) {
      const prefs = user.notificationPreferences;

      // Create in-app notification
      if (!prefs || prefs.inAppEnabled) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'WORKFLOW_FAILED',
            title: `Workflow Failed: ${workflowName}`,
            body: errorMessage || 'Workflow execution failed',
            data: { workflowName, errorMessage },
          },
        });
      }

      // Send email
      if (!prefs || (prefs.emailEnabled && prefs.workflowFailed)) {
        await emailService.sendNotificationEmail(
          user.email,
          `Workflow Failed: ${workflowName}`,
          errorMessage || 'Workflow execution failed',
          { workflowName }
        );
      }
    }
  }

  private async sendWorkflowCompletedNotifications(
    projectId: string,
    workflowName: string
  ) {
    const users = await prisma.user.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      include: {
        notificationPreferences: true,
      },
    });

    for (const user of users) {
      const prefs = user.notificationPreferences;

      // Create in-app notification
      if (!prefs || prefs.inAppEnabled) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'WORKFLOW_COMPLETED',
            title: `Workflow Completed: ${workflowName}`,
            body: 'Workflow execution completed successfully',
            data: { workflowName },
          },
        });
      }

      // Send email only if preference is enabled
      if (prefs && prefs.emailEnabled && prefs.workflowCompleted) {
        await emailService.sendNotificationEmail(
          user.email,
          `Workflow Completed: ${workflowName}`,
          'Workflow execution completed successfully',
          { workflowName }
        );
      }
    }
  }
}

export const webhookController = new WebhookController();
