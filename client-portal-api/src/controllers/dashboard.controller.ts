import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';

export class DashboardController {
  async getProjectHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;

      const project = await prisma.project.findUnique({
        where: { id: projectId, deletedAt: null },
      });

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Calculate health score from recent workflows (last 7 days)
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

      const totalExecutions = workflowStats.reduce((sum, stat) => sum + stat._count.id, 0);
      const successfulExecutions = workflowStats.find(s => s.status === 'SUCCESS')?._count.id || 0;
      const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 100;

      // Get recent workflow logs
      const recentWorkflows = await prisma.workflowLog.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      sendSuccess(res, {
        projectId,
        projectName: project.name,
        healthScore: Math.round(successRate),
        status: project.status,
        workflowStats: {
          total: totalExecutions,
          successful: successfulExecutions,
          failed: workflowStats.find(s => s.status === 'FAILED')?._count.id || 0,
          successRate: Math.round(successRate),
        },
        recentWorkflows: recentWorkflows.map(wf => ({
          id: wf.id,
          workflowName: wf.n8nWorkflowName,
          status: wf.status,
          executionTime: wf.executionTimeMs,
          createdAt: wf.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  async getProjectMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;

      // Get document count by phase
      const documentsByPhase = await prisma.document.groupBy({
        by: ['phase'],
        where: { projectId, deletedAt: null },
        _count: { id: true },
      });

      // Get total documents
      const totalDocuments = await prisma.document.count({
        where: { projectId, deletedAt: null },
      });

      // Get workflow execution time avg
      const avgExecutionTime = await prisma.workflowLog.aggregate({
        where: { projectId, executionTimeMs: { not: null } },
        _avg: { executionTimeMs: true },
      });

      // Get recent activity count
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentActivity = await prisma.$transaction([
        prisma.workflowLog.count({
          where: { projectId, createdAt: { gte: oneDayAgo } },
        }),
        prisma.document.count({
          where: { projectId, createdAt: { gte: oneDayAgo } },
        }),
      ]);

      sendSuccess(res, {
        documents: {
          total: totalDocuments,
          byPhase: documentsByPhase,
        },
        workflows: {
          avgExecutionTime: Math.round(avgExecutionTime._avg.executionTimeMs || 0),
        },
        recentActivity: {
          workflowsLast24h: recentActivity[0],
          documentsLast24h: recentActivity[1],
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
