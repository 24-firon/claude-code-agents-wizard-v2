/**
 * Form Validation Schemas
 * Using Zod for type-safe validation on both client and server
 */

import { z } from 'zod';

/**
 * Contact Form Schema
 * Validates contact form submissions with business requirements
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .max(255, 'Email is too long'),

  company: z
    .string()
    .min(2, 'Company name required')
    .max(100, 'Company name too long')
    .trim(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long')
    .trim(),

  budget: z
    .enum(['<50k', '50-100k', '100-250k', '250k+'])
    .optional(),
});

/**
 * Newsletter Subscription Schema
 * Validates newsletter signups with optional interests
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .max(255, 'Email is too long'),

  interests: z
    .array(z.string().max(50))
    .max(10, 'Too many interests selected')
    .optional(),
});

/**
 * Webhook Signature Verification Schema
 * For validating incoming webhooks from external services
 */
export const webhookSchema = z.object({
  signature: z.string(),
  timestamp: z.string(),
  body: z.record(z.unknown()),
});

// Export TypeScript types inferred from schemas
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type WebhookData = z.infer<typeof webhookSchema>;
