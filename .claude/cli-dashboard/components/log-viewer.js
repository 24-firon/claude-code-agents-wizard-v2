const blessed = require('blessed');
const fs = require('fs');
const path = require('path');

/**
 * Log viewer widget
 * Displays logs with filtering and color coding
 */
class LogViewerWidget {
  constructor(screen, grid) {
    this.screen = screen;
    this.logs = [];
    this.filter = {
      agent: null,
      level: null,
      keyword: null
    };

    // Create log display box
    this.widget = grid.set(0, 0, 10, 12, blessed.log, {
      label: ' 📜 System Logs ',
      tags: true,
      border: {
        type: 'line',
        fg: 'blue'
      },
      style: {
        fg: 'white',
        border: {
          fg: 'blue'
        },
        scrollbar: {
          bg: 'blue',
          fg: 'white'
        }
      },
      scrollable: true,
      alwaysScroll: true,
      scrollback: 1000,
      scrollbar: {
        ch: '█',
        track: {
          bg: 'grey'
        },
        style: {
          inverse: true
        }
      },
      keys: true,
      vi: true,
      mouse: true
    });

    // Filter info box
    this.filterBox = grid.set(10, 0, 2, 12, blessed.box, {
      label: ' 🔍 Filters ',
      tags: true,
      border: {
        type: 'line',
        fg: 'yellow'
      },
      style: {
        fg: 'white',
        border: {
          fg: 'yellow'
        }
      },
      content: this.getFilterInfo()
    });
  }

  /**
   * Add a new log entry
   */
  addLog(file, data) {
    const timestamp = new Date().toISOString();
    let logEntry;

    if (typeof data === 'string') {
      logEntry = {
        timestamp,
        file,
        message: data,
        level: this.detectLogLevel(data)
      };
    } else if (typeof data === 'object') {
      logEntry = {
        timestamp,
        file,
        message: data.message || JSON.stringify(data),
        level: data.level || 'info',
        agent: data.agent
      };
    } else {
      return;
    }

    this.logs.push(logEntry);

    // Keep last 500 logs
    if (this.logs.length > 500) {
      this.logs.shift();
    }

    this.render();
  }

  /**
   * Detect log level from message content
   */
  detectLogLevel(message) {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('error') || lowerMsg.includes('fail')) return 'error';
    if (lowerMsg.includes('warn')) return 'warn';
    if (lowerMsg.includes('success')) return 'success';
    if (lowerMsg.includes('debug')) return 'debug';
    return 'info';
  }

  /**
   * Set filter
   */
  setFilter(type, value) {
    this.filter[type] = value;
    this.filterBox.setContent(this.getFilterInfo());
    this.render();
  }

  /**
   * Clear filter
   */
  clearFilters() {
    this.filter = {
      agent: null,
      level: null,
      keyword: null
    };
    this.filterBox.setContent(this.getFilterInfo());
    this.render();
  }

  /**
   * Get filter info text
   */
  getFilterInfo() {
    const parts = [];

    if (this.filter.agent) {
      parts.push(`Agent: {cyan-fg}${this.filter.agent}{/cyan-fg}`);
    }

    if (this.filter.level) {
      parts.push(`Level: {yellow-fg}${this.filter.level}{/yellow-fg}`);
    }

    if (this.filter.keyword) {
      parts.push(`Keyword: {green-fg}${this.filter.keyword}{/green-fg}`);
    }

    if (parts.length === 0) {
      return '  {grey-fg}No active filters - showing all logs{/grey-fg}';
    }

    return '  ' + parts.join(' | ');
  }

  /**
   * Render logs with current filters
   */
  render() {
    this.widget.setContent('');

    const filteredLogs = this.logs.filter(log => {
      if (this.filter.agent && log.agent !== this.filter.agent) {
        return false;
      }

      if (this.filter.level && log.level !== this.filter.level) {
        return false;
      }

      if (this.filter.keyword) {
        const keyword = this.filter.keyword.toLowerCase();
        if (!log.message.toLowerCase().includes(keyword)) {
          return false;
        }
      }

      return true;
    });

    filteredLogs.forEach(log => {
      const color = this.getLevelColor(log.level);
      const icon = this.getLevelIcon(log.level);
      const time = new Date(log.timestamp).toLocaleTimeString();

      let line = `{grey-fg}[${time}]{/grey-fg} {${color}-fg}${icon}{/${color}-fg} `;

      if (log.agent) {
        line += `{cyan-fg}[${log.agent}]{/cyan-fg} `;
      }

      line += log.message;

      this.widget.log(line);
    });

    this.screen.render();
  }

  /**
   * Get color for log level
   */
  getLevelColor(level) {
    switch (level) {
      case 'error':
        return 'red';
      case 'warn':
        return 'yellow';
      case 'success':
        return 'green';
      case 'debug':
        return 'blue';
      case 'info':
      default:
        return 'white';
    }
  }

  /**
   * Get icon for log level
   */
  getLevelIcon(level) {
    switch (level) {
      case 'error':
        return '✗';
      case 'warn':
        return '⚠';
      case 'success':
        return '✓';
      case 'debug':
        return '◆';
      case 'info':
      default:
        return '●';
    }
  }

  /**
   * Export logs to file
   */
  exportLogs(filePath) {
    const content = this.logs.map(log => {
      return `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.agent ? `[${log.agent}] ` : ''}${log.message}`;
    }).join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
  }

  /**
   * Focus on this widget
   */
  focus() {
    this.widget.focus();
  }
}

module.exports = LogViewerWidget;
