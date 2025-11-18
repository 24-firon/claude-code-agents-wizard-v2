# Getting Started with the Plugin System

Welcome to the Claude Code Plugin System! This guide will help you get started with using and creating plugins.

## Quick Start

### 1. List Available Plugins

```bash
node .claude/plugins/cli/plugin-cli.js list
```

This will show all installed plugins, their status, and descriptions.

### 2. Create Your First Plugin

```bash
node .claude/plugins/cli/plugin-cli.js create my-first-plugin
```

This creates a new plugin from the template in `.claude/plugins/examples/my-first-plugin/`.

### 3. Edit Your Plugin

Open the generated files:
- `plugin.json` - Plugin configuration and metadata
- `index.js` - Plugin implementation
- `README.md` - Plugin documentation

### 4. Enable Your Plugin

```bash
node .claude/plugins/cli/plugin-cli.js enable my-first-plugin
```

### 5. Test with Hot Reload

```bash
node .claude/plugins/cli/plugin-cli.js dev my-first-plugin
```

This starts development mode with hot reload. Any changes you make will automatically reload the plugin!

## Plugin System Architecture

```
.claude/plugins/
├── README.md                     # Complete plugin system documentation
├── GETTING_STARTED.md           # This file
├── plugin-manager.js            # Core plugin manager
├── plugin-schema.json           # Plugin manifest schema
├── example-usage.js             # Programmatic usage example
│
├── core/                        # Core system components
│   ├── plugin-api.js           # Plugin API implementation
│   └── hot-reload.js           # Hot reload system
│
├── cli/                         # Command-line interface
│   └── plugin-cli.js           # Plugin management CLI
│
├── examples/                    # Example plugins
│   ├── hello-world-plugin/     # Simple example
│   ├── jira-integration-plugin/ # Jira integration
│   ├── slack-notifier-plugin/  # Slack notifications
│   └── git-analyzer-plugin/    # Git analytics
│
├── templates/                   # Plugin templates
│   └── plugin-template/        # Base plugin template
│
└── registry/                    # Plugin registry
    └── registry.json           # Available plugins catalog
```

## Key Features

### 1. Hot Reloading
Changes to plugin files are detected and automatically reloaded without restarting the system.

```bash
node .claude/plugins/cli/plugin-cli.js dev my-plugin
```

### 2. Plugin API
Rich API for plugins to interact with the system:

```javascript
module.exports = {
  async initialize(api) {
    // Configuration
    api.config.get('setting', 'default');

    // Events
    api.events.on('event', handler);
    api.events.emit('custom-event', data);

    // Storage
    api.storage.set('key', 'value');
    api.storage.get('key');

    // Logging
    api.log.info('Message');

    // Register agents
    api.agents.register({
      name: 'agent-name',
      handler: async (task) => { /* ... */ }
    });

    // Register tools
    api.tools.register({
      name: 'tool-name',
      handler: async (params) => { /* ... */ }
    });
  }
};
```

### 3. Sandboxing
Plugins run in isolated contexts with explicit permissions:

```json
{
  "permissions": [
    "filesystem:read",
    "network:https",
    "config:read",
    "events:emit"
  ]
}
```

### 4. Dependency Management
Plugins can declare dependencies on other plugins and npm packages:

```json
{
  "dependencies": {
    "plugins": {
      "core-utils": "^1.0.0"
    },
    "npm": {
      "axios": "^1.6.0"
    }
  }
}
```

### 5. Custom Agents
Plugins can define custom agents in Markdown:

```markdown
# My Custom Agent

You are a specialized agent that...

## Your Role
- Task 1
- Task 2
```

Reference in `plugin.json`:
```json
{
  "agents": [
    {
      "name": "my-agent",
      "file": "agents/my-agent.md"
    }
  ]
}
```

## Example Plugins

### Hello World Plugin
Simple example demonstrating:
- Configuration management
- Event handling
- Storage API
- Lifecycle hooks

### Jira Integration Plugin
Production-ready example showing:
- API integration
- Custom agents
- Event hooks
- Background tasks

### Slack Notifier Plugin
Demonstrates:
- Webhook integration
- Tool registration
- Configuration schema
- Error handling

### Git Analyzer Plugin
Advanced example featuring:
- File system access
- Process spawning
- Caching
- Analytics

## CLI Commands

### List Plugins
```bash
node cli/plugin-cli.js list
```

### Create Plugin
```bash
node cli/plugin-cli.js create <name>
```

### Install Plugin
```bash
node cli/plugin-cli.js install <path>
```

### Uninstall Plugin
```bash
node cli/plugin-cli.js uninstall <name>
```

### Enable/Disable
```bash
node cli/plugin-cli.js enable <name>
node cli/plugin-cli.js disable <name>
```

### Validate Plugin
```bash
node cli/plugin-cli.js validate <path>
```

### Development Mode
```bash
node cli/plugin-cli.js dev <name>
```

### Plugin Info
```bash
node cli/plugin-cli.js info <name>
```

## Configuration

### Plugin Manifest (plugin.json)

Minimal example:
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "main": "index.js",
  "permissions": ["events:emit"]
}
```

Full example with all options:
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "author": "Your Name",
  "license": "MIT",
  "main": "index.js",
  "agents": [...],
  "tools": [...],
  "hooks": {...},
  "permissions": [...],
  "dependencies": {...},
  "config": {...},
  "enabled": true,
  "autoload": true,
  "priority": 0
}
```

See `plugin-schema.json` for complete schema definition.

### User Configuration

Override plugin configuration in `config.json`:
```json
{
  "apiKey": "your-api-key",
  "endpoint": "https://api.example.com"
}
```

## Permissions

Available permissions:
- `filesystem:read` - Read files
- `filesystem:write` - Write files
- `network:http` - HTTP requests
- `network:https` - HTTPS requests
- `process:spawn` - Spawn processes
- `storage:persistent` - Persistent storage
- `storage:temporary` - Temporary storage
- `config:read` - Read configuration
- `config:write` - Write configuration
- `agents:invoke` - Invoke agents
- `agents:register` - Register agents
- `tools:register` - Register tools
- `events:emit` - Emit events
- `events:subscribe` - Subscribe to events

## Lifecycle Hooks

### initialize(api)
Called when plugin is loaded:
```javascript
async initialize(api) {
  // Setup code
}
```

### cleanup(api)
Called when plugin is unloaded:
```javascript
async cleanup(api) {
  // Cleanup code
}
```

### onHotReload(api, customState)
Called during hot reload:
```javascript
async onHotReload(api, customState) {
  // Restore state
}
```

### onBeforeReload(api)
Called before hot reload:
```javascript
async onBeforeReload(api) {
  return { /* state to preserve */ };
}
```

## Events

### System Events
- `plugin:loaded` - Plugin loaded
- `plugin:enabled` - Plugin enabled
- `plugin:disabled` - Plugin disabled
- `plugin:unloaded` - Plugin unloaded
- `agent:invoked` - Agent invoked
- `agent:completed` - Agent completed
- `agent:failed` - Agent failed

### Custom Events
Emit custom events:
```javascript
api.events.emit('my-plugin:custom-event', { data });
```

Subscribe to custom events:
```javascript
api.events.on('my-plugin:custom-event', (data) => {
  // Handle event
});
```

## Best Practices

1. **Use Semantic Versioning**: Follow semver for version numbers
2. **Declare Permissions**: Only request permissions you need
3. **Clean Up Resources**: Always implement cleanup hook
4. **Handle Errors**: Use try-catch and log errors
5. **Document**: Write clear README with examples
6. **Test**: Test your plugin thoroughly
7. **Namespace Events**: Prefix custom events with plugin name
8. **Validate Config**: Validate configuration in initialize

## Troubleshooting

### Plugin won't load
- Check plugin.json syntax
- Verify required fields are present
- Check permissions in plugin.json
- Review error logs

### Hot reload not working
- Ensure dev mode is running
- Check file permissions
- Verify plugin path is correct

### Permission denied
- Add required permission to plugin.json
- Check permission spelling
- Review security policies

## Resources

- **Documentation**: `.claude/plugins/README.md`
- **Schema**: `.claude/plugins/plugin-schema.json`
- **Examples**: `.claude/plugins/examples/`
- **Template**: `.claude/plugins/templates/plugin-template/`
- **Registry**: `.claude/plugins/registry/registry.json`

## Next Steps

1. Read the complete documentation in `README.md`
2. Explore the example plugins in `examples/`
3. Create your first plugin with the CLI
4. Join the community and share your plugins!

## Support

- Issues: GitHub issues
- Docs: This directory
- Examples: `examples/` directory
- Community: Discord server

Happy plugin development! 🚀
