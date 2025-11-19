#!/usr/bin/env node

/**
 * Plugin CLI
 *
 * Command-line interface for managing plugins.
 */

const fs = require('fs').promises;
const path = require('path');
const { PluginManager } = require('../plugin-manager');

const PLUGINS_DIR = path.join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function success(msg) {
  console.log(colorize('✓ ', 'green') + msg);
}

function error(msg) {
  console.error(colorize('✗ ', 'red') + msg);
}

function info(msg) {
  console.log(colorize('ℹ ', 'blue') + msg);
}

function warn(msg) {
  console.warn(colorize('⚠ ', 'yellow') + msg);
}

class PluginCLI {
  constructor() {
    this.manager = new PluginManager(PLUGINS_DIR);
  }

  async run(args) {
    const command = args[0];
    const commandArgs = args.slice(1);

    switch (command) {
      case 'list':
        await this.list();
        break;
      case 'install':
        await this.install(commandArgs[0]);
        break;
      case 'uninstall':
        await this.uninstall(commandArgs[0]);
        break;
      case 'enable':
        await this.enable(commandArgs[0]);
        break;
      case 'disable':
        await this.disable(commandArgs[0]);
        break;
      case 'validate':
        await this.validate(commandArgs[0]);
        break;
      case 'create':
        await this.create(commandArgs[0]);
        break;
      case 'dev':
        await this.dev(commandArgs[0]);
        break;
      case 'info':
        await this.showInfo(commandArgs[0]);
        break;
      case 'help':
      default:
        this.showHelp();
        break;
    }
  }

  /**
   * List all plugins
   */
  async list() {
    info('Loading plugins...');
    await this.manager.initialize();

    const plugins = this.manager.listPlugins();

    if (plugins.length === 0) {
      warn('No plugins found');
      return;
    }

    console.log(colorize('\nInstalled Plugins:\n', 'bright'));

    for (const plugin of plugins) {
      const status = plugin.enabled
        ? colorize('enabled', 'green')
        : colorize('disabled', 'yellow');
      const loaded = plugin.loaded
        ? colorize('loaded', 'blue')
        : colorize('not loaded', 'reset');

      console.log(`  ${colorize(plugin.name, 'cyan')} v${plugin.version}`);
      console.log(`    ${plugin.description}`);
      console.log(`    Status: ${status}, ${loaded}`);
      if (plugin.author) {
        console.log(`    Author: ${plugin.author}`);
      }
      console.log();
    }

    console.log(`Total: ${plugins.length} plugins\n`);
  }

  /**
   * Install a plugin
   */
  async install(sourcePath) {
    if (!sourcePath) {
      error('Please provide a path to the plugin directory');
      console.log('Usage: plugin install <path>');
      return;
    }

    try {
      info(`Installing plugin from: ${sourcePath}`);
      await this.manager.initialize();

      const pluginName = await this.manager.installPlugin(sourcePath);
      success(`Plugin installed: ${pluginName}`);
    } catch (err) {
      error(`Failed to install plugin: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Uninstall a plugin
   */
  async uninstall(pluginName) {
    if (!pluginName) {
      error('Please provide a plugin name');
      console.log('Usage: plugin uninstall <name>');
      return;
    }

    try {
      info(`Uninstalling plugin: ${pluginName}`);
      await this.manager.initialize();

      await this.manager.uninstallPlugin(pluginName);
      success(`Plugin uninstalled: ${pluginName}`);
    } catch (err) {
      error(`Failed to uninstall plugin: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Enable a plugin
   */
  async enable(pluginName) {
    if (!pluginName) {
      error('Please provide a plugin name');
      console.log('Usage: plugin enable <name>');
      return;
    }

    try {
      info(`Enabling plugin: ${pluginName}`);
      await this.manager.initialize();

      await this.manager.enablePlugin(pluginName);
      success(`Plugin enabled: ${pluginName}`);
    } catch (err) {
      error(`Failed to enable plugin: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Disable a plugin
   */
  async disable(pluginName) {
    if (!pluginName) {
      error('Please provide a plugin name');
      console.log('Usage: plugin disable <name>');
      return;
    }

    try {
      info(`Disabling plugin: ${pluginName}`);
      await this.manager.initialize();

      await this.manager.disablePlugin(pluginName);
      success(`Plugin disabled: ${pluginName}`);
    } catch (err) {
      error(`Failed to disable plugin: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Validate a plugin
   */
  async validate(pluginPath) {
    if (!pluginPath) {
      error('Please provide a path to the plugin directory');
      console.log('Usage: plugin validate <path>');
      return;
    }

    try {
      info(`Validating plugin at: ${pluginPath}`);

      const manifestPath = path.join(pluginPath, 'plugin.json');
      const manifest = await this.manager.loadManifest(manifestPath);

      success('Plugin manifest is valid!');
      console.log('\nPlugin details:');
      console.log(`  Name: ${manifest.name}`);
      console.log(`  Version: ${manifest.version}`);
      console.log(`  Description: ${manifest.description}`);
      console.log(`  Author: ${manifest.author || 'N/A'}`);
      console.log(`  Main: ${manifest.main}`);

      if (manifest.agents && manifest.agents.length > 0) {
        console.log(`  Agents: ${manifest.agents.length}`);
      }

      if (manifest.tools && manifest.tools.length > 0) {
        console.log(`  Tools: ${manifest.tools.length}`);
      }

      if (manifest.permissions && manifest.permissions.length > 0) {
        console.log(`  Permissions: ${manifest.permissions.join(', ')}`);
      }

      // Validate main file exists
      const mainPath = path.join(pluginPath, manifest.main);
      await fs.access(mainPath);
      success(`Main file exists: ${manifest.main}`);

      // Validate agent files
      if (manifest.agents) {
        for (const agent of manifest.agents) {
          if (agent.file) {
            const agentPath = path.join(pluginPath, agent.file);
            await fs.access(agentPath);
            success(`Agent file exists: ${agent.file}`);
          }
        }
      }

      success('\nAll validation checks passed!');
    } catch (err) {
      error(`Validation failed: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Create a new plugin from template
   */
  async create(pluginName) {
    if (!pluginName) {
      error('Please provide a plugin name');
      console.log('Usage: plugin create <name>');
      return;
    }

    // Validate plugin name
    if (!/^[a-z0-9-]+$/.test(pluginName)) {
      error('Plugin name must be lowercase alphanumeric with dashes only');
      return;
    }

    try {
      info(`Creating plugin: ${pluginName}`);

      const targetDir = path.join(PLUGINS_DIR, 'examples', pluginName);

      // Check if already exists
      try {
        await fs.access(targetDir);
        error(`Plugin directory already exists: ${targetDir}`);
        return;
      } catch {
        // Directory doesn't exist, continue
      }

      // Create directory
      await fs.mkdir(targetDir, { recursive: true });

      // Create plugin.json
      const manifest = {
        name: pluginName,
        version: '1.0.0',
        description: `${pluginName} plugin`,
        author: 'Your Name',
        license: 'MIT',
        main: 'index.js',
        agents: [],
        tools: [],
        hooks: {},
        permissions: ['events:emit', 'events:subscribe'],
        enabled: true,
        autoload: true
      };

      await fs.writeFile(
        path.join(targetDir, 'plugin.json'),
        JSON.stringify(manifest, null, 2)
      );

      // Create index.js
      const indexContent = `/**
 * ${pluginName} Plugin
 */

module.exports = {
  async initialize(api) {
    api.log.info('${pluginName} initializing...');

    // Your initialization code here

    api.log.info('${pluginName} initialized!');
  },

  async cleanup(api) {
    api.log.info('${pluginName} cleaning up...');

    // Your cleanup code here
  }
};
`;

      await fs.writeFile(path.join(targetDir, 'index.js'), indexContent);

      // Create README.md
      const readmeContent = `# ${pluginName}

Add your plugin description here.

## Installation

\`\`\`bash
node .claude/plugins/cli/plugin-cli.js enable ${pluginName}
\`\`\`

## Configuration

Add configuration details here.

## Usage

Add usage instructions here.
`;

      await fs.writeFile(path.join(targetDir, 'README.md'), readmeContent);

      success(`Plugin created: ${pluginName}`);
      console.log(`\nLocation: ${targetDir}`);
      console.log('\nNext steps:');
      console.log(`  1. Edit ${targetDir}/plugin.json`);
      console.log(`  2. Implement ${targetDir}/index.js`);
      console.log(`  3. Test your plugin`);
      console.log(`  4. Enable: node .claude/plugins/cli/plugin-cli.js enable ${pluginName}`);
    } catch (err) {
      error(`Failed to create plugin: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Development mode with hot reload
   */
  async dev(pluginName) {
    if (!pluginName) {
      error('Please provide a plugin name');
      console.log('Usage: plugin dev <name>');
      return;
    }

    try {
      info(`Starting development mode for: ${pluginName}`);
      await this.manager.initialize();

      // Enable hot reload
      this.manager.hotReload.enable();

      // Load the plugin
      await this.manager.loadPlugin(pluginName);

      success(`Watching ${pluginName} for changes...`);
      info('Press Ctrl+C to stop');

      // Listen for reload events
      this.manager.hotReload.on('reload:success', ({ pluginName, changedFile }) => {
        success(`Reloaded ${pluginName} (changed: ${changedFile})`);
      });

      this.manager.hotReload.on('reload:error', ({ pluginName, error }) => {
        error(`Failed to reload ${pluginName}: ${error.message}`);
      });

      // Keep process alive
      await new Promise(() => {});
    } catch (err) {
      error(`Failed to start dev mode: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Show plugin information
   */
  async showInfo(pluginName) {
    if (!pluginName) {
      error('Please provide a plugin name');
      console.log('Usage: plugin info <name>');
      return;
    }

    try {
      await this.manager.initialize();

      const info = this.manager.getPluginInfo(pluginName);
      if (!info) {
        error(`Plugin not found: ${pluginName}`);
        return;
      }

      console.log(colorize(`\n${info.name}\n`, 'bright'));
      console.log(`Version: ${info.manifest.version}`);
      console.log(`Description: ${info.manifest.description}`);
      console.log(`Author: ${info.manifest.author || 'N/A'}`);
      console.log(`License: ${info.manifest.license || 'N/A'}`);
      console.log(`Status: ${info.enabled ? colorize('enabled', 'green') : colorize('disabled', 'yellow')}`);
      console.log(`Loaded: ${info.loaded ? colorize('yes', 'green') : colorize('no', 'yellow')}`);
      console.log(`Path: ${info.path}`);

      if (info.manifest.agents && info.manifest.agents.length > 0) {
        console.log(`\nAgents (${info.manifest.agents.length}):`);
        for (const agent of info.manifest.agents) {
          console.log(`  - ${agent.name}: ${agent.description || 'N/A'}`);
        }
      }

      if (info.manifest.tools && info.manifest.tools.length > 0) {
        console.log(`\nTools (${info.manifest.tools.length}):`);
        for (const tool of info.manifest.tools) {
          console.log(`  - ${tool.name}: ${tool.description || 'N/A'}`);
        }
      }

      if (info.manifest.permissions && info.manifest.permissions.length > 0) {
        console.log(`\nPermissions:`);
        for (const perm of info.manifest.permissions) {
          console.log(`  - ${perm}`);
        }
      }

      console.log();
    } catch (err) {
      error(`Failed to get plugin info: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Show help
   */
  showHelp() {
    console.log(colorize('\nPlugin CLI - Manage Claude Code plugins\n', 'bright'));
    console.log('Usage: node plugin-cli.js <command> [options]\n');
    console.log('Commands:');
    console.log('  list                    List all installed plugins');
    console.log('  install <path>          Install a plugin from a directory');
    console.log('  uninstall <name>        Uninstall a plugin');
    console.log('  enable <name>           Enable a plugin');
    console.log('  disable <name>          Disable a plugin');
    console.log('  validate <path>         Validate a plugin manifest');
    console.log('  create <name>           Create a new plugin from template');
    console.log('  dev <name>              Development mode with hot reload');
    console.log('  info <name>             Show detailed plugin information');
    console.log('  help                    Show this help message\n');
    console.log('Examples:');
    console.log('  node plugin-cli.js list');
    console.log('  node plugin-cli.js create my-plugin');
    console.log('  node plugin-cli.js enable hello-world-plugin');
    console.log('  node plugin-cli.js dev my-plugin\n');
  }
}

// Run CLI
const cli = new PluginCLI();
const args = process.argv.slice(2);

cli.run(args).catch(err => {
  error(`Fatal error: ${err.message}`);
  process.exit(1);
});
