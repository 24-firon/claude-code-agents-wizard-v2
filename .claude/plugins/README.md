# Plugin System Documentation

A powerful, extensible plugin system for custom agents with hot-reloading, sandboxing, and a clean API.

## Overview

The plugin system allows you to extend the Claude Code agent framework with custom agents, tools, and behaviors. Plugins are self-contained modules that can be dynamically loaded, hot-reloaded during development, and safely sandboxed for security.

## Features

- **Dynamic Loading**: Plugins are discovered and loaded automatically from the plugins directory
- **Hot Reloading**: Changes to plugins are detected and reloaded without restarting
- **Sandboxing**: Plugins run in isolated contexts with controlled access to the system
- **Event System**: Plugins can communicate via a powerful event bus
- **Dependency Management**: Automatic resolution of plugin dependencies
- **Lifecycle Hooks**: Rich lifecycle events (load, enable, disable, unload)
- **Plugin CLI**: Command-line tools for managing plugins
- **Registry**: Centralized registry for discovering and installing plugins

## Quick Start

### Creating Your First Plugin

1. **Use the scaffolding tool:**
```bash
node .claude/plugins/cli/plugin-cli.js create my-awesome-plugin
```

2. **Define your plugin manifest** (`plugin.json`):
```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "author": "Your Name",
  "main": "index.js",
  "agents": [],
  "hooks": {},
  "permissions": ["filesystem:read", "network:http"]
}
```

3. **Implement your plugin** (`index.js`):
```javascript
module.exports = {
  async initialize(api) {
    api.log.info('Plugin initialized!');

    // Register a custom agent
    api.agents.register({
      name: 'my-agent',
      description: 'My custom agent',
      handler: async (task) => {
        return { success: true, result: 'Task completed!' };
      }
    });

    // Listen to events
    api.events.on('task:completed', (data) => {
      api.log.info('Task completed:', data);
    });
  },

  async cleanup(api) {
    api.log.info('Plugin cleaning up...');
  }
};
```

4. **Install and enable:**
```bash
node .claude/plugins/cli/plugin-cli.js install ./my-awesome-plugin
node .claude/plugins/cli/plugin-cli.js enable my-awesome-plugin
```

## Plugin API Reference

### Core API Object

The `api` object provided to plugins includes:

```javascript
{
  // Agent registration
  agents: {
    register(config),
    unregister(name),
    list(),
    invoke(name, task)
  },

  // Tool registration
  tools: {
    register(config),
    unregister(name),
    list()
  },

  // Hook registration
  hooks: {
    register(hookName, handler),
    unregister(hookName, handler),
    trigger(hookName, data)
  },

  // Event system
  events: {
    on(event, handler),
    off(event, handler),
    emit(event, data),
    once(event, handler)
  },

  // Configuration
  config: {
    get(key, defaultValue),
    set(key, value),
    getAll()
  },

  // Logging
  log: {
    debug(message, ...args),
    info(message, ...args),
    warn(message, ...args),
    error(message, ...args)
  },

  // Storage
  storage: {
    get(key),
    set(key, value),
    delete(key),
    clear(),
    keys()
  }
}
```

## Lifecycle Hooks

Plugins can implement these lifecycle methods:

### `initialize(api)`
Called when the plugin is loaded and enabled.
```javascript
async initialize(api) {
  // Setup code, register agents/tools
}
```

### `cleanup(api)`
Called when the plugin is disabled or unloaded.
```javascript
async cleanup(api) {
  // Cleanup code, release resources
}
```

### `onHotReload(api)`
Called when the plugin is hot-reloaded during development.
```javascript
async onHotReload(api) {
  // Reinitialize without losing state
}
```

## Event System

### Built-in Events

- `plugin:loaded` - Plugin was loaded
- `plugin:enabled` - Plugin was enabled
- `plugin:disabled` - Plugin was disabled
- `plugin:unloaded` - Plugin was unloaded
- `agent:invoked` - Agent was invoked
- `agent:completed` - Agent completed execution
- `agent:failed` - Agent execution failed
- `task:created` - Task was created
- `task:completed` - Task was completed
- `task:failed` - Task failed

### Subscribing to Events

```javascript
api.events.on('agent:completed', (data) => {
  console.log('Agent completed:', data.agentName, data.result);
});
```

### Emitting Custom Events

```javascript
api.events.emit('my-plugin:custom-event', {
  customData: 'value'
});
```

## Hook System

Hooks allow plugins to intercept and modify behavior at specific points.

### Available Hooks

- `agent:before-invoke` - Before agent invocation
- `agent:after-invoke` - After agent invocation
- `agent:on-error` - On agent error
- `config:before-load` - Before loading configuration
- `config:after-load` - After loading configuration

### Registering Hook Handlers

```javascript
api.hooks.register('agent:before-invoke', async (context) => {
  // Modify or validate the context
  context.metadata = { timestamp: Date.now() };
  return context;
});
```

## Permissions

Plugins must declare required permissions in their manifest:

```json
{
  "permissions": [
    "filesystem:read",
    "filesystem:write",
    "network:http",
    "network:https",
    "process:spawn",
    "storage:persistent"
  ]
}
```

### Permission Types

- `filesystem:read` - Read files from the filesystem
- `filesystem:write` - Write files to the filesystem
- `network:http` - Make HTTP requests
- `network:https` - Make HTTPS requests
- `process:spawn` - Spawn child processes
- `storage:persistent` - Access persistent storage

## Plugin Dependencies

Specify dependencies in your `plugin.json`:

```json
{
  "dependencies": {
    "plugins": {
      "core-utils": "^1.0.0",
      "api-client": "^2.1.0"
    },
    "npm": {
      "axios": "^1.6.0",
      "lodash": "^4.17.21"
    }
  }
}
```

## Custom Agents

Plugins can define custom agents in Markdown files or programmatically:

### Via Markdown (Recommended)

Create an agent definition in `agents/my-agent.md`:

```markdown
# My Custom Agent

You are a specialized agent that handles XYZ tasks.

## Your Role
- Task A
- Task B
- Task C

## Guidelines
1. Always do X
2. Never do Y
```

Reference it in your `plugin.json`:
```json
{
  "agents": [
    {
      "name": "my-agent",
      "file": "agents/my-agent.md",
      "description": "My custom agent"
    }
  ]
}
```

### Programmatically

```javascript
api.agents.register({
  name: 'my-agent',
  description: 'My custom agent',
  handler: async (task, context) => {
    // Implementation
    return { success: true, result: 'Done!' };
  }
});
```

## Configuration Schema

Define configuration schema for validation:

`config.schema.json`:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "apiKey": {
      "type": "string",
      "description": "API key for service"
    },
    "endpoint": {
      "type": "string",
      "format": "uri",
      "default": "https://api.example.com"
    },
    "retries": {
      "type": "number",
      "minimum": 0,
      "maximum": 10,
      "default": 3
    }
  },
  "required": ["apiKey"]
}
```

## Hot Reloading

During development, changes to plugin files are automatically detected and reloaded:

```bash
# Watch for changes (automatic in dev mode)
node .claude/plugins/cli/plugin-cli.js dev my-awesome-plugin
```

## Best Practices

### 1. Error Handling
```javascript
async initialize(api) {
  try {
    // Your code
  } catch (error) {
    api.log.error('Initialization failed:', error);
    throw error; // Let the plugin manager handle it
  }
}
```

### 2. Resource Cleanup
```javascript
async cleanup(api) {
  // Close connections
  // Clear timers
  // Release resources
}
```

### 3. Configuration Validation
```javascript
async initialize(api) {
  const apiKey = api.config.get('apiKey');
  if (!apiKey) {
    throw new Error('API key is required');
  }
}
```

### 4. Event Cleanup
```javascript
const handler = (data) => { /* ... */ };

async initialize(api) {
  api.events.on('my-event', handler);
}

async cleanup(api) {
  api.events.off('my-event', handler);
}
```

### 5. Use Namespaces
```javascript
// Good: namespaced events
api.events.emit('my-plugin:user-created', data);

// Bad: global events
api.events.emit('user-created', data);
```

## CLI Commands

```bash
# List all plugins
node .claude/plugins/cli/plugin-cli.js list

# Install a plugin
node .claude/plugins/cli/plugin-cli.js install <path>

# Uninstall a plugin
node .claude/plugins/cli/plugin-cli.js uninstall <name>

# Enable a plugin
node .claude/plugins/cli/plugin-cli.js enable <name>

# Disable a plugin
node .claude/plugins/cli/plugin-cli.js disable <name>

# Validate a plugin
node .claude/plugins/cli/plugin-cli.js validate <path>

# Create a new plugin
node .claude/plugins/cli/plugin-cli.js create <name>

# Development mode with hot reload
node .claude/plugins/cli/plugin-cli.js dev <name>
```

## Example Plugins

See the `examples/` directory for complete plugin examples:

- **hello-world-plugin** - Simple plugin demonstrating basics
- **jira-integration-plugin** - Integration with Jira API
- **slack-notifier-plugin** - Slack webhook notifications
- **git-analyzer-plugin** - Git repository analysis

## Troubleshooting

### Plugin won't load
- Check `plugin.json` syntax
- Verify all required fields are present
- Check file permissions
- Review logs for errors

### Hot reload not working
- Ensure development mode is enabled
- Check file watcher permissions
- Verify plugin path is correct

### Permission denied
- Add required permissions to `plugin.json`
- Check if permission is supported
- Review security policies

## Security Considerations

1. **Sandbox Isolation**: Plugins run in isolated contexts
2. **Permission Model**: Explicit permission requirements
3. **Code Review**: Review third-party plugins before installation
4. **Dependency Scanning**: Check npm dependencies for vulnerabilities
5. **Resource Limits**: Plugins have CPU and memory limits

## Contributing

To contribute a plugin to the registry:

1. Create your plugin following best practices
2. Add comprehensive documentation
3. Include tests
4. Submit to the registry via PR

## Support

- Documentation: This file
- Examples: `examples/` directory
- Issues: GitHub issues
- Community: Discord server

## License

Plugin system is MIT licensed. Individual plugins may have different licenses.
