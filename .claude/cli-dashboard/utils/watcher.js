const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

/**
 * File system watcher for monitoring agent system files
 * Emits events when todos, metrics, or logs change
 */
class SystemWatcher extends EventEmitter {
  constructor(basePath) {
    super();
    this.basePath = basePath || path.join(process.cwd(), '.claude');
    this.watchers = [];
    this.cache = {
      todos: null,
      metrics: null,
      agentActivity: null
    };
  }

  /**
   * Start watching all relevant files
   */
  start() {
    // Watch todos.json
    const todosPath = path.join(this.basePath, 'todos.json');
    this.watchFile(todosPath, 'todos', (data) => {
      this.emit('todos-updated', data);
    });

    // Watch metrics directory
    const metricsPath = path.join(this.basePath, 'metrics');
    this.watchDirectory(metricsPath, 'metrics', (file, data) => {
      this.emit('metrics-updated', { file, data });
    });

    // Watch agent activity (sessions directory)
    const sessionsPath = path.join(this.basePath, 'sessions');
    this.watchDirectory(sessionsPath, 'sessions', (file, data) => {
      this.emit('session-updated', { file, data });
    });

    // Watch logs directory
    const logsPath = path.join(this.basePath, 'logs');
    this.watchDirectory(logsPath, 'logs', (file, data) => {
      this.emit('log-updated', { file, data });
    });

    this.emit('watcher-started');
  }

  /**
   * Watch a single file for changes
   */
  watchFile(filePath, key, callback) {
    // Initial read
    this.readFile(filePath, (data) => {
      this.cache[key] = data;
      callback(data);
    });

    // Watch for changes
    const watcher = chokidar.watch(filePath, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      }
    });

    watcher.on('change', () => {
      this.readFile(filePath, (data) => {
        this.cache[key] = data;
        callback(data);
      });
    });

    this.watchers.push(watcher);
  }

  /**
   * Watch a directory for changes
   */
  watchDirectory(dirPath, key, callback) {
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const watcher = chokidar.watch(dirPath, {
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
      }
    });

    watcher.on('add', (filePath) => {
      this.readFile(filePath, (data) => {
        callback(path.basename(filePath), data);
      });
    });

    watcher.on('change', (filePath) => {
      this.readFile(filePath, (data) => {
        callback(path.basename(filePath), data);
      });
    });

    this.watchers.push(watcher);
  }

  /**
   * Read and parse a file
   */
  readFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback(null);
        return;
      }

      try {
        // Try to parse as JSON
        const parsed = JSON.parse(data);
        callback(parsed);
      } catch (e) {
        // Return raw text if not JSON
        callback(data);
      }
    });
  }

  /**
   * Get current cached data
   */
  getData(key) {
    return this.cache[key];
  }

  /**
   * Stop all watchers
   */
  stop() {
    this.watchers.forEach(watcher => watcher.close());
    this.watchers = [];
    this.emit('watcher-stopped');
  }
}

module.exports = SystemWatcher;
