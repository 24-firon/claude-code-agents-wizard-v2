/**
 * Slack Notifier Plugin
 *
 * Sends notifications to Slack channels via webhooks.
 */

module.exports = {
  /**
   * Initialize the plugin
   */
  async initialize(api) {
    api.log.info('Slack Notifier Plugin initializing...');

    // Validate webhook URL
    const webhookUrl = api.config.get('webhookUrl');
    if (!webhookUrl) {
      api.log.warn('Slack webhook URL not configured. Notifications will not be sent.');
      api.log.info('Set webhookUrl in config to enable Slack notifications.');
      return;
    }

    // Register tool for manual notifications
    api.tools.register({
      name: 'slack-notify',
      description: 'Send a notification to Slack',
      handler: async (params) => {
        return await this.sendNotification(api, params.message, params.options);
      },
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Message to send'
          },
          options: {
            type: 'object',
            description: 'Optional parameters (channel, username, etc.)'
          }
        },
        required: ['message']
      }
    });

    // Subscribe to agent events
    const notifyOnSuccess = api.config.get('notifyOnSuccess', true);
    const notifyOnError = api.config.get('notifyOnError', true);

    if (notifyOnSuccess) {
      api.events.on('agent:completed', async (data) => {
        await this.onAgentCompleted(api, data);
      });
    }

    if (notifyOnError) {
      api.events.on('agent:failed', async (data) => {
        await this.onAgentFailed(api, data);
      });
    }

    api.log.info('Slack Notifier Plugin initialized successfully!');
  },

  /**
   * Clean up when plugin is unloaded
   */
  async cleanup(api) {
    api.log.info('Slack Notifier Plugin cleaning up...');
  },

  /**
   * Send notification to Slack
   */
  async sendNotification(api, message, options = {}) {
    const webhookUrl = api.config.get('webhookUrl');
    if (!webhookUrl) {
      api.log.warn('Cannot send Slack notification: webhook URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    const channel = options.channel || api.config.get('channel', '#general');
    const username = options.username || api.config.get('username', 'Claude Code Bot');
    const iconEmoji = options.iconEmoji || api.config.get('iconEmoji', ':robot_face:');

    const payload = {
      channel,
      username,
      icon_emoji: iconEmoji,
      text: message,
      ...options
    };

    try {
      // In real implementation, would use axios to POST to webhook
      api.log.info(`[SLACK] Would send to ${channel}: ${message}`);

      // Simulated API call
      // await axios.post(webhookUrl, payload);

      api.events.emit('slack:notification-sent', { message, channel });
      return { success: true, channel };
    } catch (error) {
      api.log.error('Failed to send Slack notification:', error);
      api.events.emit('slack:notification-failed', { message, error: error.message });
      return { success: false, error: error.message };
    }
  },

  /**
   * Handle agent completed event
   */
  async onAgentCompleted(api, data) {
    const message = `✅ Agent *${data.name}* completed successfully`;

    const attachments = [
      {
        color: 'good',
        fields: [
          {
            title: 'Agent',
            value: data.name,
            short: true
          },
          {
            title: 'Plugin',
            value: data.plugin || 'system',
            short: true
          },
          {
            title: 'Duration',
            value: data.duration ? `${data.duration}ms` : 'N/A',
            short: true
          }
        ],
        footer: 'Claude Code',
        ts: Math.floor(Date.now() / 1000)
      }
    ];

    await this.sendNotification(api, message, { attachments });
  },

  /**
   * Handle agent failed event
   */
  async onAgentFailed(api, data) {
    const mentionOnError = api.config.get('mentionOnError', '');
    const mention = mentionOnError ? `${mentionOnError} ` : '';

    const message = `${mention}❌ Agent *${data.name}* failed`;

    const attachments = [
      {
        color: 'danger',
        fields: [
          {
            title: 'Agent',
            value: data.name,
            short: true
          },
          {
            title: 'Plugin',
            value: data.plugin || 'system',
            short: true
          },
          {
            title: 'Error',
            value: data.error?.message || 'Unknown error',
            short: false
          }
        ],
        footer: 'Claude Code',
        ts: Math.floor(Date.now() / 1000)
      }
    ];

    await this.sendNotification(api, message, { attachments });
  },

  /**
   * Send formatted message with blocks
   */
  async sendRichMessage(api, blocks) {
    const webhookUrl = api.config.get('webhookUrl');
    if (!webhookUrl) {
      return { success: false, error: 'Webhook URL not configured' };
    }

    const payload = {
      blocks
    };

    try {
      api.log.info('[SLACK] Would send rich message with blocks');
      // await axios.post(webhookUrl, payload);

      api.events.emit('slack:rich-message-sent', { blocks });
      return { success: true };
    } catch (error) {
      api.log.error('Failed to send rich Slack message:', error);
      return { success: false, error: error.message };
    }
  }
};
