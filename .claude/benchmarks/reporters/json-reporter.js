const fs = require('fs').promises;
const path = require('path');

/**
 * JSON reporter for machine-readable output and CI/CD integration
 */
class JSONReporter {
  constructor(options = {}) {
    this.options = {
      outputPath: options.outputPath || './results/benchmark-results.json',
      pretty: options.pretty !== false,
      includeRawData: options.includeRawData !== false,
      ...options
    };
  }

  /**
   * Report benchmark results
   */
  async report(results) {
    const output = this.formatResults(results);

    // Ensure directory exists
    const dir = path.dirname(this.options.outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Write JSON file
    const jsonString = this.options.pretty
      ? JSON.stringify(output, null, 2)
      : JSON.stringify(output);

    await fs.writeFile(this.options.outputPath, jsonString);

    console.log(`\n📄 JSON report saved to: ${this.options.outputPath}`);

    return output;
  }

  /**
   * Format results for JSON output
   */
  formatResults(results) {
    const output = {
      version: '1.0.0',
      timestamp: results.timestamp || new Date().toISOString(),
      systemInfo: results.systemInfo,
      summary: this.generateSummary(results.results),
      benchmarks: results.results.map(r => this.formatBenchmark(r))
    };

    return output;
  }

  /**
   * Format individual benchmark result
   */
  formatBenchmark(result) {
    if (result.failed) {
      return {
        name: result.name,
        status: 'failed',
        error: result.error
      };
    }

    const formatted = {
      name: result.name,
      status: 'success',
      timestamp: result.timestamp,
      iterations: result.iterations,
      statistics: {
        mean: result.statistics.mean,
        median: result.statistics.median,
        min: result.statistics.min,
        max: result.statistics.max,
        stdDev: result.statistics.stdDev,
        variance: result.statistics.variance,
        p95: result.statistics.p95,
        p99: result.statistics.p99,
        coefficientOfVariation: result.statistics.coefficientOfVariation
      }
    };

    // Include raw data if requested
    if (this.options.includeRawData && result.rawDurations) {
      formatted.rawDurations = result.rawDurations;
    }

    return formatted;
  }

  /**
   * Generate summary statistics
   */
  generateSummary(results) {
    const total = results.length;
    const successful = results.filter(r => !r.failed).length;
    const failed = total - successful;

    const allDurations = results
      .filter(r => !r.failed)
      .flatMap(r => r.rawDurations || []);

    const totalTime = allDurations.reduce((sum, d) => sum + d, 0);

    return {
      total,
      successful,
      failed,
      totalExecutionTime: totalTime,
      averageExecutionTime: allDurations.length > 0 ? totalTime / allDurations.length : 0
    };
  }

  /**
   * Report comparison with baseline
   */
  async reportComparison(comparisons, outputPath) {
    const path = outputPath || this.options.outputPath.replace('.json', '-comparison.json');

    const output = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      comparisons: comparisons.map(comp => ({
        name: comp.name,
        status: comp.status,
        current: comp.current,
        baseline: comp.baseline,
        difference: comp.difference,
        percentChange: comp.percentChange
      }))
    };

    await fs.writeFile(path, JSON.stringify(output, null, 2));
    console.log(`\n📊 Comparison report saved to: ${path}`);

    return output;
  }

  /**
   * Append to historical data
   */
  async appendToHistory(results, historyPath) {
    try {
      let history = [];

      // Load existing history
      try {
        const data = await fs.readFile(historyPath, 'utf8');
        history = JSON.parse(data);
      } catch (err) {
        // File doesn't exist, start fresh
      }

      // Add new results
      history.push({
        timestamp: results.timestamp || new Date().toISOString(),
        results: results.results.map(r => ({
          name: r.name,
          mean: r.statistics?.mean,
          median: r.statistics?.median,
          p95: r.statistics?.p95
        }))
      });

      // Keep only last 100 entries
      if (history.length > 100) {
        history = history.slice(-100);
      }

      // Save updated history
      await fs.writeFile(historyPath, JSON.stringify(history, null, 2));

      console.log(`\n📈 Historical data updated: ${historyPath}`);
    } catch (error) {
      console.error('Failed to update history:', error.message);
    }
  }
}

module.exports = JSONReporter;
