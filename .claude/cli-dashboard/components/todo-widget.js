const blessed = require('blessed');
const contrib = require('blessed-contrib');

/**
 * Todo list widget with real-time updates
 * Shows all todos with status colors and progress
 */
class TodoWidget {
  constructor(screen, grid) {
    this.screen = screen;
    this.todos = [];

    // Create main todo list box
    this.widget = grid.set(0, 0, 6, 6, blessed.box, {
      label: ' 📋 Todo List ',
      tags: true,
      border: {
        type: 'line',
        fg: 'cyan'
      },
      style: {
        fg: 'white',
        border: {
          fg: 'cyan'
        },
        scrollbar: {
          bg: 'blue',
          fg: 'white'
        }
      },
      scrollable: true,
      alwaysScroll: true,
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

    // Progress bar
    this.progressBar = grid.set(6, 0, 1, 6, contrib.gauge, {
      label: ' Progress ',
      stroke: 'green',
      fill: 'white',
      border: {
        type: 'line',
        fg: 'green'
      }
    });
  }

  /**
   * Update todos and refresh display
   */
  update(todosData) {
    if (!todosData || !todosData.todos) {
      this.todos = [];
      this.render();
      return;
    }

    this.todos = todosData.todos;
    this.render();
  }

  /**
   * Render the todo list
   */
  render() {
    const lines = [];

    if (this.todos.length === 0) {
      lines.push('');
      lines.push('  {cyan-fg}No todos yet{/cyan-fg}');
      lines.push('');
      lines.push('  Waiting for orchestrator to create tasks...');
    } else {
      const completed = this.todos.filter(t => t.status === 'completed').length;
      const inProgress = this.todos.filter(t => t.status === 'in-progress').length;
      const pending = this.todos.filter(t => t.status === 'pending').length;
      const total = this.todos.length;

      lines.push('');
      lines.push(`  {bold}Summary:{/bold} ${completed}/${total} completed, ${inProgress} in progress, ${pending} pending`);
      lines.push('');

      this.todos.forEach((todo, index) => {
        const status = this.getStatusIndicator(todo.status);
        const number = `${index + 1}.`.padEnd(4);
        const title = todo.title || todo.task || 'Untitled';

        lines.push(`  ${number}${status} ${title}`);

        if (todo.assignedTo) {
          lines.push(`       {grey-fg}→ ${todo.assignedTo}{/grey-fg}`);
        }

        if (todo.error) {
          lines.push(`       {red-fg}⚠ ${todo.error}{/red-fg}`);
        }

        lines.push('');
      });

      // Update progress bar
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      this.progressBar.setPercent(progress);
    }

    this.widget.setContent(lines.join('\n'));
    this.screen.render();
  }

  /**
   * Get colored status indicator
   */
  getStatusIndicator(status) {
    switch (status) {
      case 'completed':
        return '{green-fg}✓{/green-fg}';
      case 'in-progress':
        return '{yellow-fg}⟳{/yellow-fg}';
      case 'pending':
        return '{grey-fg}○{/grey-fg}';
      case 'blocked':
        return '{red-fg}⨯{/red-fg}';
      default:
        return '{grey-fg}?{/grey-fg}';
    }
  }

  /**
   * Focus on this widget
   */
  focus() {
    this.widget.focus();
  }
}

module.exports = TodoWidget;
