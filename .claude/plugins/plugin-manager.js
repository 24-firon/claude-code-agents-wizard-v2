/**
 * Plugin Manager
 *
 * Core plugin management system with discovery, loading, dependency resolution,
 * lifecycle management, and sandboxing.
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const { PluginAPI } = require('./core/plugin-api');
const { HotReloadManager } = require('./core/hot-reload');

class PluginManager extends EventEmitter {
  constructor(pluginsDir) {
    super();
    this.pluginsDir = pluginsDir || path.join(__dirname);
    this.plugins = new Map();
    this.eventBus = new EventEmitter();
    this.hotReload = new HotReloadManager(this);
    this.registry = null;
  }

  /**
   * Initialize the plugin manager
   */
  async initialize() {
    console.log('[PluginManager] Initializing...');

    // Load registry
    try {
      const registryPath = path.join(this.pluginsDir, 'registry', 'registry.json');
      const registryData = await fs.readFile(registryPath, 'utf8');
      this.registry = JSON.parse(registryData);
    } catch (error) {
      console.warn('[PluginManager] Failed to load registry:', error.message);
      this.registry = { plugins: [] };
    }

    // Discover plugins
    await this.discoverPlugins();

    // Load all autoload plugins
    await this.loadAutoloadPlugins();

    console.log('[PluginManager] Initialized successfully');
    this.emit('initialized');
  }

  /**
   * Discover all plugins in the plugins directory
   */
  async discoverPlugins() {
    console.log('[PluginManager] Discovering plugins...');

    const examplesDir = path.join(this.pluginsDir, 'examples');

    try {
      const entries = await fs.readdir(examplesDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const pluginPath = path.join(examplesDir, entry.name);
        const manifestPath = path.join(pluginPath, 'plugin.json');

        try {
          await fs.access(manifestPath);
          const manifest = await this.loadManifest(manifestPath);

          // Register plugin metadata (don't load yet)
          this.plugins.set(manifest.name, {
            name: manifest.name,
            path: pluginPath,
            manifest,
            loaded: false,
            enabled: false,
            instance: null,
            api: null
          });

          console.log(`[PluginManager] Discovered plugin: ${manifest.name}`);
        } catch (error) {
          console.warn(`[PluginManager] Failed to discover plugin in ${entry.name}:`, error.message);
        }
      }
    } catch (error) {
      console.warn('[PluginManager] Examples directory not found:', error.message);
    }

    console.log(`[PluginManager] Discovered ${this.plugins.size} plugins`);
  }

  /**
   * Load manifest file and validate
   */
  async loadManifest(manifestPath) {
    const data = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(data);

    // Basic validation
    if (!manifest.name) throw new Error('Plugin name is required');
    if (!manifest.version) throw new Error('Plugin version is required');
    if (!manifest.description) throw new Error('Plugin description is required');
    if (!manifest.main) throw new Error('Plugin main entry is required');

    return manifest;
  }

  /**
   * Load all plugins marked for autoload
   */
  async loadAutoloadPlugins() {
    console.log('[PluginManager] Loading autoload plugins...');

    // Sort by priority (higher first)
    const sortedPlugins = Array.from(this.plugins.values())
      .filter(p => p.manifest.autoload !== false)
      .sort((a, b) => (b.manifest.priority || 0) - (a.manifest.priority || 0));

    for (const plugin of sortedPlugins) {
      try {
        await this.loadPlugin(plugin.name);
      } catch (error) {
        console.error(`[PluginManager] Failed to autoload ${plugin.name}:`, error);
      }
    }
  }

  /**
   * Load a specific plugin
   */
  async loadPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    if (plugin.loaded) {
      console.log(`[PluginManager] Plugin already loaded: ${pluginName}`);
      return;
    }

    console.log(`[PluginManager] Loading plugin: ${pluginName}`);

    // Check dependencies
    await this.resolveDependencies(plugin);

    // Check compatibility
    this.checkCompatibility(plugin);

    // Load the plugin module
    const mainPath = path.join(plugin.path, plugin.manifest.main);
    let pluginModule;

    try {
      pluginModule = require(mainPath);
    } catch (error) {
      throw new Error(`Failed to load plugin module: ${error.message}`);
    }

    // Create API instance for the plugin
    const api = new PluginAPI(pluginName, plugin.path, this);

    // Load configuration
    await api.config.load(plugin.manifest.config || {});

    // Initialize the plugin
    try {
      if (pluginModule.initialize && typeof pluginModule.initialize === 'function') {
        await pluginModule.initialize(api);
      }
    } catch (error) {
      throw new Error(`Plugin initialization failed: ${error.message}`);
    }

    // Update plugin state
    plugin.loaded = true;
    plugin.enabled = plugin.manifest.enabled !== false;
    plugin.instance = pluginModule;
    plugin.api = api;

    console.log(`[PluginManager] Loaded plugin: ${pluginName}`);
    this.emit('plugin:loaded', { name: pluginName });
    this.eventBus.emit('plugin:loaded', { name: pluginName });

    // Auto-enable if configured
    if (plugin.enabled) {
      await this.enablePlugin(pluginName);
    }

    // Start watching for hot reload if enabled
    if (this.hotReload.enabled) {
      this.hotReload.watch(pluginName);
    }
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    if (!plugin.loaded) {
      console.log(`[PluginManager] Plugin not loaded: ${pluginName}`);
      return;
    }

    console.log(`[PluginManager] Unloading plugin: ${pluginName}`);

    // Disable first
    if (plugin.enabled) {
      await this.disablePlugin(pluginName);
    }

    // Stop watching
    this.hotReload.stopWatching(pluginName);

    // Call cleanup if available
    if (plugin.instance && plugin.instance.cleanup) {
      try {
        await plugin.instance.cleanup(plugin.api);
      } catch (error) {
        console.error(`[PluginManager] Cleanup error for ${pluginName}:`, error);
      }
    }

    // Clear require cache
    const mainPath = path.join(plugin.path, plugin.manifest.main);
    delete require.cache[require.resolve(mainPath)];

    // Update state
    plugin.loaded = false;
    plugin.instance = null;
    plugin.api = null;

    console.log(`[PluginManager] Unloaded plugin: ${pluginName}`);
    this.emit('plugin:unloaded', { name: pluginName });
    this.eventBus.emit('plugin:unloaded', { name: pluginName });
  }

  /**
   * Reload a plugin (hot reload)
   */
  async reloadPlugin(pluginName) {
    console.log(`[PluginManager] Reloading plugin: ${pluginName}`);

    await this.unloadPlugin(pluginName);
    await this.loadPlugin(pluginName);

    console.log(`[PluginManager] Reloaded plugin: ${pluginName}`);
    this.emit('plugin:reloaded', { name: pluginName });
  }

  /**
   * Enable a plugin
   */
  async enablePlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    if (!plugin.loaded) {
      await this.loadPlugin(pluginName);
    }

    if (plugin.enabled) {
      console.log(`[PluginManager] Plugin already enabled: ${pluginName}`);
      return;
    }

    console.log(`[PluginManager] Enabling plugin: ${pluginName}`);

    plugin.enabled = true;

    this.emit('plugin:enabled', { name: pluginName });
    this.eventBus.emit('plugin:enabled', { name: pluginName });
  }

  /**
   * Disable a plugin
   */
  async disablePlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    if (!plugin.enabled) {
      console.log(`[PluginManager] Plugin already disabled: ${pluginName}`);
      return;
    }

    console.log(`[PluginManager] Disabling plugin: ${pluginName}`);

    plugin.enabled = false;

    this.emit('plugin:disabled', { name: pluginName });
    this.eventBus.emit('plugin:disabled', { name: pluginName });
  }

  /**
   * Resolve plugin dependencies
   */
  async resolveDependencies(plugin) {
    const deps = plugin.manifest.dependencies;
    if (!deps) return;

    // Plugin dependencies
    if (deps.plugins) {
      for (const [depName, versionRange] of Object.entries(deps.plugins)) {
        const depPlugin = this.plugins.get(depName);
        if (!depPlugin) {
          throw new Error(`Missing dependency: ${depName}`);
        }

        if (!depPlugin.loaded) {
          await this.loadPlugin(depName);
        }

        // TODO: Implement version range checking
      }
    }

    // NPM dependencies (just warn if missing)
    if (deps.npm) {
      for (const [pkgName, versionRange] of Object.entries(deps.npm)) {
        try {
          require.resolve(pkgName);
        } catch (error) {
          console.warn(`[PluginManager] NPM dependency not found: ${pkgName}@${versionRange}`);
        }
      }
    }
  }

  /**
   * Check plugin compatibility
   */
  checkCompatibility(plugin) {
    const compat = plugin.manifest.compatibility;
    if (!compat) return;

    // Check Node.js version
    if (compat.node) {
      const currentVersion = process.version;
      // TODO: Implement semver range checking
    }

    // Check platform
    if (compat.platform) {
      const currentPlatform = process.platform;
      if (!compat.platform.includes(currentPlatform)) {
        throw new Error(`Plugin not compatible with platform: ${currentPlatform}`);
      }
    }
  }

  /**
   * Check if plugin has permission
   */
  hasPermission(pluginName, permission) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) return false;

    const permissions = plugin.manifest.permissions || [];
    return permissions.includes(permission);
  }

  /**
   * List all plugins
   */
  listPlugins() {
    return Array.from(this.plugins.values()).map(p => ({
      name: p.name,
      version: p.manifest.version,
      description: p.manifest.description,
      author: p.manifest.author,
      loaded: p.loaded,
      enabled: p.enabled,
      autoload: p.manifest.autoload !== false
    }));
  }

  /**
   * Get plugin info
   */
  getPluginInfo(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) return null;

    return {
      name: plugin.name,
      path: plugin.path,
      manifest: plugin.manifest,
      loaded: plugin.loaded,
      enabled: plugin.enabled
    };
  }

  /**
   * Install plugin from path
   */
  async installPlugin(sourcePath) {
    // Load manifest from source
    const manifestPath = path.join(sourcePath, 'plugin.json');
    const manifest = await this.loadManifest(manifestPath);

    // Check if already installed
    if (this.plugins.has(manifest.name)) {
      throw new Error(`Plugin already installed: ${manifest.name}`);
    }

    // Copy to plugins directory
    const targetPath = path.join(this.pluginsDir, 'examples', manifest.name);
    await this.copyDirectory(sourcePath, targetPath);

    console.log(`[PluginManager] Installed plugin: ${manifest.name}`);

    // Discover the new plugin
    await this.discoverPlugins();

    return manifest.name;
  }

  /**
   * Uninstall plugin
   */
  async uninstallPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    // Unload if loaded
    if (plugin.loaded) {
      await this.unloadPlugin(pluginName);
    }

    // Remove from filesystem
    await fs.rm(plugin.path, { recursive: true, force: true });

    // Remove from registry
    this.plugins.delete(pluginName);

    console.log(`[PluginManager] Uninstalled plugin: ${pluginName}`);
  }

  /**
   * Copy directory recursively
   */
  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}

module.exports = { PluginManager };
