/**
 * Email Service
 * Handles sending emails via Resend
 */

import { Resend } from 'resend';
import {
  ContactConfirmation,
  AdminNotification,
  NewsletterWelcome,
} from './templates';
import type { ContactFormData } from '../validation/schemas';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@kiagentur.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'team@kiagentur.com';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'hello@kiagentur.com';

/**
 * Send contact form confirmation email to user
 */
export async function sendContactConfirmation(data: ContactFormData) {
  try {
    const { name, email, company } = data;

    const result = await resend.emails.send({
      from: `KI Agentur <${FROM_EMAIL}>`,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject: 'We received your message - KI Agentur',
      react: ContactConfirmation({ name, company }),
    });

    console.log('Contact confirmation sent:', result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send contact confirmation:', error);
    throw new Error('Failed to send confirmation email');
  }
}

/**
 * Send admin notification email when contact form is submitted
 */
export async function sendAdminNotification(data: ContactFormData) {
  try {
    const { name, email, company, message, budget } = data;
    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Berlin',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const result = await resend.emails.send({
      from: `KI Agentur Contact Form <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `🔔 New Lead: ${name} from ${company}`,
      react: AdminNotification({
        name,
        email,
        company,
        message,
        budget,
        submittedAt,
      }),
    });

    console.log('Admin notification sent:', result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    throw new Error('Failed to send admin notification');
  }
}

/**
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcome(email: string) {
  try {
    const result = await resend.emails.send({
      from: `KI Agentur <${FROM_EMAIL}>`,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject: 'Welcome to KI Agentur Insights! 🎉',
      react: NewsletterWelcome({ email }),
    });

    console.log('Newsletter welcome sent:', result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send newsletter welcome:', error);
    throw new Error('Failed to send welcome email');
  }
}

/**
 * Alternative: Send plain text email (fallback if React email fails)
 */
export async function sendPlainTextEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    const result = await resend.emails.send({
      from: `KI Agentur <${FROM_EMAIL}>`,
      to,
      replyTo: REPLY_TO_EMAIL,
      subject,
      text,
    });

    console.log('Plain text email sent:', result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send plain text email:', error);
    throw new Error('Failed to send email');
  }
}
