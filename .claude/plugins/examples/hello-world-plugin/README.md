# Hello World Plugin

A simple example plugin that demonstrates the basic plugin API features.

## Features

- Configuration management
- Event subscription and emission
- Storage API usage
- Lifecycle hooks (initialize, cleanup)
- Hot reload support

## Installation

This plugin is installed by default as an example.

## Configuration

```json
{
  "greeting": "Hello",
  "name": "World"
}
```

### Options

- `greeting` (string): The greeting message (default: "Hello")
- `name` (string): The name to greet (default: "World")

## Usage

The plugin automatically initializes and logs a greeting message. It also:

1. Subscribes to `plugin:loaded` events to log when other plugins are loaded
2. Stores initialization timestamp
3. Emits a `hello-world:initialized` event

## Events

### Emitted Events

- `hello-world:initialized` - Emitted when the plugin initializes
  ```javascript
  {
    greeting: "Hello",
    name: "World",
    timestamp: 1234567890
  }
  ```

### Subscribed Events

- `plugin:loaded` - Logs when other plugins are loaded

## API Usage Examples

This plugin demonstrates:

### Configuration

```javascript
const greeting = api.config.get('greeting', 'Hello');
const name = api.config.get('name', 'World');
```

### Events

```javascript
// Subscribe
api.events.on('plugin:loaded', (data) => {
  api.log.info(`Another plugin was loaded: ${data.name}`);
});

// Emit
api.events.emit('hello-world:initialized', {
  greeting,
  name,
  timestamp: Date.now()
});
```

### Storage

```javascript
api.storage.set('initialized-at', new Date().toISOString());
const initializedAt = api.storage.get('initialized-at');
```

### Logging

```javascript
api.log.info('Information message');
api.log.warn('Warning message');
api.log.error('Error message');
api.log.debug('Debug message');
```

## Hot Reload

This plugin supports hot reload with state preservation:

```javascript
async onBeforeReload(api) {
  // Save state before reload
  return {
    lastReload: Date.now(),
    customData: 'preserved'
  };
}

async onHotReload(api, customState) {
  // Restore state after reload
  console.log(customState.customData); // 'preserved'
}
```

## License

MIT
