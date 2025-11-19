/**
 * Plugin Template
 *
 * This is a template for creating Claude Code plugins.
 * Replace this description and the code below with your plugin implementation.
 */

module.exports = {
  /**
   * Initialize the plugin
   *
   * This is called when the plugin is loaded.
   * Use this to set up your plugin, register agents/tools, subscribe to events, etc.
   *
   * @param {PluginAPI} api - The plugin API instance
   */
  async initialize(api) {
    api.log.info('Plugin initializing...');

    // Example: Get configuration
    const setting = api.config.get('exampleSetting', 'default-value');
    api.log.info(`Configuration value: ${setting}`);

    // Example: Subscribe to events
    api.events.on('task:completed', (data) => {
      api.log.info('Task completed:', data);
    });

    // Example: Register a custom agent
    // api.agents.register({
    //   name: 'my-agent',
    //   description: 'My custom agent',
    //   handler: async (task, context) => {
    //     // Agent implementation
    //     return { success: true, result: 'Task completed!' };
    //   }
    // });

    // Example: Register a custom tool
    // api.tools.register({
    //   name: 'my-tool',
    //   description: 'My custom tool',
    //   handler: async (params) => {
    //     // Tool implementation
    //     return { success: true };
    //   },
    //   parameters: {
    //     type: 'object',
    //     properties: {
    //       input: {
    //         type: 'string',
    //         description: 'Input parameter'
    //       }
    //     }
    //   }
    // });

    // Example: Register a hook
    // api.hooks.register('agent:before-invoke', async (context) => {
    //   // Modify context before agent invocation
    //   api.log.info('Before agent invoke:', context);
    //   return context;
    // });

    // Example: Store data
    api.storage.set('initialized-at', new Date().toISOString());

    // Example: Emit a custom event
    api.events.emit('my-plugin:initialized', {
      timestamp: Date.now()
    });

    api.log.info('Plugin initialized successfully!');
  },

  /**
   * Clean up when plugin is unloaded
   *
   * This is called when the plugin is disabled or unloaded.
   * Use this to clean up resources, close connections, etc.
   *
   * @param {PluginAPI} api - The plugin API instance
   */
  async cleanup(api) {
    api.log.info('Plugin cleaning up...');

    // Example: Clean up resources
    const initializedAt = api.storage.get('initialized-at');
    if (initializedAt) {
      const uptime = Date.now() - new Date(initializedAt).getTime();
      api.log.info(`Plugin was active for ${uptime}ms`);
    }

    // Unregister event handlers, close connections, etc.

    api.log.info('Plugin cleaned up successfully');
  },

  /**
   * Handle hot reload (optional)
   *
   * This is called when the plugin is hot-reloaded during development.
   * Use this to reinitialize without losing state.
   *
   * @param {PluginAPI} api - The plugin API instance
   * @param {any} customState - Custom state saved before reload
   */
  async onHotReload(api, customState) {
    api.log.info('Plugin hot reloaded!');

    // Restore state if needed
    if (customState) {
      api.log.info('Restoring custom state:', customState);
      // Restore your plugin state here
    }
  },

  /**
   * Save custom state before hot reload (optional)
   *
   * This is called before the plugin is hot-reloaded.
   * Return any state that you want to preserve across reloads.
   *
   * @param {PluginAPI} api - The plugin API instance
   * @returns {any} Custom state to preserve
   */
  async onBeforeReload(api) {
    api.log.info('Saving state before hot reload...');

    // Return state to preserve
    return {
      lastReload: Date.now(),
      // Add your custom state here
    };
  }
};
