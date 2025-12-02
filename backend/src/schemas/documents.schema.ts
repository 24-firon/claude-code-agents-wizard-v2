import { z } from 'zod';

export const documentQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  phase: z.enum(['DISCOVERY', 'PLANNING', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT', 'MAINTENANCE']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'phase']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const createDocumentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  phase: z.enum(['DISCOVERY', 'PLANNING', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT', 'MAINTENANCE']).default('DISCOVERY'),
  filePath: z.string().min(1),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1),
});

export const updateDocumentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  phase: z.enum(['DISCOVERY', 'PLANNING', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT', 'MAINTENANCE']).optional(),
});

export const createVersionSchema = z.object({
  filePath: z.string().min(1),
  fileSize: z.number().int().positive(),
  changeNote: z.string().max(500).optional(),
});

export type DocumentQueryInput = z.infer<typeof documentQuerySchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type CreateVersionInput = z.infer<typeof createVersionSchema>;
