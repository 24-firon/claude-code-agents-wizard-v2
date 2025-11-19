const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table3');

/**
 * Benchmark comparison tool
 */
class BenchmarkComparer {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Load benchmark results from file
   */
  async loadResults(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load results from ${filePath}: ${error.message}`);
    }
  }

  /**
   * Compare two benchmark runs
   */
  compare(baseline, current) {
    const comparisons = [];

    // Create a map of baseline results by name
    const baselineMap = new Map();
    if (baseline.results) {
      baseline.results.forEach(result => {
        baselineMap.set(result.name, result);
      });
    }

    // Compare each current result with baseline
    const currentResults = current.results || [];

    currentResults.forEach(currentResult => {
      if (currentResult.failed) {
        comparisons.push({
          name: currentResult.name,
          status: 'failed',
          current: null,
          baseline: null
        });
        return;
      }

      const baselineResult = baselineMap.get(currentResult.name);

      if (!baselineResult) {
        comparisons.push({
          name: currentResult.name,
          status: 'new',
          current: currentResult.statistics,
          baseline: null
        });
        return;
      }

      if (baselineResult.failed) {
        comparisons.push({
          name: currentResult.name,
          status: 'improved',
          current: currentResult.statistics,
          baseline: null,
          message: 'Previously failed, now passing'
        });
        return;
      }

      const currentMean = currentResult.statistics.mean;
      const baselineMean = baselineResult.statistics.mean;
      const difference = currentMean - baselineMean;
      const percentChange = (difference / baselineMean) * 100;

      let status = 'unchanged';
      if (Math.abs(percentChange) > 10) {
        status = percentChange > 0 ? 'regression' : 'improvement';
      } else if (Math.abs(percentChange) > 5) {
        status = percentChange > 0 ? 'slower' : 'faster';
      }

      comparisons.push({
        name: currentResult.name,
        status,
        current: currentResult.statistics,
        baseline: baselineResult.statistics,
        difference,
        percentChange
      });
    });

    // Check for removed benchmarks
    if (baseline.results) {
      const currentNames = new Set(currentResults.map(r => r.name));
      baseline.results.forEach(baselineResult => {
        if (!currentNames.has(baselineResult.name)) {
          comparisons.push({
            name: baselineResult.name,
            status: 'removed',
            current: null,
            baseline: baselineResult.failed ? null : baselineResult.statistics
          });
        }
      });
    }

    return comparisons;
  }

  /**
   * Detect regressions based on threshold
   */
  detectRegressions(comparisons, threshold = 10) {
    return comparisons.filter(comp =>
      comp.status === 'regression' ||
      (comp.percentChange && comp.percentChange > threshold)
    );
  }

  /**
   * Print comparison table
   */
  printComparison(comparisons) {
    console.log('\n' + chalk.bold.cyan('═══════════════════════════════════════════════════'));
    console.log(chalk.bold.cyan('           BENCHMARK COMPARISON'));
    console.log(chalk.bold.cyan('═══════════════════════════════════════════════════\n'));

    const table = new Table({
      head: [
        chalk.cyan('Benchmark'),
        chalk.cyan('Baseline'),
        chalk.cyan('Current'),
        chalk.cyan('Change'),
        chalk.cyan('Status')
      ],
      colWidths: [35, 15, 15, 15, 20]
    });

    comparisons.forEach(comp => {
      let baselineStr = 'N/A';
      let currentStr = 'N/A';
      let changeStr = 'N/A';
      let statusStr = comp.status.toUpperCase();
      let statusColor = chalk.white;

      if (comp.status === 'failed') {
        statusColor = chalk.red;
        currentStr = chalk.red('FAILED');
      } else if (comp.status === 'new') {
        statusColor = chalk.blue;
        currentStr = this.formatDuration(comp.current.mean);
      } else if (comp.status === 'removed') {
        statusColor = chalk.gray;
        baselineStr = this.formatDuration(comp.baseline?.mean || 0);
      } else if (comp.baseline && comp.current) {
        baselineStr = this.formatDuration(comp.baseline.mean);
        currentStr = this.formatDuration(comp.current.mean);

        if (comp.percentChange !== undefined) {
          const sign = comp.percentChange > 0 ? '+' : '';
          changeStr = `${sign}${comp.percentChange.toFixed(2)}%`;

          if (comp.status === 'regression') {
            statusColor = chalk.red;
          } else if (comp.status === 'slower') {
            statusColor = chalk.yellow;
          } else if (comp.status === 'improvement') {
            statusColor = chalk.green;
          } else if (comp.status === 'faster') {
            statusColor = chalk.cyan;
          }
        }
      }

      table.push([
        comp.name,
        baselineStr,
        currentStr,
        changeStr,
        statusColor(statusStr)
      ]);
    });

    console.log(table.toString());
  }

  /**
   * Print summary
   */
  printSummary(comparisons) {
    console.log('\n' + chalk.bold('Summary:'));
    console.log(chalk.gray('─'.repeat(60)));

    const stats = {
      total: comparisons.length,
      improved: comparisons.filter(c => c.status === 'improvement' || c.status === 'faster').length,
      regressed: comparisons.filter(c => c.status === 'regression' || c.status === 'slower').length,
      unchanged: comparisons.filter(c => c.status === 'unchanged').length,
      new: comparisons.filter(c => c.status === 'new').length,
      removed: comparisons.filter(c => c.status === 'removed').length,
      failed: comparisons.filter(c => c.status === 'failed').length
    };

    console.log(`Total benchmarks: ${chalk.bold(stats.total)}`);
    if (stats.improved > 0) {
      console.log(`Improved: ${chalk.green(stats.improved)}`);
    }
    if (stats.regressed > 0) {
      console.log(`Regressed: ${chalk.red(stats.regressed)}`);
    }
    if (stats.unchanged > 0) {
      console.log(`Unchanged: ${chalk.white(stats.unchanged)}`);
    }
    if (stats.new > 0) {
      console.log(`New: ${chalk.blue(stats.new)}`);
    }
    if (stats.removed > 0) {
      console.log(`Removed: ${chalk.gray(stats.removed)}`);
    }
    if (stats.failed > 0) {
      console.log(`Failed: ${chalk.red(stats.failed)}`);
    }

    return stats;
  }

  /**
   * Compare multiple runs
   */
  async compareMultiple(filePaths) {
    const results = await Promise.all(
      filePaths.map(fp => this.loadResults(fp))
    );

    console.log('\n' + chalk.bold.cyan('Multiple Run Comparison'));
    console.log(chalk.gray('─'.repeat(60)));

    // Extract benchmark names
    const benchmarkNames = new Set();
    results.forEach(result => {
      if (result.results) {
        result.results.forEach(r => benchmarkNames.add(r.name));
      }
    });

    // Create comparison table
    const table = new Table({
      head: [
        chalk.cyan('Benchmark'),
        ...filePaths.map((fp, i) => chalk.cyan(`Run ${i + 1}`))
      ]
    });

    benchmarkNames.forEach(name => {
      const row = [name];

      results.forEach(result => {
        const benchmark = result.results?.find(r => r.name === name);
        if (benchmark && !benchmark.failed) {
          row.push(this.formatDuration(benchmark.statistics.mean));
        } else {
          row.push(chalk.gray('N/A'));
        }
      });

      table.push(row);
    });

    console.log(table.toString());
  }

  /**
   * Format duration
   */
  formatDuration(ms) {
    if (!ms) return 'N/A';
    if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  /**
   * Save comparison results
   */
  async saveComparison(comparisons, outputPath) {
    const output = {
      timestamp: new Date().toISOString(),
      comparisons,
      summary: {
        total: comparisons.length,
        improved: comparisons.filter(c => c.status === 'improvement' || c.status === 'faster').length,
        regressed: comparisons.filter(c => c.status === 'regression' || c.status === 'slower').length
      }
    };

    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n💾 Comparison saved to: ${outputPath}`);
  }
}

// CLI usage
if (require.main === module) {
  const comparer = new BenchmarkComparer();

  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node compare.js <baseline-file> <current-file> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --threshold <number>  Regression threshold percentage (default: 10)');
    console.log('  --output <file>       Save comparison results to file');
    console.log('  --multiple           Compare multiple runs');
    process.exit(1);
  }

  const baselineFile = args[0];
  const currentFile = args[1];
  const threshold = parseFloat(args[args.indexOf('--threshold') + 1] || 10);
  const outputFile = args[args.indexOf('--output') + 1];
  const multipleMode = args.includes('--multiple');

  (async () => {
    try {
      if (multipleMode) {
        await comparer.compareMultiple(args.filter(arg => !arg.startsWith('--')));
      } else {
        const baseline = await comparer.loadResults(baselineFile);
        const current = await comparer.loadResults(currentFile);

        const comparisons = comparer.compare(baseline, current);
        comparer.printComparison(comparisons);
        const summary = comparer.printSummary(comparisons);

        if (outputFile) {
          await comparer.saveComparison(comparisons, outputFile);
        }

        // Detect regressions
        const regressions = comparer.detectRegressions(comparisons, threshold);
        if (regressions.length > 0) {
          console.log('\n' + chalk.red.bold(`⚠️  ${regressions.length} regression(s) detected!`));
          process.exit(1);
        } else {
          console.log('\n' + chalk.green('✓ No regressions detected'));
        }
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  })();
}

module.exports = BenchmarkComparer;
