/**
 * Hot Reload System
 *
 * Watches plugin files for changes and automatically reloads plugins
 * without requiring a full system restart. Preserves state when possible.
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class HotReloadManager extends EventEmitter {
  constructor(pluginManager) {
    super();
    this.pluginManager = pluginManager;
    this.watchers = new Map();
    this.reloadDebounce = new Map();
    this.enabled = false;
  }

  /**
   * Enable hot reloading for all plugins
   */
  enable() {
    this.enabled = true;
    this.emit('enabled');
    console.log('[HotReload] Hot reload enabled');
  }

  /**
   * Disable hot reloading
   */
  disable() {
    this.enabled = false;
    this.stopWatchingAll();
    this.emit('disabled');
    console.log('[HotReload] Hot reload disabled');
  }

  /**
   * Watch a plugin for changes
   */
  watch(pluginName) {
    if (!this.enabled) {
      return;
    }

    if (this.watchers.has(pluginName)) {
      console.log(`[HotReload] Already watching: ${pluginName}`);
      return;
    }

    const plugin = this.pluginManager.plugins.get(pluginName);
    if (!plugin) {
      console.error(`[HotReload] Plugin not found: ${pluginName}`);
      return;
    }

    const watcher = this._createWatcher(pluginName, plugin.path);
    this.watchers.set(pluginName, watcher);

    console.log(`[HotReload] Watching plugin: ${pluginName}`);
  }

  /**
   * Stop watching a plugin
   */
  stopWatching(pluginName) {
    const watcher = this.watchers.get(pluginName);
    if (!watcher) {
      return;
    }

    watcher.close();
    this.watchers.delete(pluginName);
    console.log(`[HotReload] Stopped watching: ${pluginName}`);
  }

  /**
   * Stop watching all plugins
   */
  stopWatchingAll() {
    for (const [pluginName, watcher] of this.watchers.entries()) {
      watcher.close();
      console.log(`[HotReload] Stopped watching: ${pluginName}`);
    }
    this.watchers.clear();
  }

  /**
   * Create a file watcher for a plugin directory
   */
  _createWatcher(pluginName, pluginPath) {
    const watcher = fs.watch(
      pluginPath,
      { recursive: true },
      (eventType, filename) => {
        if (!filename) return;

        // Ignore certain files/directories
        if (this._shouldIgnoreFile(filename)) {
          return;
        }

        console.log(`[HotReload] File changed: ${filename} in ${pluginName}`);
        this._handleFileChange(pluginName, filename, eventType);
      }
    );

    watcher.on('error', (error) => {
      console.error(`[HotReload] Watcher error for ${pluginName}:`, error);
      this.emit('error', { pluginName, error });
    });

    return watcher;
  }

  /**
   * Handle a file change event
   */
  _handleFileChange(pluginName, filename, eventType) {
    // Debounce rapid changes
    const debounceKey = `${pluginName}:${filename}`;

    if (this.reloadDebounce.has(debounceKey)) {
      clearTimeout(this.reloadDebounce.get(debounceKey));
    }

    const timeout = setTimeout(async () => {
      this.reloadDebounce.delete(debounceKey);

      try {
        await this._reloadPlugin(pluginName, filename);
      } catch (error) {
        console.error(`[HotReload] Failed to reload ${pluginName}:`, error);
        this.emit('reload:error', { pluginName, filename, error });
      }
    }, 200); // 200ms debounce

    this.reloadDebounce.set(debounceKey, timeout);
  }

  /**
   * Reload a plugin
   */
  async _reloadPlugin(pluginName, changedFile) {
    console.log(`[HotReload] Reloading plugin: ${pluginName}`);

    const plugin = this.pluginManager.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    // Preserve state if possible
    const state = await this._capturePluginState(pluginName);

    try {
      // Clear require cache for the plugin's modules
      this._clearRequireCache(plugin.path);

      // Reload the plugin
      await this.pluginManager.reloadPlugin(pluginName);

      // Restore state if plugin supports it
      await this._restorePluginState(pluginName, state);

      console.log(`[HotReload] Successfully reloaded: ${pluginName}`);
      this.emit('reload:success', { pluginName, changedFile });
    } catch (error) {
      console.error(`[HotReload] Failed to reload ${pluginName}:`, error);

      // Try to rollback to previous version
      try {
        await this._rollbackPlugin(pluginName, state);
        console.log(`[HotReload] Rolled back to previous version: ${pluginName}`);
        this.emit('reload:rollback', { pluginName, error });
      } catch (rollbackError) {
        console.error(`[HotReload] Rollback failed for ${pluginName}:`, rollbackError);
        this.emit('reload:failed', { pluginName, error, rollbackError });
      }

      throw error;
    }
  }

  /**
   * Capture plugin state before reload
   */
  async _capturePluginState(pluginName) {
    const plugin = this.pluginManager.plugins.get(pluginName);
    if (!plugin || !plugin.instance) {
      return null;
    }

    const state = {
      config: plugin.api ? plugin.api.config.getAll() : {},
      storage: plugin.api ? plugin.api.storage.storage : new Map(),
      enabled: plugin.enabled
    };

    // Call plugin's state capture hook if available
    if (plugin.instance.onBeforeReload && typeof plugin.instance.onBeforeReload === 'function') {
      try {
        const customState = await plugin.instance.onBeforeReload(plugin.api);
        state.custom = customState;
      } catch (error) {
        console.warn(`[HotReload] Failed to capture state for ${pluginName}:`, error);
      }
    }

    return state;
  }

  /**
   * Restore plugin state after reload
   */
  async _restorePluginState(pluginName, state) {
    if (!state) {
      return;
    }

    const plugin = this.pluginManager.plugins.get(pluginName);
    if (!plugin || !plugin.instance) {
      return;
    }

    // Restore config
    if (state.config && plugin.api) {
      for (const [key, value] of Object.entries(state.config)) {
        plugin.api.config.set(key, value);
      }
    }

    // Restore storage
    if (state.storage && plugin.api) {
      plugin.api.storage.storage = new Map(state.storage);
    }

    // Call plugin's state restore hook if available
    if (plugin.instance.onHotReload && typeof plugin.instance.onHotReload === 'function') {
      try {
        await plugin.instance.onHotReload(plugin.api, state.custom);
      } catch (error) {
        console.warn(`[HotReload] Failed to restore state for ${pluginName}:`, error);
      }
    }
  }

  /**
   * Rollback plugin to previous version
   */
  async _rollbackPlugin(pluginName, state) {
    // For now, just try to restore state
    // In a production system, you might keep backup copies of plugin code
    if (state) {
      await this._restorePluginState(pluginName, state);
    }
  }

  /**
   * Clear Node.js require cache for a directory
   */
  _clearRequireCache(directory) {
    const resolvedDir = path.resolve(directory);

    // Find all cached modules from this directory
    for (const key in require.cache) {
      if (key.startsWith(resolvedDir)) {
        delete require.cache[key];
      }
    }
  }

  /**
   * Check if a file should be ignored
   */
  _shouldIgnoreFile(filename) {
    const ignoredPatterns = [
      /node_modules/,
      /\.git/,
      /\.DS_Store/,
      /\.swp$/,
      /\.tmp$/,
      /~$/,
      /package-lock\.json/,
      /yarn\.lock/
    ];

    return ignoredPatterns.some(pattern => pattern.test(filename));
  }

  /**
   * Get watch status for all plugins
   */
  getStatus() {
    return {
      enabled: this.enabled,
      watching: Array.from(this.watchers.keys())
    };
  }
}

module.exports = { HotReloadManager };
