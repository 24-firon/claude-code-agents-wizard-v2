/**
 * Email Templates
 * React email components for transactional emails
 */

import React from 'react';

interface ContactConfirmationProps {
  name: string;
  company: string;
}

/**
 * Contact Form Confirmation Email
 * Sent to user after they submit contact form
 */
export const ContactConfirmation: React.FC<ContactConfirmationProps> = ({
  name,
  company,
}) => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '40px 20px', backgroundColor: '#0A0A0A', color: '#FFFFFF' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#FFB800', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            KI Agentur
          </h1>
          <p style={{ color: '#CCCCCC', fontSize: '14px', margin: '0' }}>
            The AI Capabilities Your Competitors Wish They Had
          </p>
        </div>

        {/* Body */}
        <div style={{ backgroundColor: '#1F1F1F', padding: '32px', borderRadius: '8px', marginBottom: '32px' }}>
          <h2 style={{ color: '#FFB800', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Thank You, {name}!
          </h2>

          <p style={{ color: '#FFFFFF', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
            We've received your message and appreciate you reaching out to KI Agentur.
          </p>

          <p style={{ color: '#CCCCCC', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
            Our team will review your inquiry and respond within <strong style={{ color: '#FFB800' }}>24 hours on business days</strong>.
          </p>

          <div style={{ borderTop: '1px solid #333333', paddingTop: '24px' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              What happens next?
            </h3>
            <ul style={{ color: '#CCCCCC', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Our team will review your needs</li>
              <li>We'll schedule a discovery call to discuss your project</li>
              <li>We'll provide a tailored approach and proposal</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#666666', fontSize: '12px' }}>
          <p style={{ marginBottom: '8px' }}>
            KI Agentur | Premium AI Engineering for Tech-Forward Companies
          </p>
          <p style={{ margin: '0' }}>
            Built with n8n, Claude Code, and Docker
          </p>
        </div>
      </div>
    </div>
  );
};

interface AdminNotificationProps {
  name: string;
  email: string;
  company: string;
  message: string;
  budget?: string;
  submittedAt: string;
}

/**
 * Admin Notification Email
 * Sent to team when new contact form is submitted
 */
export const AdminNotification: React.FC<AdminNotificationProps> = ({
  name,
  email,
  company,
  message,
  budget,
  submittedAt,
}) => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '40px 20px', backgroundColor: '#F5F5F5', color: '#0A0A0A' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#0A0A0A', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            🔔 New Contact Form Submission
          </h1>
          <p style={{ color: '#666666', fontSize: '14px', margin: '0' }}>
            Submitted at {submittedAt}
          </p>
        </div>

        {/* Lead Details */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #FFB800' }}>
          <h2 style={{ color: '#FFB800', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Lead Information
          </h2>

          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', color: '#666666', fontWeight: '600', width: '120px' }}>Name:</td>
                <td style={{ padding: '8px 0', color: '#0A0A0A' }}>{name}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: '#666666', fontWeight: '600' }}>Email:</td>
                <td style={{ padding: '8px 0', color: '#0A0A0A' }}>
                  <a href={`mailto:${email}`} style={{ color: '#FFB800', textDecoration: 'none' }}>
                    {email}
                  </a>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: '#666666', fontWeight: '600' }}>Company:</td>
                <td style={{ padding: '8px 0', color: '#0A0A0A' }}>{company}</td>
              </tr>
              {budget && (
                <tr>
                  <td style={{ padding: '8px 0', color: '#666666', fontWeight: '600' }}>Budget:</td>
                  <td style={{ padding: '8px 0', color: '#0A0A0A' }}>
                    <strong style={{ color: '#FFB800' }}>EUR {budget}</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Message */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3 style={{ color: '#0A0A0A', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Message:
          </h3>
          <p style={{ color: '#333333', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: '0' }}>
            {message}
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a
            href={`mailto:${email}?subject=Re: Your Inquiry to KI Agentur`}
            style={{
              display: 'inline-block',
              backgroundColor: '#FFB800',
              color: '#0A0A0A',
              padding: '12px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Reply to {name}
          </a>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#999999', fontSize: '12px', paddingTop: '24px', borderTop: '1px solid #E0E0E0' }}>
          <p style={{ margin: '0' }}>
            This lead was captured via the KI Agentur contact form
          </p>
        </div>
      </div>
    </div>
  );
};

interface NewsletterWelcomeProps {
  email: string;
}

/**
 * Newsletter Welcome Email
 * Sent after newsletter subscription
 */
export const NewsletterWelcome: React.FC<NewsletterWelcomeProps> = ({
  email,
}) => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '40px 20px', backgroundColor: '#0A0A0A', color: '#FFFFFF' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#FFB800', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            Welcome to KI Agentur Insights! 🎉
          </h1>
        </div>

        {/* Body */}
        <div style={{ backgroundColor: '#1F1F1F', padding: '32px', borderRadius: '8px', marginBottom: '32px' }}>
          <p style={{ color: '#FFFFFF', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
            Thank you for subscribing to our newsletter!
          </p>

          <p style={{ color: '#CCCCCC', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
            You'll receive cutting-edge insights on:
          </p>

          <ul style={{ color: '#CCCCCC', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '24px' }}>
            <li>Advanced n8n workflow automation patterns</li>
            <li>Claude Code and AI agent development</li>
            <li>Real-world AI implementation case studies</li>
            <li>Technical deep dives and best practices</li>
          </ul>

          <div style={{ borderTop: '1px solid #333333', paddingTop: '24px' }}>
            <p style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              📧 Subscribed email: <span style={{ color: '#FFB800' }}>{email}</span>
            </p>
            <p style={{ color: '#CCCCCC', fontSize: '12px', margin: '0' }}>
              You can unsubscribe at any time by clicking the link in any newsletter email.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#666666', fontSize: '12px' }}>
          <p style={{ marginBottom: '8px' }}>
            KI Agentur | Premium AI Engineering for Tech-Forward Companies
          </p>
          <p style={{ margin: '0' }}>
            Built with n8n, Claude Code, and Docker
          </p>
        </div>
      </div>
    </div>
  );
};
