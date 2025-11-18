#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');
const BenchmarkRunner = require('./runner');
const ConsoleReporter = require('./reporters/console-reporter');
const JSONReporter = require('./reporters/json-reporter');
const HTMLReporter = require('./reporters/html-reporter');
const BenchmarkComparer = require('./compare');
const BaselineManager = require('./baseline');

const program = new Command();

/**
 * Load configuration
 */
async function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn(chalk.yellow('Warning: Could not load config.json, using defaults'));
    return {};
  }
}

/**
 * Load benchmark suite
 */
async function loadBenchmark(filePath) {
  const absolutePath = path.resolve(filePath);
  try {
    const suite = require(absolutePath);
    return suite;
  } catch (error) {
    throw new Error(`Failed to load benchmark: ${filePath}\n${error.message}`);
  }
}

/**
 * Discover all benchmark files
 */
async function discoverBenchmarks() {
  const benchmarksDir = path.join(__dirname, 'benchmarks');
  try {
    const files = await fs.readdir(benchmarksDir);
    return files
      .filter(f => f.endsWith('.bench.js'))
      .map(f => path.join(benchmarksDir, f));
  } catch (error) {
    return [];
  }
}

/**
 * Run benchmarks command
 */
program
  .command('run [files...]')
  .description('Run benchmark suites')
  .option('-a, --all', 'Run all benchmarks')
  .option('-i, --iterations <number>', 'Number of iterations', parseInt)
  .option('-w, --warmup <number>', 'Number of warmup rounds', parseInt)
  .option('--no-console', 'Disable console reporter')
  .option('--no-json', 'Disable JSON reporter')
  .option('--no-html', 'Disable HTML reporter')
  .option('--output <path>', 'Output directory for results')
  .option('--compare-baseline', 'Compare results with baseline')
  .option('--ci', 'CI mode (fail on regression)')
  .action(async (files, options) => {
    try {
      const config = await loadConfig();

      // Determine which benchmarks to run
      let benchmarkFiles = files;
      if (options.all || files.length === 0) {
        benchmarkFiles = await discoverBenchmarks();
        if (benchmarkFiles.length === 0) {
          console.error(chalk.red('No benchmark files found'));
          process.exit(1);
        }
      }

      console.log(chalk.bold.cyan('\n🚀 Running Benchmarks\n'));
      console.log(chalk.gray(`Benchmark files: ${benchmarkFiles.length}`));
      console.log(chalk.gray(`Iterations: ${options.iterations || config.iterations || 10}`));
      console.log(chalk.gray(`Warmup rounds: ${options.warmup || config.warmupRounds || 3}\n`));

      // Create runner
      const runner = new BenchmarkRunner({
        iterations: options.iterations || config.iterations,
        warmupRounds: options.warmup || config.warmupRounds,
        timeout: config.timeout,
        collectSystemMetrics: config.system?.collectCpuUsage !== false
      });

      // Load and run all suites
      const allResults = [];

      for (const file of benchmarkFiles) {
        console.log(chalk.bold(`\n📦 Loading: ${path.basename(file)}`));

        const suite = await loadBenchmark(file);
        const results = await runner.runSuite(suite);

        allResults.push(...results.benchmarks);
      }

      const finalResults = runner.getResults();

      // Report results
      if (options.console !== false && config.reporters?.console?.enabled !== false) {
        const consoleReporter = new ConsoleReporter({
          colors: config.reporters?.console?.colors,
          showProgress: config.reporters?.console?.showProgress
        });
        consoleReporter.report(finalResults);
        consoleReporter.reportSummary(finalResults.results);
      }

      // Save results
      const outputDir = options.output || './results';
      await fs.mkdir(outputDir, { recursive: true });

      if (options.json !== false && config.reporters?.json?.enabled !== false) {
        const jsonReporter = new JSONReporter({
          outputPath: path.join(outputDir, 'benchmark-results.json')
        });
        await jsonReporter.report(finalResults);

        // Append to history
        await jsonReporter.appendToHistory(
          finalResults,
          path.join(outputDir, 'history.json')
        );
      }

      if (options.html !== false && config.reporters?.html?.enabled !== false) {
        const htmlReporter = new HTMLReporter({
          outputPath: path.join(outputDir, 'benchmark-report.html')
        });
        await htmlReporter.report(finalResults);
      }

      // Compare with baseline if requested
      if (options.compareBaseline) {
        const baselineManager = new BaselineManager();
        const baseline = await baselineManager.loadBaseline();

        if (baseline) {
          const comparer = new BenchmarkComparer();
          const comparisons = comparer.compare(baseline, finalResults);

          console.log('');
          comparer.printComparison(comparisons);

          // Check for regressions in CI mode
          if (options.ci) {
            const threshold = config.ci?.regressionThreshold || 0.1;
            const regressions = comparer.detectRegressions(
              comparisons,
              threshold * 100
            );

            if (regressions.length > 0) {
              console.log(chalk.red.bold(`\n❌ ${regressions.length} regression(s) detected!`));
              process.exit(config.ci?.exitCode || 1);
            } else {
              console.log(chalk.green.bold('\n✓ No regressions detected'));
            }
          }
        } else {
          console.log(chalk.yellow('\n⚠️  No baseline found for comparison'));
        }
      }

      console.log(chalk.green.bold('\n✓ Benchmarks complete!\n'));
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

/**
 * Baseline commands
 */
program
  .command('baseline <action>')
  .description('Manage baseline (save, show, delete)')
  .argument('<action>', 'Action to perform (save, show, delete)')
  .argument('[file]', 'Results file (for save action)')
  .option('--confirm', 'Confirm deletion')
  .option('--description <text>', 'Baseline description')
  .option('--branch <name>', 'Git branch name')
  .option('--commit <hash>', 'Git commit hash')
  .action(async (action, file, options) => {
    const manager = new BaselineManager();

    try {
      switch (action) {
        case 'save':
          if (!file) {
            console.error(chalk.red('Results file required for save action'));
            process.exit(1);
          }
          await manager.saveBaseline(file, options);
          break;

        case 'show':
          await manager.showBaseline();
          break;

        case 'delete':
          await manager.deleteBaseline(options);
          break;

        case 'history':
          await manager.showHistory();
          break;

        default:
          console.error(chalk.red(`Unknown action: ${action}`));
          console.log('Available actions: save, show, delete, history');
          process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Compare command
 */
program
  .command('compare <baseline> <current>')
  .description('Compare two benchmark results')
  .option('--threshold <number>', 'Regression threshold percentage', parseFloat)
  .option('--output <file>', 'Save comparison results')
  .action(async (baseline, current, options) => {
    try {
      const comparer = new BenchmarkComparer();

      const baselineResults = await comparer.loadResults(baseline);
      const currentResults = await comparer.loadResults(current);

      const comparisons = comparer.compare(baselineResults, currentResults);

      comparer.printComparison(comparisons);
      comparer.printSummary(comparisons);

      if (options.output) {
        await comparer.saveComparison(comparisons, options.output);
      }

      const threshold = options.threshold || 10;
      const regressions = comparer.detectRegressions(comparisons, threshold);

      if (regressions.length > 0) {
        console.log(chalk.red.bold(`\n⚠️  ${regressions.length} regression(s) detected!`));
        process.exit(1);
      } else {
        console.log(chalk.green('\n✓ No regressions detected'));
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * List command
 */
program
  .command('list')
  .description('List available benchmarks')
  .action(async () => {
    try {
      const benchmarks = await discoverBenchmarks();

      console.log(chalk.bold.cyan('\n📋 Available Benchmarks\n'));

      for (const file of benchmarks) {
        const suite = await loadBenchmark(file);
        const fileName = path.basename(file);

        console.log(chalk.bold(fileName));
        console.log(chalk.gray(`  Suite: ${suite.name}`));
        console.log(chalk.gray(`  Benchmarks: ${suite.benchmarks.length}`));

        suite.benchmarks.forEach(b => {
          console.log(chalk.gray(`    - ${b.name}`));
        });

        console.log('');
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Report command
 */
program
  .command('report [file]')
  .description('Generate report from results file')
  .option('--format <type>', 'Report format (console, html, json)', 'console')
  .option('--output <path>', 'Output path for report')
  .action(async (file, options) => {
    try {
      const resultsFile = file || './results/benchmark-results.json';

      const data = await fs.readFile(resultsFile, 'utf8');
      const results = JSON.parse(data);

      switch (options.format) {
        case 'console':
          const consoleReporter = new ConsoleReporter();
          consoleReporter.report(results);
          consoleReporter.reportSummary(results.results);
          break;

        case 'html':
          const htmlReporter = new HTMLReporter({
            outputPath: options.output || './results/report.html'
          });
          await htmlReporter.report(results);
          break;

        case 'json':
          const jsonReporter = new JSONReporter({
            outputPath: options.output || './results/report.json'
          });
          await jsonReporter.report(results);
          break;

        default:
          console.error(chalk.red(`Unknown format: ${options.format}`));
          process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Program info
program
  .name('benchmark')
  .description('Production-grade performance benchmarking suite for Claude Code agents')
  .version('1.0.0');

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
