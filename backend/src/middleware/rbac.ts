import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UserRole } from '@prisma/client';

// Role hierarchy - higher number = more permissions
const roleHierarchy: Record<UserRole, number> = {
  ADMIN: 100,
  CTO: 80,
  CEO: 80,
  PM: 60,
  VIEWER: 20,
};

/**
 * Require one of the specified roles
 */
export function requireRole(allowedRoles: UserRole[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    const userRole = user.role as UserRole;

    // Admin always has access
    if (userRole === 'ADMIN') {
      await next();
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      throw new HTTPException(403, {
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    await next();
  };
}

/**
 * Require minimum role level
 */
export function requireMinRole(minRole: UserRole) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    const userRole = user.role as UserRole;
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[minRole] || 0;

    if (userLevel < requiredLevel) {
      throw new HTTPException(403, {
        message: `Access denied. Minimum role required: ${minRole}`
      });
    }

    await next();
  };
}

/**
 * Check if user has project access
 */
export function requireProjectAccess() {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    const projectId = c.req.param('projectId') || c.req.query('projectId');

    if (!user) {
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    // Admin can access all projects
    if (user.role === 'ADMIN') {
      await next();
      return;
    }

    // User must belong to the project
    if (user.projectId !== projectId) {
      throw new HTTPException(403, { message: 'Access denied to this project' });
    }

    await next();
  };
}
