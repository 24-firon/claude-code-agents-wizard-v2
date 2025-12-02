import { z } from 'zod';

// n8n Workflow Event Schema
export const workflowEventSchema = z.object({
  event: z.enum(['workflow_started', 'workflow_completed', 'workflow_failed']),
  workflow: z.object({
    id: z.string(),
    name: z.string(),
  }),
  execution: z.object({
    id: z.string(),
    status: z.enum(['success', 'failed', 'running']),
    executionTime: z.number().optional(),
    errorMessage: z.string().optional().nullable(),
    input: z.record(z.string(), z.unknown()).optional(),
    output: z.record(z.string(), z.unknown()).optional(),
  }),
  timestamp: z.string(),
  projectId: z.string().optional(), // Optional: can be derived from workflow
});

// Generic webhook payload schema
export const genericWebhookSchema = z.object({
  event: z.string(),
  data: z.record(z.string(), z.unknown()),
  timestamp: z.string().optional(),
});

export type WorkflowEvent = z.infer<typeof workflowEventSchema>;
export type GenericWebhook = z.infer<typeof genericWebhookSchema>;
