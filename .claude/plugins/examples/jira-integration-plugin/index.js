/**
 * Jira Integration Plugin
 *
 * Integrates with Jira for ticket management and task synchronization.
 */

module.exports = {
  jiraClient: null,
  syncInterval: null,

  /**
   * Initialize the plugin
   */
  async initialize(api) {
    api.log.info('Jira Integration Plugin initializing...');

    // Validate configuration
    const jiraUrl = api.config.get('jiraUrl');
    const apiToken = api.config.get('apiToken');
    const email = api.config.get('email');

    if (!jiraUrl || !apiToken || !email) {
      api.log.warn('Jira plugin not configured. Please set jiraUrl, apiToken, and email.');
      return;
    }

    // Initialize Jira client (would use axios in real implementation)
    this.jiraClient = {
      url: jiraUrl,
      auth: {
        email,
        token: apiToken
      }
    };

    // Subscribe to task events
    api.events.on('task:created', async (data) => {
      await this.onTaskCreated(api, data);
    });

    api.events.on('task:completed', async (data) => {
      await this.onTaskCompleted(api, data);
    });

    // Start auto-sync if enabled
    const autoSync = api.config.get('autoSync', false);
    if (autoSync) {
      const interval = api.config.get('syncInterval', 300000);
      this.syncInterval = setInterval(() => {
        this.syncWithJira(api);
      }, interval);
      api.log.info(`Auto-sync enabled (interval: ${interval}ms)`);
    }

    api.log.info('Jira Integration Plugin initialized successfully!');
  },

  /**
   * Clean up when plugin is unloaded
   */
  async cleanup(api) {
    api.log.info('Jira Integration Plugin cleaning up...');

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    this.jiraClient = null;

    api.log.info('Jira Integration Plugin cleaned up.');
  },

  /**
   * Handle task created event
   */
  async onTaskCreated(api, taskData) {
    if (!this.jiraClient) return;

    api.log.info(`Creating Jira ticket for task: ${taskData.id}`);

    try {
      // In real implementation, would create Jira ticket via API
      const ticket = {
        key: `PROJ-${Math.floor(Math.random() * 10000)}`,
        summary: taskData.title || 'New Task',
        description: taskData.description || '',
        status: 'To Do'
      };

      // Store mapping
      api.storage.set(`task:${taskData.id}`, ticket.key);

      api.log.info(`Created Jira ticket: ${ticket.key}`);
      api.events.emit('jira:ticket-created', { taskId: taskData.id, ticket });
    } catch (error) {
      api.log.error('Failed to create Jira ticket:', error);
    }
  },

  /**
   * Handle task completed event
   */
  async onTaskCompleted(api, taskData) {
    if (!this.jiraClient) return;

    const ticketKey = api.storage.get(`task:${taskData.id}`);
    if (!ticketKey) {
      api.log.warn(`No Jira ticket found for task: ${taskData.id}`);
      return;
    }

    api.log.info(`Updating Jira ticket ${ticketKey} to Done`);

    try {
      // In real implementation, would update Jira ticket via API
      api.log.info(`Updated Jira ticket ${ticketKey} to Done`);
      api.events.emit('jira:ticket-updated', {
        taskId: taskData.id,
        ticketKey,
        status: 'Done'
      });
    } catch (error) {
      api.log.error('Failed to update Jira ticket:', error);
    }
  },

  /**
   * Sync with Jira
   */
  async syncWithJira(api) {
    if (!this.jiraClient) return;

    api.log.info('Syncing with Jira...');

    try {
      // In real implementation, would fetch tickets from Jira
      // and update local tasks accordingly

      api.log.info('Sync completed successfully');
      api.events.emit('jira:sync-completed', { timestamp: Date.now() });
    } catch (error) {
      api.log.error('Sync failed:', error);
      api.events.emit('jira:sync-failed', { error: error.message });
    }
  },

  /**
   * Create Jira ticket manually
   */
  async createTicket(api, summary, description, issueType = 'Task') {
    if (!this.jiraClient) {
      throw new Error('Jira client not initialized');
    }

    api.log.info(`Creating Jira ticket: ${summary}`);

    // In real implementation, would use Jira REST API
    const ticket = {
      key: `PROJ-${Math.floor(Math.random() * 10000)}`,
      summary,
      description,
      issueType,
      status: 'To Do'
    };

    return ticket;
  },

  /**
   * Get ticket by key
   */
  async getTicket(api, ticketKey) {
    if (!this.jiraClient) {
      throw new Error('Jira client not initialized');
    }

    api.log.info(`Fetching Jira ticket: ${ticketKey}`);

    // In real implementation, would fetch from Jira API
    return {
      key: ticketKey,
      summary: 'Sample Ticket',
      description: 'Sample description',
      status: 'To Do'
    };
  }
};
