const fs = require('fs').promises;
const path = require('path');

/**
 * HTML reporter with interactive charts and beautiful formatting
 */
class HTMLReporter {
  constructor(options = {}) {
    this.options = {
      outputPath: options.outputPath || './results/benchmark-report.html',
      includeCharts: options.includeCharts !== false,
      title: options.title || 'Agent Benchmark Results',
      ...options
    };
  }

  /**
   * Report benchmark results as HTML
   */
  async report(results) {
    const html = this.generateHTML(results);

    // Ensure directory exists
    const dir = path.dirname(this.options.outputPath);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(this.options.outputPath, html);

    console.log(`\n🌐 HTML report saved to: ${this.options.outputPath}`);
  }

  /**
   * Generate complete HTML report
   */
  generateHTML(results) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.options.title}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        ${this.getStyles()}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 ${this.options.title}</h1>
            <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
        </header>

        ${this.generateSystemInfo(results.systemInfo)}
        ${this.generateSummary(results.results)}
        ${this.generateCharts(results.results)}
        ${this.generateResultsTable(results.results)}
        ${this.generateDetailedResults(results.results)}
    </div>

    <script>
        ${this.getScripts(results.results)}
    </script>
</body>
</html>`;
  }

  /**
   * Get CSS styles
   */
  getStyles() {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .timestamp {
            opacity: 0.9;
            font-size: 0.9em;
        }

        .section {
            padding: 30px 40px;
            border-bottom: 1px solid #eee;
        }

        .section:last-child {
            border-bottom: none;
        }

        .section h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8em;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .info-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .info-card h3 {
            color: #667eea;
            font-size: 0.9em;
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .info-card p {
            color: #333;
            font-size: 1.2em;
            font-weight: 600;
        }

        .chart-container {
            position: relative;
            height: 400px;
            margin: 30px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background: #667eea;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
        }

        tr:hover {
            background: #f8f9fa;
        }

        .status-success {
            color: #28a745;
            font-weight: 600;
        }

        .status-failed {
            color: #dc3545;
            font-weight: 600;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 15px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-label {
            font-size: 0.85em;
            color: #666;
            margin-bottom: 5px;
        }

        .stat-value {
            font-size: 1.3em;
            font-weight: 600;
            color: #333;
        }

        .benchmark-detail {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .benchmark-detail h3 {
            color: #333;
            margin-bottom: 15px;
        }

        @media print {
            body {
                background: white;
            }

            .container {
                box-shadow: none;
            }
        }
    `;
  }

  /**
   * Generate system info section
   */
  generateSystemInfo(systemInfo) {
    if (!systemInfo) return '';

    return `
        <section class="section">
            <h2>🖥️ System Information</h2>
            <div class="info-grid">
                <div class="info-card">
                    <h3>CPU</h3>
                    <p>${systemInfo.cpu.brand}</p>
                    <small>${systemInfo.cpu.cores} cores @ ${systemInfo.cpu.speed}GHz</small>
                </div>
                <div class="info-card">
                    <h3>Memory</h3>
                    <p>${this.formatMemory(systemInfo.memory.total)}</p>
                    <small>${this.formatMemory(systemInfo.memory.free)} free</small>
                </div>
                <div class="info-card">
                    <h3>Operating System</h3>
                    <p>${systemInfo.os.platform}</p>
                    <small>${systemInfo.os.distro} ${systemInfo.os.release}</small>
                </div>
                <div class="info-card">
                    <h3>CPU Load</h3>
                    <p>${systemInfo.load.currentLoad.toFixed(2)}%</p>
                    <small>Average load</small>
                </div>
            </div>
        </section>
    `;
  }

  /**
   * Generate summary section
   */
  generateSummary(results) {
    const total = results.length;
    const successful = results.filter(r => !r.failed).length;
    const failed = total - successful;

    const avgMean = successful > 0
      ? results.filter(r => !r.failed).reduce((sum, r) => sum + r.statistics.mean, 0) / successful
      : 0;

    return `
        <section class="section">
            <h2>📈 Summary</h2>
            <div class="info-grid">
                <div class="info-card">
                    <h3>Total Benchmarks</h3>
                    <p>${total}</p>
                </div>
                <div class="info-card">
                    <h3>Successful</h3>
                    <p class="status-success">${successful}</p>
                </div>
                ${failed > 0 ? `
                <div class="info-card">
                    <h3>Failed</h3>
                    <p class="status-failed">${failed}</p>
                </div>
                ` : ''}
                <div class="info-card">
                    <h3>Average Duration</h3>
                    <p>${this.formatDuration(avgMean)}</p>
                </div>
            </div>
        </section>
    `;
  }

  /**
   * Generate charts section
   */
  generateCharts(results) {
    if (!this.options.includeCharts) return '';

    return `
        <section class="section">
            <h2>📊 Performance Charts</h2>
            <div class="chart-container">
                <canvas id="meanChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="distributionChart"></canvas>
            </div>
        </section>
    `;
  }

  /**
   * Generate results table
   */
  generateResultsTable(results) {
    const rows = results.map(r => {
      if (r.failed) {
        return `
          <tr>
            <td>${r.name}</td>
            <td colspan="6" class="status-failed">FAILED: ${r.error}</td>
          </tr>
        `;
      }

      const stats = r.statistics;
      return `
        <tr>
          <td>${r.name}</td>
          <td>${this.formatDuration(stats.mean)}</td>
          <td>${this.formatDuration(stats.median)}</td>
          <td>${this.formatDuration(stats.min)}</td>
          <td>${this.formatDuration(stats.max)}</td>
          <td>${this.formatDuration(stats.p95)}</td>
          <td>${r.iterations.successful}/${r.iterations.total}</td>
        </tr>
      `;
    }).join('');

    return `
        <section class="section">
            <h2>📋 Results Table</h2>
            <table>
                <thead>
                    <tr>
                        <th>Benchmark</th>
                        <th>Mean</th>
                        <th>Median</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>P95</th>
                        <th>Iterations</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </section>
    `;
  }

  /**
   * Generate detailed results section
   */
  generateDetailedResults(results) {
    const details = results.filter(r => !r.failed).map(r => {
      const stats = r.statistics;
      return `
        <div class="benchmark-detail">
            <h3>${r.name}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">Mean</div>
                    <div class="stat-value">${this.formatDuration(stats.mean)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Median</div>
                    <div class="stat-value">${this.formatDuration(stats.median)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Min</div>
                    <div class="stat-value">${this.formatDuration(stats.min)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Max</div>
                    <div class="stat-value">${this.formatDuration(stats.max)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Std Dev</div>
                    <div class="stat-value">${this.formatDuration(stats.stdDev)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">P95</div>
                    <div class="stat-value">${this.formatDuration(stats.p95)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">P99</div>
                    <div class="stat-value">${this.formatDuration(stats.p99)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">CV</div>
                    <div class="stat-value">${stats.coefficientOfVariation.toFixed(2)}%</div>
                </div>
            </div>
        </div>
      `;
    }).join('');

    return `
        <section class="section">
            <h2>🔍 Detailed Results</h2>
            ${details}
        </section>
    `;
  }

  /**
   * Get JavaScript for charts
   */
  getScripts(results) {
    const successfulResults = results.filter(r => !r.failed);

    const labels = successfulResults.map(r => r.name);
    const meanData = successfulResults.map(r => r.statistics.mean);
    const p95Data = successfulResults.map(r => r.statistics.p95);

    return `
      // Mean comparison chart
      const meanCtx = document.getElementById('meanChart');
      if (meanCtx) {
        new Chart(meanCtx, {
          type: 'bar',
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [
              {
                label: 'Mean Duration (ms)',
                data: ${JSON.stringify(meanData)},
                backgroundColor: 'rgba(102, 126, 234, 0.7)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
              },
              {
                label: 'P95 Duration (ms)',
                data: ${JSON.stringify(p95Data)},
                backgroundColor: 'rgba(118, 75, 162, 0.7)',
                borderColor: 'rgba(118, 75, 162, 1)',
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Mean vs P95 Duration',
                font: { size: 16 }
              },
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Duration (ms)'
                }
              }
            }
          }
        });
      }

      // Distribution chart
      const distCtx = document.getElementById('distributionChart');
      if (distCtx) {
        const boxPlotData = ${JSON.stringify(successfulResults.map(r => ({
          label: r.name,
          min: r.statistics.min,
          q1: r.statistics.median - (r.statistics.median - r.statistics.min) / 2,
          median: r.statistics.median,
          q3: r.statistics.median + (r.statistics.max - r.statistics.median) / 2,
          max: r.statistics.max
        })))};

        new Chart(distCtx, {
          type: 'bar',
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [
              {
                label: 'Min',
                data: boxPlotData.map(d => d.min),
                backgroundColor: 'rgba(40, 167, 69, 0.7)'
              },
              {
                label: 'Median',
                data: boxPlotData.map(d => d.median),
                backgroundColor: 'rgba(102, 126, 234, 0.7)'
              },
              {
                label: 'Max',
                data: boxPlotData.map(d => d.max),
                backgroundColor: 'rgba(220, 53, 69, 0.7)'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Duration Distribution (Min/Median/Max)',
                font: { size: 16 }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Duration (ms)'
                }
              }
            }
          }
        });
      }
    `;
  }

  /**
   * Format duration
   */
  formatDuration(ms) {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  /**
   * Format memory
   */
  formatMemory(bytes) {
    const gb = bytes / 1024 / 1024 / 1024;
    if (gb >= 1) return `${gb.toFixed(2)}GB`;
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)}MB`;
  }
}

module.exports = HTMLReporter;
