import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { verifyN8nSignature } from '../utils/hmac';
import { env } from '../config/env';

declare module 'hono' {
  interface ContextVariableMap {
    webhookPayload: unknown;
  }
}

/**
 * Middleware to verify n8n webhook signatures
 */
export async function webhookAuthMiddleware(c: Context, next: Next) {
  // Get signature from header
  const signature = c.req.header('X-N8n-Signature') || c.req.header('x-n8n-signature');

  // In development, allow bypassing signature check with secret header
  if (env.NODE_ENV === 'development') {
    const devSecret = c.req.header('X-Webhook-Secret');
    if (devSecret === env.N8N_WEBHOOK_SECRET) {
      const body = await c.req.json();
      c.set('webhookPayload', body);
      await next();
      return;
    }
  }

  if (!signature) {
    throw new HTTPException(401, { message: 'Missing webhook signature' });
  }

  // Get raw body for signature verification
  const rawBody = await c.req.text();

  // Verify signature
  const isValid = verifyN8nSignature(rawBody, signature);

  if (!isValid) {
    throw new HTTPException(401, { message: 'Invalid webhook signature' });
  }

  // Parse and store payload
  try {
    const payload = JSON.parse(rawBody);
    c.set('webhookPayload', payload);
  } catch {
    throw new HTTPException(400, { message: 'Invalid JSON payload' });
  }

  await next();
}

/**
 * Simple IP whitelist middleware (optional)
 */
export function ipWhitelistMiddleware(allowedIps: string[]) {
  return async (c: Context, next: Next) => {
    const clientIp = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';

    // Skip in development
    if (env.NODE_ENV === 'development') {
      await next();
      return;
    }

    if (allowedIps.length > 0 && !allowedIps.includes(clientIp)) {
      throw new HTTPException(403, { message: 'IP not allowed' });
    }

    await next();
  };
}
