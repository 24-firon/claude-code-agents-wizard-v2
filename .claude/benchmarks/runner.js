const performanceNow = require('performance-now');
const pidusage = require('pidusage');
const si = require('systeminformation');
const fs = require('fs').promises;
const path = require('path');

/**
 * Production-grade benchmark runner with statistical analysis
 */
class BenchmarkRunner {
  constructor(config = {}) {
    this.config = {
      iterations: config.iterations || 10,
      warmupRounds: config.warmupRounds || 3,
      timeout: config.timeout || 300000,
      collectSystemMetrics: config.collectSystemMetrics !== false,
      ...config
    };
    this.results = [];
    this.systemInfo = null;
  }

  /**
   * Collect system information
   */
  async collectSystemInfo() {
    if (!this.config.collectSystemMetrics) return null;

    try {
      const [cpu, mem, os, currentLoad] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.osInfo(),
        si.currentLoad()
      ]);

      this.systemInfo = {
        cpu: {
          manufacturer: cpu.manufacturer,
          brand: cpu.brand,
          cores: cpu.cores,
          physicalCores: cpu.physicalCores,
          speed: cpu.speed
        },
        memory: {
          total: mem.total,
          free: mem.free,
          used: mem.used
        },
        os: {
          platform: os.platform,
          distro: os.distro,
          release: os.release,
          arch: os.arch
        },
        load: {
          avgLoad: currentLoad.avgLoad,
          currentLoad: currentLoad.currentLoad
        }
      };

      return this.systemInfo;
    } catch (error) {
      console.warn('Failed to collect system info:', error.message);
      return null;
    }
  }

  /**
   * Measure process metrics
   */
  async measureProcessMetrics() {
    try {
      const stats = await pidusage(process.pid);
      return {
        cpu: stats.cpu,
        memory: stats.memory,
        elapsed: stats.elapsed
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Run a single benchmark iteration
   */
  async runIteration(fn, context = {}) {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const beforeMetrics = await this.measureProcessMetrics();
    const startTime = performanceNow();

    let error = null;
    let result = null;

    try {
      result = await Promise.race([
        fn(context),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Benchmark timeout')), this.config.timeout)
        )
      ]);
    } catch (err) {
      error = err;
    }

    const endTime = performanceNow();
    const afterMetrics = await this.measureProcessMetrics();

    const duration = endTime - startTime;

    return {
      duration,
      result,
      error,
      metrics: {
        before: beforeMetrics,
        after: afterMetrics,
        cpu: afterMetrics && beforeMetrics ?
          afterMetrics.cpu - beforeMetrics.cpu : null,
        memory: afterMetrics && beforeMetrics ?
          afterMetrics.memory - beforeMetrics.memory : null
      }
    };
  }

  /**
   * Run benchmark with warmup and multiple iterations
   */
  async run(name, fn, options = {}) {
    const context = options.context || {};
    const iterations = options.iterations || this.config.iterations;
    const warmupRounds = options.warmupRounds || this.config.warmupRounds;

    console.log(`\n🔥 Warming up: ${name} (${warmupRounds} rounds)...`);

    // Warmup phase
    for (let i = 0; i < warmupRounds; i++) {
      await this.runIteration(fn, context);
    }

    console.log(`📊 Running benchmark: ${name} (${iterations} iterations)...`);

    const iterationResults = [];

    // Main benchmark phase
    for (let i = 0; i < iterations; i++) {
      const result = await this.runIteration(fn, context);
      iterationResults.push(result);

      if (result.error) {
        console.error(`❌ Iteration ${i + 1} failed:`, result.error.message);
      }
    }

    // Calculate statistics
    const durations = iterationResults
      .filter(r => !r.error)
      .map(r => r.duration);

    if (durations.length === 0) {
      throw new Error(`All iterations failed for benchmark: ${name}`);
    }

    const stats = this.calculateStatistics(durations);
    const errors = iterationResults.filter(r => r.error).length;

    const benchmarkResult = {
      name,
      timestamp: new Date().toISOString(),
      iterations: {
        total: iterations,
        successful: durations.length,
        failed: errors
      },
      statistics: stats,
      rawDurations: durations,
      systemInfo: this.systemInfo
    };

    this.results.push(benchmarkResult);
    return benchmarkResult;
  }

  /**
   * Calculate statistical metrics
   */
  calculateStatistics(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;

    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const squaredDiffs = sorted.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(variance);

    const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

    const p95Index = Math.ceil(n * 0.95) - 1;
    const p99Index = Math.ceil(n * 0.99) - 1;

    return {
      min: sorted[0],
      max: sorted[n - 1],
      mean,
      median,
      stdDev,
      variance,
      p95: sorted[p95Index],
      p99: sorted[p99Index],
      coefficientOfVariation: (stdDev / mean) * 100
    };
  }

  /**
   * Run a suite of benchmarks
   */
  async runSuite(suite) {
    await this.collectSystemInfo();

    const suiteResults = {
      suiteName: suite.name,
      startTime: new Date().toISOString(),
      benchmarks: []
    };

    // Run setup if provided
    if (suite.setup) {
      await suite.setup();
    }

    try {
      for (const benchmark of suite.benchmarks) {
        if (benchmark.skip) {
          console.log(`⏭️  Skipping: ${benchmark.name}`);
          continue;
        }

        // Run before hook
        if (benchmark.before) {
          await benchmark.before();
        }

        try {
          const result = await this.run(
            benchmark.name,
            benchmark.fn,
            benchmark.options || {}
          );
          suiteResults.benchmarks.push(result);
        } catch (error) {
          console.error(`❌ Benchmark failed: ${benchmark.name}`, error);
          suiteResults.benchmarks.push({
            name: benchmark.name,
            error: error.message,
            failed: true
          });
        }

        // Run after hook
        if (benchmark.after) {
          await benchmark.after();
        }
      }
    } finally {
      // Run teardown if provided
      if (suite.teardown) {
        await suite.teardown();
      }
    }

    suiteResults.endTime = new Date().toISOString();
    return suiteResults;
  }

  /**
   * Compare with baseline
   */
  async compareWithBaseline(baselinePath) {
    try {
      const baselineData = await fs.readFile(baselinePath, 'utf8');
      const baseline = JSON.parse(baselineData);

      const comparisons = this.results.map(current => {
        const baselineResult = baseline.find(b => b.name === current.name);

        if (!baselineResult) {
          return {
            name: current.name,
            status: 'new',
            current: current.statistics
          };
        }

        const currentMean = current.statistics.mean;
        const baselineMean = baselineResult.statistics.mean;
        const difference = currentMean - baselineMean;
        const percentChange = (difference / baselineMean) * 100;

        let status = 'unchanged';
        if (Math.abs(percentChange) > 5) {
          status = percentChange > 0 ? 'slower' : 'faster';
        }

        return {
          name: current.name,
          status,
          current: current.statistics,
          baseline: baselineResult.statistics,
          difference,
          percentChange
        };
      });

      return comparisons;
    } catch (error) {
      console.warn('No baseline found or failed to load:', error.message);
      return null;
    }
  }

  /**
   * Get all results
   */
  getResults() {
    return {
      results: this.results,
      systemInfo: this.systemInfo,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Save results to file
   */
  async saveResults(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      filePath,
      JSON.stringify(this.getResults(), null, 2)
    );
  }
}

module.exports = BenchmarkRunner;
