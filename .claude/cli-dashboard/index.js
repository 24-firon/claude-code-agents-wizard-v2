#!/usr/bin/env node

const blessed = require('blessed');
const contrib = require('blessed-contrib');
const chalk = require('chalk');
const SystemWatcher = require('./utils/watcher');
const TodoWidget = require('./components/todo-widget');
const AgentActivityWidget = require('./components/agent-activity');
const MetricsChartWidget = require('./components/metrics-chart');
const LogViewerWidget = require('./components/log-viewer');
const path = require('path');

/**
 * Claude Agent Dashboard
 * Epic interactive CLI dashboard for monitoring agent orchestration
 */
class AgentDashboard {
  constructor() {
    this.currentView = 'overview';
    this.basePath = path.join(process.cwd(), '.claude');

    // Create screen
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Claude Agent Dashboard',
      fullUnicode: true
    });

    // Initialize watcher
    this.watcher = new SystemWatcher(this.basePath);

    // Setup UI
    this.setupUI();
    this.setupWatcher();
    this.setupKeyBindings();

    // Start watching
    this.watcher.start();

    // Add welcome log
    if (this.currentView === 'overview') {
      this.addSystemLog('info', 'Dashboard started - monitoring agent system');
      this.addSystemLog('info', `Watching: ${this.basePath}`);
    }
  }

  /**
   * Setup the UI layout
   */
  setupUI() {
    // Create grid layout
    this.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: this.screen
    });

    // Create header
    this.header = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      tags: true,
      border: {
        type: 'line',
        fg: 'cyan'
      },
      style: {
        fg: 'white',
        bg: 'black',
        border: {
          fg: 'cyan'
        }
      },
      content: this.getHeaderContent()
    });

    this.screen.append(this.header);

    // Adjust grid to account for header
    this.grid.options.top = 3;
    this.grid.options.height = this.screen.height - 3;

    // Initialize views
    this.initializeOverviewView();
  }

  /**
   * Initialize overview view with all widgets
   */
  initializeOverviewView() {
    // Create widgets
    this.todoWidget = new TodoWidget(this.screen, this.grid);
    this.agentWidget = new AgentActivityWidget(this.screen, this.grid);
    this.metricsWidget = new MetricsChartWidget(this.screen, this.grid);

    // Initial render
    this.screen.render();
  }

  /**
   * Initialize logs view
   */
  initializeLogsView() {
    // Clear existing grid items
    this.clearGrid();

    // Recreate grid without header offset
    this.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: this.screen,
      top: 3,
      height: this.screen.height - 3
    });

    // Create log viewer
    this.logWidget = new LogViewerWidget(this.screen, this.grid);

    // Re-add existing logs
    if (this.systemLogs) {
      this.systemLogs.forEach(log => {
        this.logWidget.addLog(log.file, log.data);
      });
    }

    this.screen.render();
  }

  /**
   * Clear grid items
   */
  clearGrid() {
    if (this.grid && this.grid.rows) {
      this.grid.rows.forEach(row => {
        row.forEach(widget => {
          if (widget && widget.detach) {
            widget.detach();
          }
        });
      });
    }
  }

  /**
   * Switch views
   */
  switchView(view) {
    if (this.currentView === view) return;

    this.currentView = view;
    this.clearGrid();

    if (view === 'overview') {
      this.initializeOverviewView();
    } else if (view === 'logs') {
      this.initializeLogsView();
    }

    this.updateHeader();
  }

  /**
   * Get header content
   */
  getHeaderContent() {
    const title = '{bold}{cyan-fg}╔═══════════════════════════════════════════════════════════════╗{/cyan-fg}{/bold}\n';
    const subtitle = '{bold}{cyan-fg}║{/cyan-fg}  🚀 {white-fg}CLAUDE AGENT ORCHESTRATION DASHBOARD{/white-fg}                {cyan-fg}║{/cyan-fg}{/bold}\n';
    const bottom = '{bold}{cyan-fg}╚═══════════════════════════════════════════════════════════════╝{/cyan-fg}{/bold}';

    const viewInfo = this.currentView === 'overview' ? '{yellow-fg}[OVERVIEW]{/yellow-fg}' : '{blue-fg}[LOGS]{/blue-fg}';
    const help = '{grey-fg}Press {white-fg}q{/grey-fg} to quit | {white-fg}o{/grey-fg} overview | {white-fg}l{/grey-fg} logs | {white-fg}r{/grey-fg} refresh{/grey-fg}';

    return `${title}${subtitle}${bottom}\n${viewInfo}  ${help}`;
  }

  /**
   * Update header
   */
  updateHeader() {
    this.header.setContent(this.getHeaderContent());
    this.screen.render();
  }

  /**
   * Setup file system watcher
   */
  setupWatcher() {
    this.systemLogs = [];

    // Todo updates
    this.watcher.on('todos-updated', (data) => {
      if (this.todoWidget) {
        this.todoWidget.update(data);
      }
      this.addSystemLog('info', `Todo list updated: ${data?.todos?.length || 0} items`);
    });

    // Metrics updates
    this.watcher.on('metrics-updated', ({ file, data }) => {
      if (this.metricsWidget) {
        this.metricsWidget.updateMetrics(file, data);
      }
      this.addSystemLog('debug', `Metrics updated: ${file}`);
    });

    // Session/agent activity updates
    this.watcher.on('session-updated', ({ file, data }) => {
      if (this.agentWidget) {
        this.agentWidget.updateFromSession(file, data);
      }
      this.addSystemLog('info', `Agent activity: ${file}`);
    });

    // Log updates
    this.watcher.on('log-updated', ({ file, data }) => {
      this.addSystemLog('info', `Log file updated: ${file}`, data);
    });

    // Watcher started
    this.watcher.on('watcher-started', () => {
      this.addSystemLog('success', 'File watcher started successfully');
    });
  }

  /**
   * Add system log
   */
  addSystemLog(level, message, data) {
    const logEntry = {
      file: 'system',
      data: {
        level,
        message,
        timestamp: new Date().toISOString(),
        agent: 'dashboard'
      }
    };

    this.systemLogs.push(logEntry);

    if (this.logWidget) {
      this.logWidget.addLog(logEntry.file, logEntry.data);
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyBindings() {
    // Quit on q, Ctrl-C
    this.screen.key(['q', 'C-c'], () => {
      this.cleanup();
      return process.exit(0);
    });

    // Switch to overview
    this.screen.key(['o'], () => {
      this.switchView('overview');
    });

    // Switch to logs
    this.screen.key(['l'], () => {
      this.switchView('logs');
    });

    // Refresh
    this.screen.key(['r'], () => {
      this.addSystemLog('info', 'Manual refresh triggered');
      this.screen.render();
    });

    // Help
    this.screen.key(['h', '?'], () => {
      this.showHelp();
    });

    // Demo mode (simulate data)
    this.screen.key(['d'], () => {
      if (this.metricsWidget) {
        this.addSystemLog('info', 'Demo mode activated - simulating data');
        this.metricsWidget.simulateData();
      }
    });
  }

  /**
   * Show help dialog
   */
  showHelp() {
    const helpBox = blessed.box({
      top: 'center',
      left: 'center',
      width: 60,
      height: 20,
      tags: true,
      border: {
        type: 'line',
        fg: 'cyan'
      },
      style: {
        fg: 'white',
        bg: 'black',
        border: {
          fg: 'cyan'
        }
      },
      label: ' 📖 Help ',
      content: `
  {bold}Keyboard Shortcuts:{/bold}

  {cyan-fg}q{/cyan-fg}       - Quit dashboard
  {cyan-fg}o{/cyan-fg}       - Switch to Overview view
  {cyan-fg}l{/cyan-fg}       - Switch to Logs view
  {cyan-fg}r{/cyan-fg}       - Refresh display
  {cyan-fg}h, ?{/cyan-fg}    - Show this help
  {cyan-fg}d{/cyan-fg}       - Demo mode (simulate data)
  {cyan-fg}ESC{/cyan-fg}     - Close dialogs

  {bold}Views:{/bold}

  {yellow-fg}Overview{/yellow-fg} - See todos, agents, and metrics
  {blue-fg}Logs{/blue-fg}     - View detailed system logs

  {bold}Features:{/bold}

  • Real-time todo list monitoring
  • Live agent activity tracking
  • Performance metrics & charts
  • Comprehensive logging system

  {grey-fg}Press ESC to close this help{/grey-fg}
      `
    });

    this.screen.append(helpBox);
    helpBox.focus();

    helpBox.key(['escape', 'q'], () => {
      helpBox.destroy();
      this.screen.render();
    });

    this.screen.render();
  }

  /**
   * Cleanup on exit
   */
  cleanup() {
    if (this.watcher) {
      this.watcher.stop();
    }
  }

  /**
   * Start the dashboard
   */
  start() {
    this.screen.render();
  }
}

// Start the dashboard
if (require.main === module) {
  console.log(chalk.cyan.bold('\n🚀 Starting Claude Agent Dashboard...\n'));

  const dashboard = new AgentDashboard();
  dashboard.start();

  console.log(chalk.green('✓ Dashboard running!'));
  console.log(chalk.grey('  Press q to quit, h for help\n'));
}

module.exports = AgentDashboard;
