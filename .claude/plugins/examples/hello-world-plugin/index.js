/**
 * Hello World Plugin
 *
 * A simple example plugin that demonstrates the basic plugin API.
 */

module.exports = {
  /**
   * Initialize the plugin
   */
  async initialize(api) {
    api.log.info('Hello World Plugin initializing...');

    // Get configuration
    const greeting = api.config.get('greeting', 'Hello');
    const name = api.config.get('name', 'World');

    api.log.info(`${greeting}, ${name}!`);

    // Subscribe to events
    api.events.on('plugin:loaded', (data) => {
      api.log.info(`Another plugin was loaded: ${data.name}`);
    });

    // Store some data
    api.storage.set('initialized-at', new Date().toISOString());

    // Emit a custom event
    api.events.emit('hello-world:initialized', {
      greeting,
      name,
      timestamp: Date.now()
    });

    api.log.info('Hello World Plugin initialized successfully!');
  },

  /**
   * Clean up when plugin is unloaded
   */
  async cleanup(api) {
    api.log.info('Hello World Plugin cleaning up...');

    const initializedAt = api.storage.get('initialized-at');
    if (initializedAt) {
      api.log.info(`Plugin was initialized at: ${initializedAt}`);
    }

    api.log.info('Goodbye!');
  },

  /**
   * Handle hot reload
   */
  async onHotReload(api, customState) {
    api.log.info('Hello World Plugin hot reloaded!');

    // You can restore custom state here if needed
    if (customState) {
      api.log.info('Restored custom state:', customState);
    }
  },

  /**
   * Save custom state before hot reload
   */
  async onBeforeReload(api) {
    api.log.info('Saving state before hot reload...');

    return {
      lastReload: Date.now(),
      someCustomData: 'This will be restored after reload'
    };
  }
};
