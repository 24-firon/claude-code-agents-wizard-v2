import { z } from 'zod';

export const workflowQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  isActive: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  sortBy: z.enum(['name', 'successRate', 'lastRunAt', 'createdAt']).default('lastRunAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const workflowLogsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['SUCCESS', 'FAILED', 'RUNNING', 'PENDING']).optional(),
});

export const triggerWorkflowSchema = z.object({
  inputData: z.record(z.string(), z.unknown()).optional(),
});

export type WorkflowQueryInput = z.infer<typeof workflowQuerySchema>;
export type WorkflowLogsQueryInput = z.infer<typeof workflowLogsQuerySchema>;
export type TriggerWorkflowInput = z.infer<typeof triggerWorkflowSchema>;
