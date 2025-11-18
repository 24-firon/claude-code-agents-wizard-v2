/**
 * Plugin API
 *
 * Provides the API interface that plugins use to interact with the system.
 * Each plugin receives an instance of this API during initialization.
 */

const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');

class PluginAPI {
  constructor(pluginName, pluginDir, pluginManager) {
    this.pluginName = pluginName;
    this.pluginDir = pluginDir;
    this.pluginManager = pluginManager;

    // Initialize subsystems
    this._agents = new AgentRegistry(this);
    this._tools = new ToolRegistry(this);
    this._hooks = new HookRegistry(this);
    this._events = pluginManager.eventBus;
    this._config = new ConfigManager(this);
    this._log = new Logger(pluginName);
    this._storage = new StorageManager(pluginName);
  }

  get agents() {
    return this._agents;
  }

  get tools() {
    return this._tools;
  }

  get hooks() {
    return this._hooks;
  }

  get events() {
    return this._events;
  }

  get config() {
    return this._config;
  }

  get log() {
    return this._log;
  }

  get storage() {
    return this._storage;
  }

  /**
   * Check if plugin has a specific permission
   */
  hasPermission(permission) {
    return this.pluginManager.hasPermission(this.pluginName, permission);
  }

  /**
   * Require a permission (throws if not granted)
   */
  requirePermission(permission) {
    if (!this.hasPermission(permission)) {
      throw new Error(`Permission denied: ${permission}`);
    }
  }

  /**
   * Resolve a path relative to the plugin directory
   */
  resolvePath(...segments) {
    return path.join(this.pluginDir, ...segments);
  }
}

/**
 * Agent Registry
 */
class AgentRegistry {
  constructor(api) {
    this.api = api;
    this.agents = new Map();
  }

  register(config) {
    this.api.requirePermission('agents:register');

    const { name, description, handler, file } = config;

    if (!name) {
      throw new Error('Agent name is required');
    }

    if (this.agents.has(name)) {
      throw new Error(`Agent already registered: ${name}`);
    }

    this.agents.set(name, {
      name,
      description,
      handler,
      file,
      plugin: this.api.pluginName
    });

    this.api.log.info(`Registered agent: ${name}`);
    this.api.events.emit('agent:registered', { name, plugin: this.api.pluginName });

    return name;
  }

  unregister(name) {
    this.api.requirePermission('agents:register');

    if (!this.agents.has(name)) {
      throw new Error(`Agent not found: ${name}`);
    }

    this.agents.delete(name);
    this.api.log.info(`Unregistered agent: ${name}`);
    this.api.events.emit('agent:unregistered', { name, plugin: this.api.pluginName });
  }

  list() {
    return Array.from(this.agents.values());
  }

  async invoke(name, task, context = {}) {
    this.api.requirePermission('agents:invoke');

    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent not found: ${name}`);
    }

    if (!agent.handler) {
      throw new Error(`Agent ${name} has no handler`);
    }

    this.api.events.emit('agent:invoked', { name, task, plugin: this.api.pluginName });

    try {
      const result = await agent.handler(task, context);
      this.api.events.emit('agent:completed', { name, task, result, plugin: this.api.pluginName });
      return result;
    } catch (error) {
      this.api.events.emit('agent:failed', { name, task, error, plugin: this.api.pluginName });
      throw error;
    }
  }
}

/**
 * Tool Registry
 */
class ToolRegistry {
  constructor(api) {
    this.api = api;
    this.tools = new Map();
  }

  register(config) {
    this.api.requirePermission('tools:register');

    const { name, description, handler, parameters } = config;

    if (!name) {
      throw new Error('Tool name is required');
    }

    if (!handler) {
      throw new Error('Tool handler is required');
    }

    if (this.tools.has(name)) {
      throw new Error(`Tool already registered: ${name}`);
    }

    this.tools.set(name, {
      name,
      description,
      handler,
      parameters,
      plugin: this.api.pluginName
    });

    this.api.log.info(`Registered tool: ${name}`);
    this.api.events.emit('tool:registered', { name, plugin: this.api.pluginName });

    return name;
  }

  unregister(name) {
    this.api.requirePermission('tools:register');

    if (!this.tools.has(name)) {
      throw new Error(`Tool not found: ${name}`);
    }

    this.tools.delete(name);
    this.api.log.info(`Unregistered tool: ${name}`);
    this.api.events.emit('tool:unregistered', { name, plugin: this.api.pluginName });
  }

  list() {
    return Array.from(this.tools.values());
  }
}

/**
 * Hook Registry
 */
class HookRegistry {
  constructor(api) {
    this.api = api;
    this.hooks = new Map();
  }

  register(hookName, handler) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }

    this.hooks.get(hookName).push({
      handler,
      plugin: this.api.pluginName
    });

    this.api.log.debug(`Registered hook: ${hookName}`);
  }

  unregister(hookName, handler) {
    if (!this.hooks.has(hookName)) {
      return;
    }

    const hooks = this.hooks.get(hookName);
    const index = hooks.findIndex(h => h.handler === handler);

    if (index !== -1) {
      hooks.splice(index, 1);
      this.api.log.debug(`Unregistered hook: ${hookName}`);
    }
  }

  async trigger(hookName, data) {
    if (!this.hooks.has(hookName)) {
      return data;
    }

    const hooks = this.hooks.get(hookName);
    let result = data;

    for (const { handler, plugin } of hooks) {
      try {
        result = await handler(result);
      } catch (error) {
        this.api.log.error(`Hook error in ${plugin}:${hookName}`, error);
        throw error;
      }
    }

    return result;
  }

  list() {
    const result = {};
    for (const [hookName, hooks] of this.hooks.entries()) {
      result[hookName] = hooks.map(h => h.plugin);
    }
    return result;
  }
}

/**
 * Configuration Manager
 */
class ConfigManager {
  constructor(api) {
    this.api = api;
    this.config = {};
  }

  async load(pluginConfig = {}) {
    this.config = { ...pluginConfig };

    // Try to load user overrides from file
    try {
      const configPath = this.api.resolvePath('config.json');
      const userConfig = JSON.parse(await fs.readFile(configPath, 'utf8'));
      this.config = { ...this.config, ...userConfig };
    } catch (error) {
      // No user config file, use defaults
    }
  }

  get(key, defaultValue = undefined) {
    this.api.requirePermission('config:read');

    if (!key) {
      throw new Error('Config key is required');
    }

    const value = this._getNestedValue(this.config, key);
    return value !== undefined ? value : defaultValue;
  }

  set(key, value) {
    this.api.requirePermission('config:write');

    if (!key) {
      throw new Error('Config key is required');
    }

    this._setNestedValue(this.config, key, value);
  }

  getAll() {
    this.api.requirePermission('config:read');
    return { ...this.config };
  }

  _getNestedValue(obj, key) {
    const keys = key.split('.');
    let current = obj;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }

    return current;
  }

  _setNestedValue(obj, key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let current = obj;

    for (const k of keys) {
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }

    current[lastKey] = value;
  }
}

/**
 * Logger
 */
class Logger {
  constructor(pluginName) {
    this.pluginName = pluginName;
  }

  _log(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.pluginName}]`;
    console.log(prefix, message, ...args);
  }

  debug(message, ...args) {
    this._log('debug', message, ...args);
  }

  info(message, ...args) {
    this._log('info', message, ...args);
  }

  warn(message, ...args) {
    this._log('warn', message, ...args);
  }

  error(message, ...args) {
    this._log('error', message, ...args);
  }
}

/**
 * Storage Manager
 */
class StorageManager {
  constructor(pluginName) {
    this.pluginName = pluginName;
    this.storage = new Map();
  }

  get(key) {
    return this.storage.get(key);
  }

  set(key, value) {
    this.storage.set(key, value);
  }

  delete(key) {
    return this.storage.delete(key);
  }

  clear() {
    this.storage.clear();
  }

  keys() {
    return Array.from(this.storage.keys());
  }

  async persist() {
    // TODO: Implement persistent storage
  }

  async restore() {
    // TODO: Implement persistent storage restoration
  }
}

module.exports = { PluginAPI };
