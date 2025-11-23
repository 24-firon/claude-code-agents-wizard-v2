import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class EmailService {
  private resend: Resend | null = null;

  constructor() {
    if (env.RESEND_API_KEY) {
      this.resend = new Resend(env.RESEND_API_KEY);
    } else {
      logger.warn('RESEND_API_KEY not configured. Emails will be logged only.');
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      logger.info("[EMAIL] To: " + to + ", Subject: " + subject);
      logger.debug("[EMAIL HTML] " + html);
      return { success: true, messageId: 'dev-mode' };
    }

    try {
      const result = await this.resend.emails.send({
        from: env.EMAIL_FROM_NAME + " <" + env.EMAIL_FROM + ">",
        to,
        subject,
        html,
      });

      const messageId = (result as any).id || (result as any).data?.id || 'unknown';
      logger.info("Email sent to " + to + ": " + messageId);
      return { success: true, messageId };
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = "<h1>Welcome to KI Agentur Client Portal!</h1><p>Hi " + name + ",</p><p>Your account has been created successfully. You can now access the client portal to:</p><ul><li>View real-time project dashboards</li><li>Access project documents</li><li>Monitor workflow status</li><li>Receive automated notifications</li></ul><p>Best regards,<br>KI Agentur Team</p>";

    return this.sendEmail(to, 'Welcome to KI Agentur Client Portal', html);
  }

  async sendNotificationEmail(
    to: string,
    title: string,
    body: string,
    data?: any
  ) {
    const dataStr = data ? "<pre>" + JSON.stringify(data, null, 2) + "</pre>" : '';
    const html = "<h2>" + title + "</h2><p>" + body + "</p>" + dataStr + "<p>Best regards,<br>KI Agentur Team</p>";

    return this.sendEmail(to, title, html);
  }

  async sendWeeklySummaryEmail(
    to: string,
    projectName: string,
    summary: {
      healthScore: number;
      workflowsCompleted: number;
      workflowsFailed: number;
      documentsUploaded: number;
      nextMilestone?: string;
    }
  ) {
    const nextMilestoneStr = summary.nextMilestone ? "<li>Next Milestone: " + summary.nextMilestone + "</li>" : '';
    const html = "<h1>Weekly Project Summary: " + projectName + "</h1><h2>Health Score: " + summary.healthScore + "/100</h2><ul><li>Workflows Completed: " + summary.workflowsCompleted + "</li><li>Workflows Failed: " + summary.workflowsFailed + "</li><li>Documents Uploaded: " + summary.documentsUploaded + "</li>" + nextMilestoneStr + "</ul><p>View full details in the <a href=\"" + env.ALLOWED_ORIGINS[0] + "\">client portal</a>.</p><p>Best regards,<br>KI Agentur Team</p>";

    return this.sendEmail(to, "Weekly Summary: " + projectName, html);
  }
}

export const emailService = new EmailService();
