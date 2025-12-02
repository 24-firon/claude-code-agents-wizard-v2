import { z } from 'zod';

export const notificationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  unreadOnly: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  type: z.enum([
    'WORKFLOW_SUCCESS',
    'WORKFLOW_FAILED',
    'DOCUMENT_UPLOADED',
    'MILESTONE_DUE',
    'HEALTH_ALERT',
    'SYSTEM'
  ]).optional(),
});

export const markReadSchema = z.object({
  notificationIds: z.array(z.string().cuid()).optional(),
});

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
export type MarkReadInput = z.infer<typeof markReadSchema>;
