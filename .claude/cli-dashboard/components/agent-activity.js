const blessed = require('blessed');
const contrib = require('blessed-contrib');

/**
 * Agent activity monitor widget
 * Shows which agents are running, their status, and current tasks
 */
class AgentActivityWidget {
  constructor(screen, grid) {
    this.screen = screen;
    this.agents = {
      coder: { status: 'idle', task: null, stats: { success: 0, failure: 0 } },
      tester: { status: 'idle', task: null, stats: { success: 0, failure: 0 } },
      stuck: { status: 'idle', task: null, stats: { success: 0, failure: 0 } }
    };
    this.sessions = [];

    // Create agent activity box
    this.widget = grid.set(0, 6, 4, 6, blessed.box, {
      label: ' 🤖 Agent Activity ',
      tags: true,
      border: {
        type: 'line',
        fg: 'magenta'
      },
      style: {
        fg: 'white',
        border: {
          fg: 'magenta'
        }
      },
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      mouse: true
    });

    // Create performance stats table
    this.statsWidget = grid.set(4, 6, 3, 6, contrib.table, {
      keys: true,
      fg: 'white',
      selectedFg: 'white',
      selectedBg: 'blue',
      interactive: false,
      label: ' 📊 Agent Stats ',
      border: {
        type: 'line',
        fg: 'yellow'
      },
      columnSpacing: 3,
      columnWidth: [12, 10, 10, 10, 10]
    });
  }

  /**
   * Update agent activity from session data
   */
  updateFromSession(file, data) {
    // Parse session file name to get agent and timestamp
    const match = file.match(/(\w+)_(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/);
    if (!match) return;

    const [, agentName, timestamp] = match;

    if (this.agents[agentName]) {
      // Update agent status based on session data
      if (data && typeof data === 'object') {
        this.agents[agentName].status = data.status || 'working';
        this.agents[agentName].task = data.task || data.description;

        if (data.result === 'success') {
          this.agents[agentName].stats.success++;
        } else if (data.result === 'failure') {
          this.agents[agentName].stats.failure++;
        }
      } else {
        this.agents[agentName].status = 'working';
      }

      // Add to sessions history
      this.sessions.unshift({
        agent: agentName,
        timestamp,
        data
      });

      // Keep only last 50 sessions
      if (this.sessions.length > 50) {
        this.sessions = this.sessions.slice(0, 50);
      }
    }

    this.render();
  }

  /**
   * Mark agent as idle
   */
  setAgentIdle(agentName) {
    if (this.agents[agentName]) {
      this.agents[agentName].status = 'idle';
      this.agents[agentName].task = null;
      this.render();
    }
  }

  /**
   * Render agent activity
   */
  render() {
    const lines = [];
    lines.push('');

    // Display each agent's current status
    Object.entries(this.agents).forEach(([name, agent]) => {
      const statusColor = this.getStatusColor(agent.status);
      const statusIcon = this.getStatusIcon(agent.status);

      lines.push(`  {bold}${name.toUpperCase()}{/bold}`);
      lines.push(`    Status: {${statusColor}-fg}${statusIcon} ${agent.status}{/${statusColor}-fg}`);

      if (agent.task) {
        const taskPreview = agent.task.length > 60
          ? agent.task.substring(0, 60) + '...'
          : agent.task;
        lines.push(`    Task:   ${taskPreview}`);
      }

      lines.push(`    Stats:  ✓ ${agent.stats.success} | ⨯ ${agent.stats.failure}`);
      lines.push('');
    });

    // Recent activity
    if (this.sessions.length > 0) {
      lines.push('  {bold}Recent Activity:{/bold}');
      lines.push('');

      this.sessions.slice(0, 5).forEach(session => {
        const time = session.timestamp.replace(/T/, ' ').replace(/-/g, ':');
        lines.push(`    {grey-fg}[${time}]{/grey-fg} {cyan-fg}${session.agent}{/cyan-fg}`);
      });
    }

    this.widget.setContent(lines.join('\n'));

    // Update stats table
    this.updateStatsTable();

    this.screen.render();
  }

  /**
   * Update the statistics table
   */
  updateStatsTable() {
    const data = [
      ['Agent', 'Status', 'Success', 'Failure', 'Total']
    ];

    Object.entries(this.agents).forEach(([name, agent]) => {
      const total = agent.stats.success + agent.stats.failure;
      data.push([
        name.toUpperCase(),
        agent.status,
        agent.stats.success.toString(),
        agent.stats.failure.toString(),
        total.toString()
      ]);
    });

    this.statsWidget.setData({
      headers: data[0],
      data: data.slice(1)
    });
  }

  /**
   * Get status color
   */
  getStatusColor(status) {
    switch (status) {
      case 'idle':
        return 'grey';
      case 'working':
        return 'yellow';
      case 'success':
        return 'green';
      case 'failure':
      case 'stuck':
        return 'red';
      default:
        return 'white';
    }
  }

  /**
   * Get status icon
   */
  getStatusIcon(status) {
    switch (status) {
      case 'idle':
        return '○';
      case 'working':
        return '⟳';
      case 'success':
        return '✓';
      case 'failure':
      case 'stuck':
        return '⨯';
      default:
        return '?';
    }
  }
}

module.exports = AgentActivityWidget;
