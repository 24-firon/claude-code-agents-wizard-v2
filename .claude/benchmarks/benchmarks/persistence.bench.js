const { createSuite } = require('../suite');
const fs = require('fs').promises;
const path = require('path');

/**
 * Persistence System Benchmarks
 */

const suite = createSuite('Persistence Performance');

// Setup: Create temp directory
suite.setup(async () => {
  const tempDir = path.join(__dirname, '../fixtures/temp-persistence');
  await fs.mkdir(tempDir, { recursive: true });
  global.testPersistenceDir = tempDir;
});

// Teardown: Clean up
suite.teardown(async () => {
  if (global.testPersistenceDir) {
    await fs.rm(global.testPersistenceDir, { recursive: true, force: true });
  }
});

/**
 * Todo read/write benchmark
 */
suite.add(
  'Todo Read/Write Speed',
  async () => {
    const todos = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      task: `Task ${i}`,
      status: 'pending',
      agent: 'coder',
      created: new Date().toISOString()
    }));

    const filePath = path.join(global.testPersistenceDir, `todos-${Date.now()}.json`);

    // Write
    const writeStart = Date.now();
    await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
    const writeEnd = Date.now();

    // Read
    const readStart = Date.now();
    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data);
    const readEnd = Date.now();

    return {
      todosWritten: todos.length,
      todosRead: parsed.length,
      writeTime: writeEnd - writeStart,
      readTime: readEnd - readStart,
      fileSize: (await fs.stat(filePath)).size
    };
  },
  { iterations: 100 }
);

/**
 * Metrics aggregation benchmark
 */
suite.add(
  'Metrics Aggregation Performance',
  async () => {
    const metrics = Array.from({ length: 1000 }, (_, i) => ({
      timestamp: Date.now() - i * 1000,
      metric: 'execution_time',
      value: Math.random() * 1000,
      agent: ['coder', 'tester', 'researcher'][i % 3]
    }));

    // Aggregate by agent
    const byAgent = {};
    for (const metric of metrics) {
      if (!byAgent[metric.agent]) {
        byAgent[metric.agent] = [];
      }
      byAgent[metric.agent].push(metric.value);
    }

    // Calculate statistics
    const aggregated = {};
    for (const [agent, values] of Object.entries(byAgent)) {
      const sum = values.reduce((a, b) => a + b, 0);
      aggregated[agent] = {
        count: values.length,
        avg: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    }

    return {
      totalMetrics: metrics.length,
      agentsAggregated: Object.keys(aggregated).length,
      aggregations: aggregated
    };
  },
  { iterations: 50 }
);

/**
 * Large dataset handling benchmark
 */
suite.add(
  'Large Dataset Handling',
  async () => {
    const datasetSizes = [1000, 5000, 10000];
    const results = [];

    for (const size of datasetSizes) {
      const dataset = Array.from({ length: size }, (_, i) => ({
        id: i,
        data: `Data item ${i}`,
        timestamp: Date.now(),
        metadata: { index: i, processed: false }
      }));

      const filePath = path.join(global.testPersistenceDir, `dataset-${size}-${Date.now()}.json`);

      const startTime = Date.now();

      // Write large dataset
      await fs.writeFile(filePath, JSON.stringify(dataset));

      // Read it back
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);

      const endTime = Date.now();

      const stat = await fs.stat(filePath);

      results.push({
        size,
        totalTime: endTime - startTime,
        fileSize: stat.size,
        throughput: stat.size / (endTime - startTime)
      });

      // Clean up large file
      await fs.unlink(filePath);
    }

    return {
      datasetsProcessed: results.length,
      results,
      avgThroughput: results.reduce((sum, r) => sum + r.throughput, 0) / results.length
    };
  },
  { iterations: 10 }
);

/**
 * Concurrent access benchmark
 */
suite.add(
  'Concurrent Access',
  async () => {
    const filePath = path.join(global.testPersistenceDir, `concurrent-${Date.now()}.json`);
    const initialData = { counter: 0, operations: [] };

    await fs.writeFile(filePath, JSON.stringify(initialData));

    const concurrentOps = 20;
    const operations = [];

    for (let i = 0; i < concurrentOps; i++) {
      operations.push((async () => {
        // Read
        const data = await fs.readFile(filePath, 'utf8');
        const parsed = JSON.parse(data);

        // Modify
        parsed.counter++;
        parsed.operations.push({ op: i, timestamp: Date.now() });

        // Small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 2));

        // Write back
        await fs.writeFile(filePath, JSON.stringify(parsed));
      })());
    }

    const startTime = Date.now();
    await Promise.all(operations);
    const endTime = Date.now();

    const finalData = JSON.parse(await fs.readFile(filePath, 'utf8'));

    return {
      concurrentOperations: concurrentOps,
      totalTime: endTime - startTime,
      finalCounter: finalData.counter,
      operationsRecorded: finalData.operations.length
    };
  },
  { iterations: 20 }
);

/**
 * Index performance benchmark
 */
suite.add(
  'Index Query Performance',
  async () => {
    const records = Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      name: `Record ${i}`,
      category: ['A', 'B', 'C'][i % 3],
      value: Math.random() * 1000,
      tags: [`tag${i % 10}`, `tag${i % 20}`]
    }));

    // Simulate index creation
    const index = {
      byCategory: {},
      byTag: {}
    };

    for (const record of records) {
      if (!index.byCategory[record.category]) {
        index.byCategory[record.category] = [];
      }
      index.byCategory[record.category].push(record.id);

      for (const tag of record.tags) {
        if (!index.byTag[tag]) {
          index.byTag[tag] = [];
        }
        index.byTag[tag].push(record.id);
      }
    }

    // Query using index
    const queryStart = Date.now();
    const categoryA = index.byCategory['A'] || [];
    const tag5 = index.byTag['tag5'] || [];
    const queryEnd = Date.now();

    return {
      totalRecords: records.length,
      categoriesIndexed: Object.keys(index.byCategory).length,
      tagsIndexed: Object.keys(index.byTag).length,
      queryTime: queryEnd - queryStart,
      resultsFound: categoryA.length + tag5.length
    };
  },
  { iterations: 30 }
);

/**
 * Backup and restore benchmark
 */
suite.add(
  'Backup and Restore',
  async () => {
    const data = {
      todos: Array.from({ length: 100 }, (_, i) => ({ id: i, task: `Task ${i}` })),
      metrics: Array.from({ length: 500 }, (_, i) => ({ id: i, value: Math.random() })),
      config: { version: '1.0.0', settings: {} }
    };

    const originalPath = path.join(global.testPersistenceDir, `original-${Date.now()}.json`);
    const backupPath = path.join(global.testPersistenceDir, `backup-${Date.now()}.json`);

    // Write original
    await fs.writeFile(originalPath, JSON.stringify(data, null, 2));

    // Backup
    const backupStart = Date.now();
    const originalData = await fs.readFile(originalPath, 'utf8');
    await fs.writeFile(backupPath, originalData);
    const backupEnd = Date.now();

    // Restore
    const restoreStart = Date.now();
    const backupData = await fs.readFile(backupPath, 'utf8');
    const restored = JSON.parse(backupData);
    const restoreEnd = Date.now();

    const originalStat = await fs.stat(originalPath);
    const backupStat = await fs.stat(backupPath);

    return {
      backupTime: backupEnd - backupStart,
      restoreTime: restoreEnd - restoreStart,
      dataSize: originalStat.size,
      backupSize: backupStat.size,
      recordsRestored: restored.todos.length + restored.metrics.length
    };
  },
  { iterations: 25 }
);

module.exports = suite.build();
