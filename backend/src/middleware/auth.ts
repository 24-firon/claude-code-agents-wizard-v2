import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { verifyAccessToken, JWTPayload } from '../utils/jwt';

// Extend Hono's context to include user
declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyAccessToken(token);
    c.set('user', payload);
    await next();
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid or expired token' });
  }
}

// Optional auth - sets user if token present, but doesn't require it
export async function optionalAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const payload = await verifyAccessToken(token);
      c.set('user', payload);
    } catch {
      // Ignore invalid tokens for optional auth
    }
  }

  await next();
}
