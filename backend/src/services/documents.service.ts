import { prisma } from '../config/database';
import { HTTPException } from 'hono/http-exception';
import { DocumentQueryInput, CreateDocumentInput, UpdateDocumentInput, CreateVersionInput } from '../schemas/documents.schema';
import { Prisma } from '@prisma/client';

export async function getDocuments(projectId: string, query: DocumentQueryInput) {
  const { page, limit, phase, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.DocumentWhereInput = {
    projectId,
    ...(phase && { phase }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    }),
    prisma.document.count({ where }),
  ]);

  return {
    items: documents,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getDocumentById(documentId: string, projectId: string) {
  const document = await prisma.document.findFirst({
    where: { id: documentId, projectId },
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      versions: {
        orderBy: { version: 'desc' },
        take: 10,
      },
    },
  });

  if (!document) {
    throw new HTTPException(404, { message: 'Document not found' });
  }

  return document;
}

export async function createDocument(
  projectId: string,
  uploadedById: string,
  input: CreateDocumentInput
) {
  const document = await prisma.document.create({
    data: {
      ...input,
      projectId,
      uploadedById,
      version: 1,
    },
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  return document;
}

export async function updateDocument(
  documentId: string,
  projectId: string,
  input: UpdateDocumentInput
) {
  // Check document exists
  const existing = await prisma.document.findFirst({
    where: { id: documentId, projectId },
  });

  if (!existing) {
    throw new HTTPException(404, { message: 'Document not found' });
  }

  const document = await prisma.document.update({
    where: { id: documentId },
    data: input,
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  return document;
}

export async function deleteDocument(documentId: string, projectId: string) {
  const existing = await prisma.document.findFirst({
    where: { id: documentId, projectId },
  });

  if (!existing) {
    throw new HTTPException(404, { message: 'Document not found' });
  }

  await prisma.document.delete({
    where: { id: documentId },
  });
}

export async function getDocumentVersions(documentId: string, projectId: string) {
  const document = await prisma.document.findFirst({
    where: { id: documentId, projectId },
  });

  if (!document) {
    throw new HTTPException(404, { message: 'Document not found' });
  }

  const versions = await prisma.documentVersion.findMany({
    where: { documentId },
    orderBy: { version: 'desc' },
  });

  return {
    currentVersion: document.version,
    versions,
  };
}

export async function createDocumentVersion(
  documentId: string,
  projectId: string,
  input: CreateVersionInput
) {
  const document = await prisma.document.findFirst({
    where: { id: documentId, projectId },
  });

  if (!document) {
    throw new HTTPException(404, { message: 'Document not found' });
  }

  // Create version record for current version
  await prisma.documentVersion.create({
    data: {
      documentId,
      version: document.version,
      filePath: document.filePath,
      fileSize: document.fileSize,
      changeNote: 'Previous version',
    },
  });

  // Update document with new version
  const newVersion = document.version + 1;
  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: {
      version: newVersion,
      filePath: input.filePath,
      fileSize: input.fileSize,
    },
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  return updatedDocument;
}

export async function searchDocuments(projectId: string, searchTerm: string, limit: number = 10) {
  const documents = await prisma.document.findMany({
    where: {
      projectId,
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  return documents;
}
