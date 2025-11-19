/**
 * Plugin System Usage Example
 *
 * This file demonstrates how to use the plugin system programmatically.
 */

const { PluginManager } = require('./plugin-manager');
const path = require('path');

async function main() {
  console.log('='.repeat(60));
  console.log('Plugin System Usage Example');
  console.log('='.repeat(60));
  console.log();

  // Create plugin manager
  const pluginsDir = __dirname;
  const manager = new PluginManager(pluginsDir);

  // Initialize and discover plugins
  console.log('1. Initializing plugin manager...');
  await manager.initialize();
  console.log();

  // List all plugins
  console.log('2. Listing all plugins:');
  const plugins = manager.listPlugins();
  plugins.forEach(plugin => {
    console.log(`   - ${plugin.name} v${plugin.version}`);
    console.log(`     Status: ${plugin.enabled ? 'enabled' : 'disabled'}, ${plugin.loaded ? 'loaded' : 'not loaded'}`);
  });
  console.log();

  // Enable hot reload for development
  console.log('3. Enabling hot reload...');
  manager.hotReload.enable();
  console.log('   Hot reload enabled!');
  console.log();

  // Subscribe to plugin events
  console.log('4. Subscribing to plugin events...');
  manager.eventBus.on('hello-world:initialized', (data) => {
    console.log('   Received event: hello-world:initialized', data);
  });
  console.log('   Subscribed to hello-world:initialized');
  console.log();

  // Get plugin info
  console.log('5. Getting info for hello-world-plugin:');
  const info = manager.getPluginInfo('hello-world-plugin');
  if (info) {
    console.log(`   Name: ${info.name}`);
    console.log(`   Version: ${info.manifest.version}`);
    console.log(`   Description: ${info.manifest.description}`);
    console.log(`   Loaded: ${info.loaded}`);
    console.log(`   Enabled: ${info.enabled}`);
  }
  console.log();

  // Demonstrate plugin API usage (for plugin developers)
  console.log('6. Example plugin API usage:');
  console.log(`
  // Inside a plugin's initialize function:
  module.exports = {
    async initialize(api) {
      // Configuration
      const value = api.config.get('setting', 'default');

      // Events
      api.events.on('event-name', (data) => {
        api.log.info('Event received:', data);
      });

      // Storage
      api.storage.set('key', 'value');
      const stored = api.storage.get('key');

      // Register agent
      api.agents.register({
        name: 'my-agent',
        description: 'Custom agent',
        handler: async (task) => {
          return { success: true };
        }
      });

      // Register tool
      api.tools.register({
        name: 'my-tool',
        description: 'Custom tool',
        handler: async (params) => {
          return { success: true };
        }
      });

      // Logging
      api.log.info('Plugin initialized');
    }
  };
  `);

  // Show hot reload status
  console.log('7. Hot reload status:');
  const status = manager.hotReload.getStatus();
  console.log(`   Enabled: ${status.enabled}`);
  console.log(`   Watching: ${status.watching.join(', ') || 'none'}`);
  console.log();

  // CLI commands reference
  console.log('8. Useful CLI commands:');
  console.log(`
  # List all plugins
  node cli/plugin-cli.js list

  # Create a new plugin
  node cli/plugin-cli.js create my-awesome-plugin

  # Validate a plugin
  node cli/plugin-cli.js validate examples/hello-world-plugin

  # Enable/disable plugins
  node cli/plugin-cli.js enable hello-world-plugin
  node cli/plugin-cli.js disable hello-world-plugin

  # Development mode with hot reload
  node cli/plugin-cli.js dev hello-world-plugin

  # Get plugin info
  node cli/plugin-cli.js info hello-world-plugin
  `);

  console.log('='.repeat(60));
  console.log('Example complete!');
  console.log('='.repeat(60));

  // Cleanup
  process.exit(0);
}

// Run example
main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
