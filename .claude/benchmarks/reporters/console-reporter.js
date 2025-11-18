const chalk = require('chalk');
const Table = require('cli-table3');
const cliProgress = require('cli-progress');

/**
 * Beautiful console reporter with colors and tables
 */
class ConsoleReporter {
  constructor(options = {}) {
    this.options = {
      colors: options.colors !== false,
      showProgress: options.showProgress !== false,
      verbose: options.verbose || false
    };
    this.progressBar = null;
  }

  /**
   * Start progress bar
   */
  startProgress(total) {
    if (!this.options.showProgress) return;

    this.progressBar = new cliProgress.SingleBar({
      format: chalk.cyan('{bar}') + ' | {percentage}% | {value}/{total} benchmarks',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });

    this.progressBar.start(total, 0);
  }

  /**
   * Update progress
   */
  updateProgress(current) {
    if (this.progressBar) {
      this.progressBar.update(current);
    }
  }

  /**
   * Stop progress bar
   */
  stopProgress() {
    if (this.progressBar) {
      this.progressBar.stop();
      this.progressBar = null;
    }
  }

  /**
   * Format duration in human-readable format
   */
  formatDuration(ms) {
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  /**
   * Format memory in human-readable format
   */
  formatMemory(bytes) {
    if (!bytes) return 'N/A';
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)}MB`;
  }

  /**
   * Get color for performance status
   */
  getStatusColor(percentChange) {
    if (percentChange > 10) return chalk.red;
    if (percentChange > 5) return chalk.yellow;
    if (percentChange < -10) return chalk.green;
    if (percentChange < -5) return chalk.cyan;
    return chalk.white;
  }

  /**
   * Report benchmark results
   */
  report(results) {
    console.log('\n' + chalk.bold.cyan('═══════════════════════════════════════════════════'));
    console.log(chalk.bold.cyan('           BENCHMARK RESULTS'));
    console.log(chalk.bold.cyan('═══════════════════════════════════════════════════\n'));

    if (results.systemInfo) {
      this.printSystemInfo(results.systemInfo);
    }

    this.printResults(results.results);

    console.log('\n' + chalk.bold.cyan('═══════════════════════════════════════════════════\n'));
  }

  /**
   * Print system information
   */
  printSystemInfo(systemInfo) {
    console.log(chalk.bold('System Information:'));
    console.log(chalk.gray('─'.repeat(60)));

    const table = new Table({
      chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
      },
      style: { head: ['cyan'] }
    });

    table.push(
      ['CPU', `${systemInfo.cpu.brand} (${systemInfo.cpu.cores} cores)`],
      ['Memory', `${this.formatMemory(systemInfo.memory.total)} total`],
      ['OS', `${systemInfo.os.platform} ${systemInfo.os.release}`],
      ['Load', `${systemInfo.load.currentLoad.toFixed(2)}%`]
    );

    console.log(table.toString());
    console.log();
  }

  /**
   * Print benchmark results table
   */
  printResults(results) {
    console.log(chalk.bold('Benchmark Results:'));
    console.log(chalk.gray('─'.repeat(60)));

    const table = new Table({
      head: [
        chalk.cyan('Benchmark'),
        chalk.cyan('Mean'),
        chalk.cyan('Median'),
        chalk.cyan('Min'),
        chalk.cyan('Max'),
        chalk.cyan('P95'),
        chalk.cyan('StdDev'),
        chalk.cyan('Iterations')
      ],
      colWidths: [30, 12, 12, 12, 12, 12, 12, 12],
      style: { head: ['cyan'] }
    });

    results.forEach(result => {
      if (result.failed) {
        table.push([
          chalk.red(result.name),
          chalk.red('FAILED'),
          '-', '-', '-', '-', '-', '-'
        ]);
        return;
      }

      const stats = result.statistics;
      const iterations = result.iterations;

      table.push([
        result.name,
        this.formatDuration(stats.mean),
        this.formatDuration(stats.median),
        this.formatDuration(stats.min),
        this.formatDuration(stats.max),
        this.formatDuration(stats.p95),
        this.formatDuration(stats.stdDev),
        `${iterations.successful}/${iterations.total}`
      ]);
    });

    console.log(table.toString());
  }

  /**
   * Report comparison with baseline
   */
  reportComparison(comparisons) {
    console.log('\n' + chalk.bold.yellow('Baseline Comparison:'));
    console.log(chalk.gray('─'.repeat(60)));

    const table = new Table({
      head: [
        chalk.cyan('Benchmark'),
        chalk.cyan('Current'),
        chalk.cyan('Baseline'),
        chalk.cyan('Change'),
        chalk.cyan('Status')
      ],
      colWidths: [30, 15, 15, 15, 15],
      style: { head: ['cyan'] }
    });

    comparisons.forEach(comp => {
      if (comp.status === 'new') {
        table.push([
          comp.name,
          this.formatDuration(comp.current.mean),
          chalk.gray('N/A'),
          chalk.gray('N/A'),
          chalk.blue('NEW')
        ]);
        return;
      }

      const colorFn = this.getStatusColor(comp.percentChange);
      const changeStr = `${comp.percentChange > 0 ? '+' : ''}${comp.percentChange.toFixed(2)}%`;

      table.push([
        comp.name,
        this.formatDuration(comp.current.mean),
        this.formatDuration(comp.baseline.mean),
        colorFn(changeStr),
        colorFn(comp.status.toUpperCase())
      ]);
    });

    console.log(table.toString());
  }

  /**
   * Report summary
   */
  reportSummary(results) {
    const total = results.length;
    const successful = results.filter(r => !r.failed).length;
    const failed = total - successful;

    console.log('\n' + chalk.bold('Summary:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(`Total benchmarks: ${chalk.bold(total)}`);
    console.log(`Successful: ${chalk.green(successful)}`);
    if (failed > 0) {
      console.log(`Failed: ${chalk.red(failed)}`);
    }
  }
}

module.exports = ConsoleReporter;
