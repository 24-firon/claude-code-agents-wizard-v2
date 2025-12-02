import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { requireMinRole } from '../middleware/rbac';
import {
  documentQuerySchema,
  createDocumentSchema,
  updateDocumentSchema,
  createVersionSchema,
} from '../schemas/documents.schema';
import * as documentsService from '../services/documents.service';

const documents = new Hono();

// All document routes require authentication
documents.use('/*', authMiddleware);

// GET /documents - List documents
documents.get('/', zValidator('query', documentQuerySchema), async (c) => {
  const user = c.get('user');
  const query = c.req.valid('query');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const result = await documentsService.getDocuments(user.projectId, query);

  return c.json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
});

// GET /documents/search - Search documents
documents.get('/search', async (c) => {
  const user = c.get('user');
  const search = c.req.query('q') || '';
  const limit = parseInt(c.req.query('limit') || '10', 10);

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const results = await documentsService.searchDocuments(user.projectId, search, limit);

  return c.json({
    success: true,
    data: results,
  });
});

// GET /documents/:id - Get document details
documents.get('/:id', async (c) => {
  const user = c.get('user');
  const documentId = c.req.param('id');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const document = await documentsService.getDocumentById(documentId, user.projectId);

  return c.json({
    success: true,
    data: document,
  });
});

// POST /documents - Create document (PM+ only)
documents.post('/', requireMinRole('PM'), zValidator('json', createDocumentSchema), async (c) => {
  const user = c.get('user');
  const input = c.req.valid('json');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const document = await documentsService.createDocument(user.projectId, user.sub, input);

  return c.json({
    success: true,
    data: document,
  }, 201);
});

// PATCH /documents/:id - Update document (PM+ only)
documents.patch('/:id', requireMinRole('PM'), zValidator('json', updateDocumentSchema), async (c) => {
  const user = c.get('user');
  const documentId = c.req.param('id');
  const input = c.req.valid('json');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const document = await documentsService.updateDocument(documentId, user.projectId, input);

  return c.json({
    success: true,
    data: document,
  });
});

// DELETE /documents/:id - Delete document (ADMIN only)
documents.delete('/:id', requireMinRole('ADMIN'), async (c) => {
  const user = c.get('user');
  const documentId = c.req.param('id');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  await documentsService.deleteDocument(documentId, user.projectId);

  return c.json({
    success: true,
    message: 'Document deleted successfully',
  });
});

// GET /documents/:id/versions - Get document versions
documents.get('/:id/versions', async (c) => {
  const user = c.get('user');
  const documentId = c.req.param('id');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const versions = await documentsService.getDocumentVersions(documentId, user.projectId);

  return c.json({
    success: true,
    data: versions,
  });
});

// POST /documents/:id/versions - Create new version (PM+ only)
documents.post('/:id/versions', requireMinRole('PM'), zValidator('json', createVersionSchema), async (c) => {
  const user = c.get('user');
  const documentId = c.req.param('id');
  const input = c.req.valid('json');

  if (!user.projectId) {
    return c.json({ success: false, error: 'No project associated' }, 400);
  }

  const document = await documentsService.createDocumentVersion(documentId, user.projectId, input);

  return c.json({
    success: true,
    data: document,
  }, 201);
});

export { documents };
