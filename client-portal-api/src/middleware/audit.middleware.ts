import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuditAction } from '@prisma/client';
import { logger } from '../utils/logger';

export const auditLog = (action: AuditAction, resourceType: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Store original send function
      const originalSend = res.send;

      // Override send to capture response
      res.send = function (data: any): Response {
        // Only log if request was successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Async logging (non-blocking)
          createAuditLog(req, action, resourceType).catch((error) => {
            logger.error('Failed to create audit log:', error);
          });
        }

        // Call original send
        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

async function createAuditLog(
  req: Request,
  action: AuditAction,
  resourceType: string
): Promise<void> {
  try {
    const resourceId = req.params.id || req.params.projectId || req.body?.id;

    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId || null,
        resourceType,
        resourceId: resourceId || 'unknown',
        action,
        changes: {
          method: req.method,
          path: req.path,
          body: sanitizeBody(req.body),
          query: req.query,
        },
        ipAddress: req.ip || req.socket.remoteAddress || null,
        userAgent: req.get('user-agent') || null,
      },
    });
  } catch (error) {
    logger.error('Audit log creation failed:', error);
  }
}

function sanitizeBody(body: any): any {
  if (!body) return null;

  const sanitized = { ...body };

  // Remove sensitive fields
  const sensitiveFields = ['password', 'passwordHash', 'token', 'apiKey'];
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}
