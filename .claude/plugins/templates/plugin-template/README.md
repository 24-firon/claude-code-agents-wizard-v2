# Plugin Name

A brief description of what this plugin does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

```bash
node .claude/plugins/cli/plugin-cli.js install /path/to/plugin
```

Or if developing locally:

```bash
node .claude/plugins/cli/plugin-cli.js enable plugin-name
```

## Configuration

Edit your plugin's `config.json` or configure via the plugin manifest:

```json
{
  "exampleSetting": "value",
  "anotherSetting": 123
}
```

### Configuration Options

- `exampleSetting` (string): Description of this setting
- `anotherSetting` (number): Description of this setting

## Usage

Describe how to use your plugin. Include examples:

```javascript
// Example usage
```

## API

### Agents

If your plugin provides custom agents, document them here:

#### agent-name

Description of what this agent does.

**Parameters:**
- `param1`: Description
- `param2`: Description

**Example:**
```
Invoke agent-name with task...
```

### Tools

If your plugin provides custom tools, document them here:

#### tool-name

Description of what this tool does.

**Parameters:**
- `param1`: Description
- `param2`: Description

**Example:**
```javascript
api.tools.invoke('tool-name', { param1: 'value' });
```

### Events

#### Emitted Events

- `plugin-name:event-name` - Description of when this is emitted
  ```javascript
  {
    // Event payload structure
  }
  ```

#### Subscribed Events

- `event-name` - Description of what the plugin does with this event

## Development

To develop this plugin with hot reload:

```bash
node .claude/plugins/cli/plugin-cli.js dev plugin-name
```

This will watch for file changes and automatically reload the plugin.

## Testing

Describe how to test your plugin.

## Troubleshooting

### Common Issues

**Issue 1**: Description and solution
**Issue 2**: Description and solution

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Author

Your Name - [@yourhandle](https://twitter.com/yourhandle)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
