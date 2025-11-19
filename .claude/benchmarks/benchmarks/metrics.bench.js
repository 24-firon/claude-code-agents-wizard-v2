const { createSuite } = require('../suite');

/**
 * Metrics System Benchmarks
 */

const suite = createSuite('Metrics Performance');

/**
 * Metric collection overhead benchmark
 */
suite.add(
  'Metric Collection Overhead',
  async () => {
    const operations = 1000;
    const metrics = [];

    // Simulate operations with metric collection
    for (let i = 0; i < operations; i++) {
      const startTime = Date.now();

      // Mock operation
      await new Promise(resolve => setTimeout(resolve, 1));

      const endTime = Date.now();

      // Collect metric
      metrics.push({
        operation: `op-${i}`,
        duration: endTime - startTime,
        timestamp: Date.now(),
        metadata: { index: i }
      });
    }

    return {
      operations,
      metricsCollected: metrics.length,
      avgDuration: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
      overhead: 0.5 // Mock overhead in ms
    };
  },
  { iterations: 20 }
);

/**
 * Aggregation speed benchmark
 */
suite.add(
  'Aggregation Speed',
  async () => {
    const metrics = Array.from({ length: 10000 }, (_, i) => ({
      timestamp: Date.now() - i * 1000,
      metric: ['cpu', 'memory', 'disk', 'network'][i % 4],
      value: Math.random() * 100,
      tags: {
        agent: ['coder', 'tester'][i % 2],
        env: 'production'
      }
    }));

    const startTime = Date.now();

    // Aggregate by metric type
    const byMetric = {};
    for (const m of metrics) {
      if (!byMetric[m.metric]) {
        byMetric[m.metric] = { values: [], count: 0, sum: 0 };
      }
      byMetric[m.metric].values.push(m.value);
      byMetric[m.metric].count++;
      byMetric[m.metric].sum += m.value;
    }

    // Calculate statistics
    const stats = {};
    for (const [metric, data] of Object.entries(byMetric)) {
      const sorted = [...data.values].sort((a, b) => a - b);
      stats[metric] = {
        count: data.count,
        avg: data.sum / data.count,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        median: sorted[Math.floor(sorted.length / 2)]
      };
    }

    const endTime = Date.now();

    return {
      metricsProcessed: metrics.length,
      metricTypes: Object.keys(byMetric).length,
      aggregationTime: endTime - startTime,
      stats
    };
  },
  { iterations: 30 }
);

/**
 * Query performance benchmark
 */
suite.add(
  'Query Performance',
  async () => {
    const metricsDb = Array.from({ length: 50000 }, (_, i) => ({
      timestamp: Date.now() - i * 1000,
      agent: ['coder', 'tester', 'researcher'][i % 3],
      metric: 'execution_time',
      value: Math.random() * 1000
    }));

    const queries = [
      // Query 1: Last hour for specific agent
      () => {
        const oneHourAgo = Date.now() - 3600000;
        return metricsDb.filter(m =>
          m.timestamp > oneHourAgo && m.agent === 'coder'
        );
      },
      // Query 2: Average by agent
      () => {
        const byAgent = {};
        for (const m of metricsDb.slice(0, 1000)) {
          if (!byAgent[m.agent]) byAgent[m.agent] = [];
          byAgent[m.agent].push(m.value);
        }
        return Object.entries(byAgent).map(([agent, values]) => ({
          agent,
          avg: values.reduce((a, b) => a + b, 0) / values.length
        }));
      },
      // Query 3: Top 100 slowest
      () => {
        return [...metricsDb].sort((a, b) => b.value - a.value).slice(0, 100);
      }
    ];

    const queryResults = [];

    for (let i = 0; i < queries.length; i++) {
      const startTime = Date.now();
      const results = queries[i]();
      const endTime = Date.now();

      queryResults.push({
        queryId: i,
        resultsCount: Array.isArray(results) ? results.length : 0,
        queryTime: endTime - startTime
      });
    }

    return {
      totalMetrics: metricsDb.length,
      queriesExecuted: queries.length,
      queryResults,
      avgQueryTime: queryResults.reduce((sum, q) => sum + q.queryTime, 0) / queryResults.length
    };
  },
  { iterations: 20 }
);

/**
 * Time-series data handling benchmark
 */
suite.add(
  'Time-Series Data Handling',
  async () => {
    const timeSeriesData = [];
    const dataPoints = 5000;
    const startTime = Date.now() - 24 * 3600000; // 24 hours ago

    // Generate time-series data
    for (let i = 0; i < dataPoints; i++) {
      timeSeriesData.push({
        timestamp: startTime + i * 17280, // ~17 second intervals
        value: Math.sin(i / 100) * 50 + 50 + Math.random() * 10,
        metric: 'cpu_usage'
      });
    }

    // Downsample to hourly averages
    const hourly = {};
    for (const point of timeSeriesData) {
      const hour = Math.floor(point.timestamp / 3600000) * 3600000;
      if (!hourly[hour]) {
        hourly[hour] = { sum: 0, count: 0, values: [] };
      }
      hourly[hour].sum += point.value;
      hourly[hour].count++;
      hourly[hour].values.push(point.value);
    }

    const downsampled = Object.entries(hourly).map(([hour, data]) => ({
      timestamp: parseInt(hour),
      avg: data.sum / data.count,
      min: Math.min(...data.values),
      max: Math.max(...data.values),
      count: data.count
    }));

    return {
      originalDataPoints: dataPoints,
      downsampledPoints: downsampled.length,
      compressionRatio: dataPoints / downsampled.length,
      timeSpanHours: 24
    };
  },
  { iterations: 25 }
);

/**
 * Real-time metrics update benchmark
 */
suite.add(
  'Real-Time Metrics Update',
  async () => {
    const metricsBuffer = [];
    const updateInterval = 10; // ms
    const duration = 100; // ms
    const updates = duration / updateInterval;

    let updateCount = 0;

    const startTime = Date.now();

    // Simulate real-time updates
    for (let i = 0; i < updates; i++) {
      await new Promise(resolve => setTimeout(resolve, updateInterval));

      metricsBuffer.push({
        timestamp: Date.now(),
        cpu: Math.random() * 100,
        memory: Math.random() * 8192,
        activeAgents: Math.floor(Math.random() * 5)
      });

      updateCount++;

      // Flush buffer every 5 updates
      if (metricsBuffer.length >= 5) {
        metricsBuffer.length = 0;
      }
    }

    const endTime = Date.now();

    return {
      updates: updateCount,
      duration: endTime - startTime,
      updateRate: (updateCount / (endTime - startTime)) * 1000, // per second
      bufferFlushes: Math.floor(updateCount / 5)
    };
  },
  { iterations: 30 }
);

/**
 * Metric retention policy benchmark
 */
suite.add(
  'Metric Retention Policy',
  async () => {
    const metrics = Array.from({ length: 100000 }, (_, i) => ({
      timestamp: Date.now() - i * 1000,
      value: Math.random() * 100
    }));

    const retentionPeriod = 7 * 24 * 3600000; // 7 days
    const cutoffTime = Date.now() - retentionPeriod;

    const startTime = Date.now();

    // Apply retention policy
    const retained = metrics.filter(m => m.timestamp > cutoffTime);
    const pruned = metrics.length - retained.length;

    const endTime = Date.now();

    return {
      totalMetrics: metrics.length,
      retained: retained.length,
      pruned,
      prunedPercent: (pruned / metrics.length) * 100,
      processingTime: endTime - startTime
    };
  },
  { iterations: 25 }
);

/**
 * Custom metric calculation benchmark
 */
suite.add(
  'Custom Metric Calculation',
  async () => {
    const rawMetrics = Array.from({ length: 1000 }, (_, i) => ({
      timestamp: Date.now() - i * 1000,
      requests: Math.floor(Math.random() * 1000),
      errors: Math.floor(Math.random() * 50),
      duration: Math.random() * 500
    }));

    const calculated = [];

    for (const metric of rawMetrics) {
      // Calculate custom metrics
      const errorRate = metric.requests > 0 ? metric.errors / metric.requests : 0;
      const throughput = 1000 / metric.duration; // requests per second
      const availability = 1 - errorRate;

      calculated.push({
        timestamp: metric.timestamp,
        errorRate,
        throughput,
        availability,
        successRate: 1 - errorRate
      });
    }

    // Calculate rolling averages
    const windowSize = 10;
    const rollingAvg = [];

    for (let i = windowSize; i < calculated.length; i++) {
      const window = calculated.slice(i - windowSize, i);
      rollingAvg.push({
        timestamp: calculated[i].timestamp,
        avgErrorRate: window.reduce((sum, m) => sum + m.errorRate, 0) / windowSize,
        avgThroughput: window.reduce((sum, m) => sum + m.throughput, 0) / windowSize
      });
    }

    return {
      rawMetrics: rawMetrics.length,
      calculatedMetrics: calculated.length,
      rollingAverages: rollingAvg.length,
      windowSize
    };
  },
  { iterations: 40 }
);

/**
 * Metric export benchmark
 */
suite.add(
  'Metric Export',
  async () => {
    const metrics = Array.from({ length: 10000 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 1000).toISOString(),
      agent: ['coder', 'tester'][i % 2],
      metric: 'execution_time',
      value: Math.random() * 1000
    }));

    // Export to CSV format
    const csvStart = Date.now();
    const csvLines = metrics.map(m =>
      `${m.timestamp},${m.agent},${m.metric},${m.value}`
    );
    const csv = 'timestamp,agent,metric,value\n' + csvLines.join('\n');
    const csvEnd = Date.now();

    // Export to JSON format
    const jsonStart = Date.now();
    const json = JSON.stringify(metrics);
    const jsonEnd = Date.now();

    return {
      metricsExported: metrics.length,
      csvSize: csv.length,
      csvTime: csvEnd - csvStart,
      jsonSize: json.length,
      jsonTime: jsonEnd - jsonStart,
      csvVsJson: csv.length / json.length
    };
  },
  { iterations: 20 }
);

module.exports = suite.build();
