const blessed = require('blessed');
const contrib = require('blessed-contrib');

/**
 * Metrics visualization widget
 * Shows charts and graphs for system performance
 */
class MetricsChartWidget {
  constructor(screen, grid) {
    this.screen = screen;
    this.metricsHistory = {
      taskCompletion: [],
      agentPerformance: [],
      systemLoad: []
    };

    // Line chart for task completion over time
    this.lineChart = grid.set(7, 0, 5, 6, contrib.line, {
      style: {
        line: 'yellow',
        text: 'green',
        baseline: 'black'
      },
      xLabelPadding: 3,
      xPadding: 5,
      label: ' 📈 Task Completion Timeline ',
      showLegend: true,
      wholeNumbersOnly: true,
      legend: {
        width: 12
      },
      border: {
        type: 'line',
        fg: 'cyan'
      }
    });

    // Bar chart for agent comparison
    this.barChart = grid.set(7, 6, 5, 6, contrib.bar, {
      label: ' 📊 Agent Performance ',
      barWidth: 8,
      barSpacing: 6,
      xOffset: 2,
      maxHeight: 10,
      border: {
        type: 'line',
        fg: 'green'
      }
    });

    this.initializeCharts();
  }

  /**
   * Initialize charts with default data
   */
  initializeCharts() {
    // Initialize line chart
    this.updateLineChart();

    // Initialize bar chart
    this.updateBarChart({
      coder: 0,
      tester: 0,
      stuck: 0
    });
  }

  /**
   * Update metrics from data
   */
  updateMetrics(file, data) {
    if (!data) return;

    // Process different types of metrics
    if (file.includes('tasks')) {
      this.updateTaskMetrics(data);
    } else if (file.includes('agents')) {
      this.updateAgentMetrics(data);
    } else if (file.includes('system')) {
      this.updateSystemMetrics(data);
    }

    this.render();
  }

  /**
   * Update task completion metrics
   */
  updateTaskMetrics(data) {
    const timestamp = new Date().toLocaleTimeString();

    this.metricsHistory.taskCompletion.push({
      time: timestamp,
      completed: data.completed || 0,
      failed: data.failed || 0,
      pending: data.pending || 0
    });

    // Keep last 20 data points
    if (this.metricsHistory.taskCompletion.length > 20) {
      this.metricsHistory.taskCompletion.shift();
    }

    this.updateLineChart();
  }

  /**
   * Update agent performance metrics
   */
  updateAgentMetrics(data) {
    if (data.agents) {
      this.updateBarChart(data.agents);
    }
  }

  /**
   * Update system load metrics
   */
  updateSystemMetrics(data) {
    this.metricsHistory.systemLoad.push({
      time: new Date().toLocaleTimeString(),
      cpu: data.cpu || 0,
      memory: data.memory || 0
    });

    // Keep last 20 data points
    if (this.metricsHistory.systemLoad.length > 20) {
      this.metricsHistory.systemLoad.shift();
    }
  }

  /**
   * Update line chart with task completion data
   */
  updateLineChart() {
    const history = this.metricsHistory.taskCompletion;

    if (history.length === 0) {
      // Show sample data
      this.lineChart.setData([
        {
          title: 'Completed',
          x: ['00:00', '00:01', '00:02', '00:03', '00:04'],
          y: [0, 0, 0, 0, 0],
          style: { line: 'green' }
        },
        {
          title: 'Failed',
          x: ['00:00', '00:01', '00:02', '00:03', '00:04'],
          y: [0, 0, 0, 0, 0],
          style: { line: 'red' }
        }
      ]);
    } else {
      const times = history.map(h => h.time);
      const completed = history.map(h => h.completed);
      const failed = history.map(h => h.failed);

      this.lineChart.setData([
        {
          title: 'Completed',
          x: times,
          y: completed,
          style: { line: 'green' }
        },
        {
          title: 'Failed',
          x: times,
          y: failed,
          style: { line: 'red' }
        }
      ]);
    }
  }

  /**
   * Update bar chart with agent performance data
   */
  updateBarChart(agents) {
    const titles = Object.keys(agents).map(k => k.toUpperCase());
    const data = Object.values(agents);

    this.barChart.setData({
      titles: titles,
      data: data
    });
  }

  /**
   * Render all charts
   */
  render() {
    this.screen.render();
  }

  /**
   * Simulate real-time data updates (for demo)
   */
  simulateData() {
    setInterval(() => {
      const randomAgent = ['coder', 'tester', 'stuck'][Math.floor(Math.random() * 3)];
      const agents = {
        coder: Math.floor(Math.random() * 10),
        tester: Math.floor(Math.random() * 10),
        stuck: Math.floor(Math.random() * 3)
      };

      this.updateAgentMetrics({ agents });

      this.updateTaskMetrics({
        completed: Math.floor(Math.random() * 20),
        failed: Math.floor(Math.random() * 5),
        pending: Math.floor(Math.random() * 10)
      });

      this.render();
    }, 5000);
  }
}

module.exports = MetricsChartWidget;
