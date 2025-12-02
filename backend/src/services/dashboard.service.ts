import { prisma } from '../config/database';
import { HTTPException } from 'hono/http-exception';

export interface DashboardOverview {
  project: {
    id: string;
    name: string;
    status: string;
    healthScore: number;
  };
  stats: {
    activeWorkflows: number;
    documentsCount: number;
    upcomingMilestones: number;
    unreadNotifications: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    createdAt: Date;
  }>;
}

export interface HealthScoreDetails {
  overall: number;
  components: {
    workflowHealth: number;
    milestoneProgress: number;
    documentCompleteness: number;
  };
  trend: 'up' | 'down' | 'stable';
}

export async function getDashboardOverview(
  userId: string,
  projectId?: string
): Promise<DashboardOverview> {
  // Get user with project
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { project: true },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  const targetProjectId = projectId || user.projectId;

  if (!targetProjectId) {
    throw new HTTPException(400, { message: 'No project associated with user' });
  }

  // Get project
  const project = await prisma.project.findUnique({
    where: { id: targetProjectId },
  });

  if (!project) {
    throw new HTTPException(404, { message: 'Project not found' });
  }

  // Get stats in parallel
  const [
    activeWorkflows,
    documentsCount,
    upcomingMilestones,
    unreadNotifications,
    recentNotifications,
  ] = await Promise.all([
    prisma.workflow.count({
      where: { projectId: targetProjectId, isActive: true },
    }),
    prisma.document.count({
      where: { projectId: targetProjectId },
    }),
    prisma.milestone.count({
      where: {
        projectId: targetProjectId,
        completedAt: null,
        dueDate: { gte: new Date() },
      },
    }),
    prisma.notification.count({
      where: { userId, readAt: null },
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return {
    project: {
      id: project.id,
      name: project.name,
      status: project.status,
      healthScore: project.healthScore,
    },
    stats: {
      activeWorkflows,
      documentsCount,
      upcomingMilestones,
      unreadNotifications,
    },
    recentActivity: recentNotifications.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.body,
      createdAt: n.createdAt,
    })),
  };
}

export async function getHealthScoreDetails(
  projectId: string
): Promise<HealthScoreDetails> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workflows: {
        where: { isActive: true },
      },
      milestones: true,
      documents: true,
    },
  });

  if (!project) {
    throw new HTTPException(404, { message: 'Project not found' });
  }

  // Calculate workflow health (average success rate)
  const workflowHealth = project.workflows.length > 0
    ? Math.round(
        project.workflows.reduce((sum, w) => sum + w.successRate, 0) /
          project.workflows.length
      )
    : 100;

  // Calculate milestone progress
  const completedMilestones = project.milestones.filter((m) => m.completedAt);
  const overdueMilestones = project.milestones.filter(
    (m) => !m.completedAt && m.dueDate < new Date()
  );
  const milestoneProgress = project.milestones.length > 0
    ? Math.round(
        ((completedMilestones.length * 100) / project.milestones.length) -
          (overdueMilestones.length * 10) // Penalty for overdue
      )
    : 100;

  // Calculate document completeness (simplified)
  const documentCompleteness = project.documents.length >= 3 ? 100 : Math.round((project.documents.length / 3) * 100);

  // Calculate overall score
  const overall = Math.round(
    (workflowHealth * 0.4) + (Math.max(0, milestoneProgress) * 0.4) + (documentCompleteness * 0.2)
  );

  // Determine trend (simplified - compare to stored health score)
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (overall > project.healthScore) trend = 'up';
  else if (overall < project.healthScore) trend = 'down';

  return {
    overall,
    components: {
      workflowHealth,
      milestoneProgress: Math.max(0, milestoneProgress),
      documentCompleteness,
    },
    trend,
  };
}

export async function getDashboardMetrics(
  projectId: string,
  startDate?: Date,
  endDate?: Date
) {
  const dateFilter = {
    ...(startDate && { gte: startDate }),
    ...(endDate && { lte: endDate }),
  };

  const [workflowLogs, milestones] = await Promise.all([
    prisma.workflowLog.findMany({
      where: {
        workflow: { projectId },
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.milestone.findMany({
      where: { projectId },
      orderBy: { dueDate: 'asc' },
    }),
  ]);

  // Calculate metrics
  const totalExecutions = workflowLogs.length;
  const successfulExecutions = workflowLogs.filter((l) => l.status === 'SUCCESS').length;
  const avgExecutionTime = workflowLogs.length > 0
    ? Math.round(workflowLogs.reduce((sum, l) => sum + l.executionTime, 0) / workflowLogs.length)
    : 0;

  return {
    workflows: {
      totalExecutions,
      successfulExecutions,
      failedExecutions: totalExecutions - successfulExecutions,
      successRate: totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 100,
      avgExecutionTime,
    },
    milestones: {
      total: milestones.length,
      completed: milestones.filter((m) => m.completedAt).length,
      upcoming: milestones.filter((m) => !m.completedAt && m.dueDate >= new Date()).length,
      overdue: milestones.filter((m) => !m.completedAt && m.dueDate < new Date()).length,
    },
  };
}

export async function getRecentActivity(
  userId: string,
  limit: number = 10,
  offset: number = 0
) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit,
  });

  const total = await prisma.notification.count({ where: { userId } });

  return {
    items: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.body,
      read: !!n.readAt,
      createdAt: n.createdAt,
    })),
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + notifications.length < total,
    },
  };
}
