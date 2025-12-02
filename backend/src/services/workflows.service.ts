import { prisma } from '../config/database';
import { HTTPException } from 'hono/http-exception';
import { WorkflowQueryInput, WorkflowLogsQueryInput } from '../schemas/workflows.schema';
import { Prisma } from '@prisma/client';

export async function getWorkflows(projectId: string, query: WorkflowQueryInput) {
  const { page, limit, isActive, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.WorkflowWhereInput = {
    projectId,
    ...(isActive !== undefined && { isActive }),
  };

  const [workflows, total] = await Promise.all([
    prisma.workflow.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        _count: {
          select: { logs: true },
        },
      },
    }),
    prisma.workflow.count({ where }),
  ]);

  return {
    items: workflows.map(w => ({
      ...w,
      totalExecutions: w._count.logs,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getWorkflowById(workflowId: string, projectId: string) {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, projectId },
    include: {
      _count: {
        select: { logs: true },
      },
      logs: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!workflow) {
    throw new HTTPException(404, { message: 'Workflow not found' });
  }

  return {
    ...workflow,
    totalExecutions: workflow._count.logs,
    recentLogs: workflow.logs,
  };
}

export async function getWorkflowLogs(
  workflowId: string,
  projectId: string,
  query: WorkflowLogsQueryInput
) {
  const { page, limit, status } = query;
  const skip = (page - 1) * limit;

  // Verify workflow belongs to project
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, projectId },
  });

  if (!workflow) {
    throw new HTTPException(404, { message: 'Workflow not found' });
  }

  const where: Prisma.WorkflowLogWhereInput = {
    workflowId,
    ...(status && { status }),
  };

  const [logs, total] = await Promise.all([
    prisma.workflowLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.workflowLog.count({ where }),
  ]);

  return {
    items: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getWorkflowStats(workflowId: string, projectId: string) {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, projectId },
  });

  if (!workflow) {
    throw new HTTPException(404, { message: 'Workflow not found' });
  }

  // Get stats for last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [allTimeLogs, recentLogs] = await Promise.all([
    prisma.workflowLog.findMany({
      where: { workflowId },
    }),
    prisma.workflowLog.findMany({
      where: {
        workflowId,
        createdAt: { gte: sevenDaysAgo },
      },
    }),
  ]);

  const calculateStats = (logs: typeof allTimeLogs) => {
    const success = logs.filter(l => l.status === 'SUCCESS').length;
    const failed = logs.filter(l => l.status === 'FAILED').length;
    const total = logs.length;
    const avgTime = total > 0
      ? Math.round(logs.reduce((sum, l) => sum + l.executionTime, 0) / total)
      : 0;

    return {
      total,
      success,
      failed,
      successRate: total > 0 ? Math.round((success / total) * 100) : 100,
      avgExecutionTime: avgTime,
    };
  };

  return {
    workflowId,
    workflowName: workflow.name,
    allTime: calculateStats(allTimeLogs),
    lastWeek: calculateStats(recentLogs),
    lastRunAt: workflow.lastRunAt,
    isActive: workflow.isActive,
  };
}

export async function triggerWorkflow(
  workflowId: string,
  projectId: string,
  inputData?: Record<string, unknown>
) {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, projectId },
  });

  if (!workflow) {
    throw new HTTPException(404, { message: 'Workflow not found' });
  }

  if (!workflow.isActive) {
    throw new HTTPException(400, { message: 'Workflow is not active' });
  }

  // Create a pending log entry
  const log = await prisma.workflowLog.create({
    data: {
      workflowId,
      status: 'PENDING',
      executionTime: 0,
      inputData: (inputData || {}) as Prisma.InputJsonValue,
    },
  });

  // In a real implementation, this would trigger the n8n workflow
  // For now, we return the pending log
  return {
    message: 'Workflow trigger initiated',
    logId: log.id,
    workflowId: workflow.id,
    n8nId: workflow.n8nId,
  };
}
