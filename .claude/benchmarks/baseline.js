const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

/**
 * Baseline management tool for benchmark results
 */
class BaselineManager {
  constructor(options = {}) {
    this.baselinePath = options.baselinePath || './baseline/baseline.json';
    this.historyPath = options.historyPath || './baseline/history.json';
  }

  /**
   * Save results as baseline
   */
  async saveBaseline(resultsPath, options = {}) {
    try {
      // Load results
      const data = await fs.readFile(resultsPath, 'utf8');
      const results = JSON.parse(data);

      // Ensure baseline directory exists
      const baselineDir = path.dirname(this.baselinePath);
      await fs.mkdir(baselineDir, { recursive: true });

      // Create baseline object
      const baseline = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        source: resultsPath,
        results: results.results || [],
        systemInfo: results.systemInfo,
        metadata: {
          description: options.description || 'Baseline benchmark results',
          tags: options.tags || [],
          branch: options.branch,
          commit: options.commit
        }
      };

      // Save baseline
      await fs.writeFile(
        this.baselinePath,
        JSON.stringify(baseline, null, 2)
      );

      console.log(chalk.green('✓'), `Baseline saved to: ${this.baselinePath}`);
      console.log(chalk.gray(`  Benchmarks: ${baseline.results.length}`));
      console.log(chalk.gray(`  Created: ${baseline.createdAt}`));

      // Update history
      await this.addToHistory(baseline);

      return baseline;
    } catch (error) {
      throw new Error(`Failed to save baseline: ${error.message}`);
    }
  }

  /**
   * Load baseline
   */
  async loadBaseline() {
    try {
      const data = await fs.readFile(this.baselinePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw new Error(`Failed to load baseline: ${error.message}`);
    }
  }

  /**
   * Update existing baseline
   */
  async updateBaseline(resultsPath, options = {}) {
    const existing = await this.loadBaseline();

    if (!existing && !options.force) {
      throw new Error('No existing baseline found. Use --force to create new baseline.');
    }

    return this.saveBaseline(resultsPath, {
      ...options,
      description: options.description || 'Updated baseline'
    });
  }

  /**
   * Add baseline to history
   */
  async addToHistory(baseline) {
    try {
      let history = [];

      // Load existing history
      try {
        const data = await fs.readFile(this.historyPath, 'utf8');
        history = JSON.parse(data);
      } catch (error) {
        // No history file, start fresh
      }

      // Add new baseline to history
      history.push({
        timestamp: baseline.createdAt,
        benchmarkCount: baseline.results.length,
        systemInfo: baseline.systemInfo,
        metadata: baseline.metadata,
        summary: this.generateSummary(baseline.results)
      });

      // Keep only last 50 entries
      if (history.length > 50) {
        history = history.slice(-50);
      }

      // Save updated history
      await fs.writeFile(
        this.historyPath,
        JSON.stringify(history, null, 2)
      );

      console.log(chalk.gray(`  History updated: ${this.historyPath}`));
    } catch (error) {
      console.warn(chalk.yellow('Warning:'), `Failed to update history: ${error.message}`);
    }
  }

  /**
   * Show baseline info
   */
  async showBaseline() {
    const baseline = await this.loadBaseline();

    if (!baseline) {
      console.log(chalk.yellow('No baseline found'));
      return;
    }

    console.log('\n' + chalk.bold.cyan('Baseline Information'));
    console.log(chalk.gray('─'.repeat(60)));

    console.log(`Created: ${chalk.white(baseline.createdAt)}`);
    console.log(`Version: ${chalk.white(baseline.version)}`);
    console.log(`Benchmarks: ${chalk.white(baseline.results.length)}`);

    if (baseline.metadata) {
      console.log(`\nMetadata:`);
      if (baseline.metadata.description) {
        console.log(`  Description: ${baseline.metadata.description}`);
      }
      if (baseline.metadata.branch) {
        console.log(`  Branch: ${baseline.metadata.branch}`);
      }
      if (baseline.metadata.commit) {
        console.log(`  Commit: ${baseline.metadata.commit}`);
      }
      if (baseline.metadata.tags && baseline.metadata.tags.length > 0) {
        console.log(`  Tags: ${baseline.metadata.tags.join(', ')}`);
      }
    }

    if (baseline.systemInfo) {
      console.log(`\nSystem Info:`);
      console.log(`  CPU: ${baseline.systemInfo.cpu.brand}`);
      console.log(`  Memory: ${this.formatMemory(baseline.systemInfo.memory.total)}`);
      console.log(`  OS: ${baseline.systemInfo.os.platform} ${baseline.systemInfo.os.release}`);
    }

    const summary = this.generateSummary(baseline.results);
    console.log(`\nPerformance Summary:`);
    console.log(`  Mean duration: ${this.formatDuration(summary.avgMean)}`);
    console.log(`  Fastest: ${summary.fastest.name} (${this.formatDuration(summary.fastest.mean)})`);
    console.log(`  Slowest: ${summary.slowest.name} (${this.formatDuration(summary.slowest.mean)})`);

    console.log('');
  }

  /**
   * Show baseline history
   */
  async showHistory(limit = 10) {
    try {
      const data = await fs.readFile(this.historyPath, 'utf8');
      const history = JSON.parse(data);

      console.log('\n' + chalk.bold.cyan('Baseline History'));
      console.log(chalk.gray('─'.repeat(60)));

      const recent = history.slice(-limit).reverse();

      recent.forEach((entry, index) => {
        console.log(`\n${chalk.bold(`${index + 1}.`)} ${entry.timestamp}`);
        console.log(`   Benchmarks: ${entry.benchmarkCount}`);
        if (entry.metadata?.description) {
          console.log(`   Description: ${entry.metadata.description}`);
        }
        if (entry.summary) {
          console.log(`   Avg duration: ${this.formatDuration(entry.summary.avgMean)}`);
        }
      });

      console.log('');
    } catch (error) {
      console.log(chalk.yellow('No history found'));
    }
  }

  /**
   * Delete baseline
   */
  async deleteBaseline(options = {}) {
    if (!options.confirm) {
      console.log(chalk.yellow('⚠️  This will delete the current baseline.'));
      console.log(chalk.yellow('   Use --confirm to proceed.'));
      return;
    }

    try {
      await fs.unlink(this.baselinePath);
      console.log(chalk.green('✓'), 'Baseline deleted');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(chalk.yellow('No baseline to delete'));
      } else {
        throw error;
      }
    }
  }

  /**
   * Generate summary statistics
   */
  generateSummary(results) {
    const successful = results.filter(r => !r.failed);

    if (successful.length === 0) {
      return {
        avgMean: 0,
        fastest: { name: 'N/A', mean: 0 },
        slowest: { name: 'N/A', mean: 0 }
      };
    }

    const means = successful.map(r => r.statistics.mean);
    const avgMean = means.reduce((a, b) => a + b, 0) / means.length;

    const fastest = successful.reduce((min, r) =>
      r.statistics.mean < min.statistics.mean ? r : min
    );

    const slowest = successful.reduce((max, r) =>
      r.statistics.mean > max.statistics.mean ? r : max
    );

    return {
      avgMean,
      fastest: { name: fastest.name, mean: fastest.statistics.mean },
      slowest: { name: slowest.name, mean: slowest.statistics.mean }
    };
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
   * Format memory
   */
  formatMemory(bytes) {
    const gb = bytes / 1024 / 1024 / 1024;
    if (gb >= 1) return `${gb.toFixed(2)}GB`;
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)}MB`;
  }
}

// CLI usage
if (require.main === module) {
  const manager = new BaselineManager();

  const args = process.argv.slice(2);
  const command = args[0];

  const options = {
    force: args.includes('--force'),
    confirm: args.includes('--confirm'),
    description: args[args.indexOf('--description') + 1],
    branch: args[args.indexOf('--branch') + 1],
    commit: args[args.indexOf('--commit') + 1],
    tags: args.includes('--tags') ? args[args.indexOf('--tags') + 1].split(',') : []
  };

  (async () => {
    try {
      switch (command) {
        case 'save':
          if (args.length < 2) {
            console.log('Usage: node baseline.js save <results-file> [options]');
            console.log('');
            console.log('Options:');
            console.log('  --description <text>  Baseline description');
            console.log('  --branch <name>       Git branch name');
            console.log('  --commit <hash>       Git commit hash');
            console.log('  --tags <tag1,tag2>    Comma-separated tags');
            process.exit(1);
          }
          await manager.saveBaseline(args[1], options);
          break;

        case 'update':
          if (args.length < 2) {
            console.log('Usage: node baseline.js update <results-file> [--force]');
            process.exit(1);
          }
          await manager.updateBaseline(args[1], options);
          break;

        case 'show':
          await manager.showBaseline();
          break;

        case 'history':
          const limit = parseInt(args[1]) || 10;
          await manager.showHistory(limit);
          break;

        case 'delete':
          await manager.deleteBaseline(options);
          break;

        default:
          console.log('Usage: node baseline.js <command> [options]');
          console.log('');
          console.log('Commands:');
          console.log('  save <file>       Save benchmark results as baseline');
          console.log('  update <file>     Update existing baseline');
          console.log('  show              Show current baseline info');
          console.log('  history [limit]   Show baseline history');
          console.log('  delete --confirm  Delete current baseline');
          process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  })();
}

module.exports = BaselineManager;
