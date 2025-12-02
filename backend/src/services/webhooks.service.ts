import { prisma } from '../config/database';
import { WorkflowEvent } from '../schemas/webhooks.schema';
import { logger } from '../utils/logger';
import * as notificationsService from './notifications.service';
import { Prisma, WorkflowStatus, NotificationType } from '@prisma/client';

/**
 * Handle workflow started event
 */
export async function handleWorkflowStarted(event: WorkflowEvent) {
  const { workflow, execution } = event;

  logger.info(`Workflow started: ${workflow.name} (${workflow.id})`);

  // Find workflow by n8n ID
  const dbWorkflow = await prisma.workflow.findUnique({
    where: { n8nId: workflow.id },
  });

  if (!dbWorkflow) {
    logger.warn(`Unknown workflow: ${workflow.id}`);
    return { processed: false, reason: 'Unknown workflow' };
  }

  // Create log entry
  await prisma.workflowLog.create({
    data: {
      workflowId: dbWorkflow.id,
      status: 'RUNNING' as WorkflowStatus,
      executionTime: 0,
      inputData: (execution.input || {}) as Prisma.InputJsonValue,
    },
  });

  return { processed: true, workflowId: dbWorkflow.id };
}

/**
 * Handle workflow completed event
 */
export async function handleWorkflowCompleted(event: WorkflowEvent) {
  const { workflow, execution } = event;

  logger.info(`Workflow completed: ${workflow.name} (${workflow.id})`);

  // Find workflow by n8n ID
  const dbWorkflow = await prisma.workflow.findUnique({
    where: { n8nId: workflow.id },
    include: { project: true },
  });

  if (!dbWorkflow) {
    logger.warn(`Unknown workflow: ${workflow.id}`);
    return { processed: false, reason: 'Unknown workflow' };
  }

  // Create success log entry
  await prisma.workflowLog.create({
    data: {
      workflowId: dbWorkflow.id,
      status: 'SUCCESS' as WorkflowStatus,
      executionTime: execution.executionTime || 0,
      inputData: (execution.input || {}) as Prisma.InputJsonValue,
      outputData: (execution.output || {}) as Prisma.InputJsonValue,
    },
  });

  // Update workflow stats
  await updateWorkflowStats(dbWorkflow.id);

  // Notify project users
  await notificationsService.notifyProjectUsers(
    dbWorkflow.projectId,
    'WORKFLOW_SUCCESS' as NotificationType,
    `Workflow "${workflow.name}" erfolgreich`,
    `Der Workflow wurde erfolgreich ausgeführt. Ausführungszeit: ${execution.executionTime}ms`,
    { workflowId: dbWorkflow.id, executionTime: execution.executionTime }
  );

  // Recalculate project health score
  await recalculateHealthScore(dbWorkflow.projectId);

  return { processed: true, workflowId: dbWorkflow.id };
}

/**
 * Handle workflow failed event
 */
export async function handleWorkflowFailed(event: WorkflowEvent) {
  const { workflow, execution } = event;

  logger.error(`Workflow failed: ${workflow.name} (${workflow.id}) - ${execution.errorMessage}`);

  // Find workflow by n8n ID
  const dbWorkflow = await prisma.workflow.findUnique({
    where: { n8nId: workflow.id },
    include: { project: true },
  });

  if (!dbWorkflow) {
    logger.warn(`Unknown workflow: ${workflow.id}`);
    return { processed: false, reason: 'Unknown workflow' };
  }

  // Create failure log entry
  await prisma.workflowLog.create({
    data: {
      workflowId: dbWorkflow.id,
      status: 'FAILED' as WorkflowStatus,
      executionTime: execution.executionTime || 0,
      errorMessage: execution.errorMessage,
      inputData: (execution.input || {}) as Prisma.InputJsonValue,
    },
  });

  // Update workflow stats
  await updateWorkflowStats(dbWorkflow.id);

  // Notify project users (higher priority for failures)
  await notificationsService.notifyProjectUsers(
    dbWorkflow.projectId,
    'WORKFLOW_FAILED' as NotificationType,
    `Workflow "${workflow.name}" fehlgeschlagen`,
    `Der Workflow ist fehlgeschlagen: ${execution.errorMessage || 'Unbekannter Fehler'}`,
    {
      workflowId: dbWorkflow.id,
      error: execution.errorMessage,
      executionTime: execution.executionTime
    }
  );

  // Recalculate project health score
  await recalculateHealthScore(dbWorkflow.projectId);

  return { processed: true, workflowId: dbWorkflow.id };
}

/**
 * Update workflow statistics based on recent logs
 */
async function updateWorkflowStats(workflowId: string) {
  // Get last 100 logs for calculating stats
  const logs = await prisma.workflowLog.findMany({
    where: { workflowId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  if (logs.length === 0) return;

  const successCount = logs.filter(l => l.status === 'SUCCESS').length;
  const successRate = Math.round((successCount / logs.length) * 100);
  const avgExecTime = Math.round(
    logs.reduce((sum, l) => sum + l.executionTime, 0) / logs.length
  );

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      successRate,
      avgExecTime,
      lastRunAt: new Date(),
    },
  });

  logger.info(`Updated workflow stats: ${workflowId} - ${successRate}% success rate`);
}

/**
 * Recalculate project health score
 */
async function recalculateHealthScore(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workflows: { where: { isActive: true } },
      milestones: true,
      documents: true,
    },
  });

  if (!project) return;

  // Calculate workflow health (40% weight)
  const workflowHealth = project.workflows.length > 0
    ? Math.round(
        project.workflows.reduce((sum, w) => sum + w.successRate, 0) /
        project.workflows.length
      )
    : 100;

  // Calculate milestone progress (40% weight)
  const completedMilestones = project.milestones.filter(m => m.completedAt).length;
  const overdueMilestones = project.milestones.filter(
    m => !m.completedAt && m.dueDate < new Date()
  ).length;
  const milestoneProgress = project.milestones.length > 0
    ? Math.max(0, Math.round(
        ((completedMilestones * 100) / project.milestones.length) -
        (overdueMilestones * 10)
      ))
    : 100;

  // Calculate document completeness (20% weight)
  const documentCompleteness = project.documents.length >= 3
    ? 100
    : Math.round((project.documents.length / 3) * 100);

  // Calculate overall health score
  const healthScore = Math.round(
    (workflowHealth * 0.4) +
    (milestoneProgress * 0.4) +
    (documentCompleteness * 0.2)
  );

  await prisma.project.update({
    where: { id: projectId },
    data: { healthScore },
  });

  logger.info(`Updated project health score: ${projectId} - ${healthScore}`);

  // Create health alert if score dropped significantly
  if (healthScore < 70 && project.healthScore >= 70) {
    const users = await prisma.user.findMany({
      where: { projectId },
      select: { id: true },
    });

    for (const user of users) {
      await notificationsService.createNotification(
        user.id,
        'HEALTH_ALERT' as NotificationType,
        'Projekt Health Score gesunken',
        `Der Health Score ist auf ${healthScore}% gefallen. Bitte überprüfen Sie die Workflows und Milestones.`,
        { healthScore, previousScore: project.healthScore }
      );
    }
  }
}

/**
 * Register a new workflow from n8n
 */
export async function registerWorkflow(
  projectId: string,
  n8nId: string,
  name: string,
  description?: string
) {
  // Check if workflow already exists
  const existing = await prisma.workflow.findUnique({
    where: { n8nId },
  });

  if (existing) {
    // Update existing workflow
    return prisma.workflow.update({
      where: { id: existing.id },
      data: { name, description, projectId },
    });
  }

  // Create new workflow
  return prisma.workflow.create({
    data: {
      n8nId,
      name,
      description,
      projectId,
      isActive: true,
    },
  });
}
