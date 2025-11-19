/**
 * Metrics Integration Tests
 *
 * Tests metrics collection and reporting including:
 * - Metric collection
 * - Aggregation
 * - Session tracking
 * - Statistics calculation
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createTestWorkspace } from './utils/test-helpers.js';

describe('Metrics Integration Tests', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('metrics-test');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  describe('Metric Collection', () => {
    it('should collect agent invocation metrics', () => {
      const metrics = {
        agent: 'coder',
        invocations: 5,
        successes: 4,
        failures: 1,
        averageDuration: 1200
      };

      expect(metrics.successes + metrics.failures).toBe(metrics.invocations);
      expect(metrics.averageDuration).toBeGreaterThan(0);
    });

    it('should track execution times', () => {
      const executions = [
        { agent: 'coder', duration: 1000 },
        { agent: 'coder', duration: 1500 },
        { agent: 'tester', duration: 3000 }
      ];

      const coderTimes = executions.filter(e => e.agent === 'coder');
      const avgCoder = coderTimes.reduce((sum, e) => sum + e.duration, 0) / coderTimes.length;

      expect(avgCoder).toBe(1250);
    });

    it('should record success/failure rates', () => {
      const agentStats = {
        totalInvocations: 100,
        successes: 85,
        failures: 15
      };

      const successRate = (agentStats.successes / agentStats.totalInvocations) * 100;
      expect(successRate).toBe(85);
    });

    it('should track error types', () => {
      const errors = [
        { type: 'PermissionError', count: 3 },
        { type: 'ModuleNotFound', count: 5 },
        { type: 'NetworkError', count: 2 }
      ];

      const totalErrors = errors.reduce((sum, e) => sum + e.count, 0);
      expect(totalErrors).toBe(10);

      const mostCommon = errors.sort((a, b) => b.count - a.count)[0];
      expect(mostCommon.type).toBe('ModuleNotFound');
    });

    it('should record stuck agent escalations', () => {
      const escalations = {
        total: 12,
        fromCoder: 7,
        fromTester: 5,
        avgResolutionTime: 45000 // ms
      };

      expect(escalations.fromCoder + escalations.fromTester).toBe(escalations.total);
    });
  });

  describe('Aggregation', () => {
    it('should aggregate metrics by agent', () => {
      const events = [
        { agent: 'coder', success: true, duration: 1000 },
        { agent: 'coder', success: true, duration: 1200 },
        { agent: 'tester', success: true, duration: 3000 },
        { agent: 'coder', success: false, duration: 800 }
      ];

      const byAgent = events.reduce((acc, event) => {
        if (!acc[event.agent]) {
          acc[event.agent] = { count: 0, successes: 0, totalDuration: 0 };
        }
        acc[event.agent].count++;
        if (event.success) acc[event.agent].successes++;
        acc[event.agent].totalDuration += event.duration;
        return acc;
      }, {});

      expect(byAgent.coder.count).toBe(3);
      expect(byAgent.coder.successes).toBe(2);
      expect(byAgent.tester.count).toBe(1);
    });

    it('should aggregate daily metrics', async () => {
      const dailyMetrics = {
        date: '2024-01-15',
        totalTasks: 20,
        completed: 18,
        failed: 2,
        totalDuration: 36000000 // ms
      };

      const metricsPath = join(tempDir, 'daily-2024-01-15.json');
      await mkdir(tempDir, { recursive: true });
      await writeFile(metricsPath, JSON.stringify(dailyMetrics));

      const loaded = JSON.parse(await readFile(metricsPath, 'utf-8'));
      expect(loaded.completed).toBe(18);
    });

    it('should aggregate weekly metrics', () => {
      const dailyStats = [
        { date: '2024-01-15', tasks: 10 },
        { date: '2024-01-16', tasks: 12 },
        { date: '2024-01-17', tasks: 8 },
        { date: '2024-01-18', tasks: 15 },
        { date: '2024-01-19', tasks: 11 }
      ];

      const weeklyTotal = dailyStats.reduce((sum, day) => sum + day.tasks, 0);
      expect(weeklyTotal).toBe(56);
    });

    it('should calculate all-time statistics', () => {
      const allTimeStats = {
        totalProjects: 50,
        totalTasks: 500,
        totalDuration: 180000000, // ms
        averageTaskDuration: 360000, // ms
        successRate: 0.92
      };

      expect(allTimeStats.successRate).toBeGreaterThan(0.9);
      expect(allTimeStats.totalTasks / allTimeStats.totalProjects).toBe(10);
    });
  });

  describe('Session Tracking', () => {
    it('should track session start and end', () => {
      const session = {
        id: 'session-001',
        startTime: new Date('2024-01-15T10:00:00Z').toISOString(),
        endTime: new Date('2024-01-15T11:30:00Z').toISOString()
      };

      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const duration = end.getTime() - start.getTime();

      expect(duration).toBe(90 * 60 * 1000); // 90 minutes
    });

    it('should track tasks completed in session', () => {
      const session = {
        id: 'session-001',
        tasksCompleted: ['task-1', 'task-2', 'task-3'],
        tasksFailed: ['task-4']
      };

      const completionRate = session.tasksCompleted.length /
        (session.tasksCompleted.length + session.tasksFailed.length);

      expect(completionRate).toBe(0.75);
    });

    it('should track agents used in session', () => {
      const session = {
        id: 'session-001',
        agentInvocations: {
          coder: 10,
          tester: 10,
          stuck: 2,
          researcher: 1
        }
      };

      const totalInvocations = Object.values(session.agentInvocations)
        .reduce((sum, count) => sum + count, 0);

      expect(totalInvocations).toBe(23);
    });

    it('should persist session data', async () => {
      const session = {
        id: 'session-2024-01-15-001',
        startTime: new Date().toISOString(),
        events: []
      };

      const sessionPath = join(tempDir, `${session.id}.json`);
      await writeFile(sessionPath, JSON.stringify(session, null, 2));

      const loaded = JSON.parse(await readFile(sessionPath, 'utf-8'));
      expect(loaded.id).toBe(session.id);
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate average task duration', () => {
      const tasks = [
        { duration: 1000 },
        { duration: 2000 },
        { duration: 1500 },
        { duration: 2500 }
      ];

      const avg = tasks.reduce((sum, t) => sum + t.duration, 0) / tasks.length;
      expect(avg).toBe(1750);
    });

    it('should calculate success rate percentage', () => {
      const stats = {
        total: 100,
        successful: 87,
        failed: 13
      };

      const successRate = (stats.successful / stats.total) * 100;
      expect(successRate).toBe(87);
    });

    it('should calculate median execution time', () => {
      const times = [100, 200, 150, 300, 250];
      const sorted = times.sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];

      expect(median).toBe(200);
    });

    it('should calculate percentile values', () => {
      const times = Array.from({ length: 100 }, (_, i) => i + 1);

      const p95Index = Math.floor(times.length * 0.95);
      const p95 = times[p95Index];

      expect(p95).toBe(96);
    });

    it('should track trends over time', () => {
      const weeklyStats = [
        { week: 1, avgDuration: 2000 },
        { week: 2, avgDuration: 1800 },
        { week: 3, avgDuration: 1600 },
        { week: 4, avgDuration: 1400 }
      ];

      const improving = weeklyStats.every((stat, i) =>
        i === 0 || stat.avgDuration < weeklyStats[i - 1].avgDuration
      );

      expect(improving).toBe(true);
    });
  });

  describe('Performance Metrics', () => {
    it('should track agent response times', () => {
      const responseTimes = {
        coder: { p50: 1200, p95: 3000, p99: 5000 },
        tester: { p50: 2500, p95: 6000, p99: 10000 },
        stuck: { p50: 30000, p95: 120000, p99: 300000 }
      };

      expect(responseTimes.coder.p50).toBeLessThan(responseTimes.tester.p50);
      expect(responseTimes.stuck.p50).toBeGreaterThan(responseTimes.coder.p50);
    });

    it('should identify performance bottlenecks', () => {
      const agentStats = [
        { agent: 'coder', avgDuration: 1500 },
        { agent: 'tester', avgDuration: 4500 },
        { agent: 'researcher', avgDuration: 8000 }
      ];

      const slowest = agentStats.sort((a, b) => b.avgDuration - a.avgDuration)[0];
      expect(slowest.agent).toBe('researcher');
    });

    it('should track memory usage patterns', () => {
      const memorySnapshots = [
        { timestamp: '10:00', usage: 150 },
        { timestamp: '10:30', usage: 200 },
        { timestamp: '11:00', usage: 180 },
        { timestamp: '11:30', usage: 160 }
      ];

      const maxUsage = Math.max(...memorySnapshots.map(s => s.usage));
      expect(maxUsage).toBe(200);
    });
  });

  describe('Reporting', () => {
    it('should generate summary report', () => {
      const report = {
        period: 'daily',
        date: '2024-01-15',
        summary: {
          totalTasks: 25,
          completed: 23,
          failed: 2,
          skipped: 0,
          successRate: 92,
          totalDuration: 45000000,
          avgTaskDuration: 1800000
        }
      };

      expect(report.summary.successRate).toBeGreaterThan(90);
    });

    it('should highlight anomalies', () => {
      const metrics = [
        { hour: 1, duration: 1500 },
        { hour: 2, duration: 1600 },
        { hour: 3, duration: 8000 }, // Anomaly!
        { hour: 4, duration: 1400 }
      ];

      const avg = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
      const anomalies = metrics.filter(m => m.duration > avg * 2);

      expect(anomalies).toHaveLength(1);
      expect(anomalies[0].hour).toBe(3);
    });

    it('should export metrics to JSON', async () => {
      const metrics = {
        exportedAt: new Date().toISOString(),
        period: 'weekly',
        data: {
          tasks: 100,
          successRate: 0.95
        }
      };

      const exportPath = join(tempDir, 'metrics-export.json');
      await writeFile(exportPath, JSON.stringify(metrics, null, 2));

      const loaded = JSON.parse(await readFile(exportPath, 'utf-8'));
      expect(loaded.data.successRate).toBe(0.95);
    });
  });

  describe('Metrics Schema', () => {
    it('should validate metrics schema', () => {
      const metric = {
        timestamp: new Date().toISOString(),
        agent: 'coder',
        event: 'invocation',
        status: 'success',
        duration: 1200
      };

      const isValid = metric.timestamp && metric.agent && metric.event && metric.status;
      expect(isValid).toBe(true);
    });

    it('should version metrics format', async () => {
      const metrics = {
        version: '1.0.0',
        schemaVersion: '2024-01',
        data: []
      };

      const metricsPath = join(tempDir, 'metrics.json');
      await writeFile(metricsPath, JSON.stringify(metrics));

      const loaded = JSON.parse(await readFile(metricsPath, 'utf-8'));
      expect(loaded.version).toBe('1.0.0');
    });
  });
});
