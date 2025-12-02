import { createHmac, timingSafeEqual } from 'crypto';
import { env } from '../config/env';

/**
 * Verify n8n webhook signature using HMAC-SHA256
 * n8n sends signature in header: X-N8n-Signature: sha256=<hash>
 */
export function verifyN8nSignature(payload: string, signature: string): boolean {
  if (!signature) {
    return false;
  }

  // Remove 'sha256=' prefix if present
  const providedSig = signature.startsWith('sha256=')
    ? signature.slice(7)
    : signature;

  // Calculate expected signature
  const expectedSig = createHmac('sha256', env.N8N_WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  try {
    const sigBuffer = Buffer.from(providedSig, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Generate HMAC signature for outgoing webhooks
 */
export function generateSignature(payload: string): string {
  return 'sha256=' + createHmac('sha256', env.N8N_WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');
}
