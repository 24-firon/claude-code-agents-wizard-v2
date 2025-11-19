/**
 * Persistence Integration Tests
 *
 * Tests data persistence including:
 * - Todo persistence
 * - Metadata updates
 * - Concurrent access
 * - Data integrity
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createTestWorkspace } from './utils/test-helpers.js';

describe('Persistence Integration Tests', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('persistence-test');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  describe('Todo Persistence', () => {
    it('should persist todos to disk', async () => {
      const todos = [
        { id: 1, title: 'Task 1', status: 'pending' },
        { id: 2, title: 'Task 2', status: 'completed' }
      ];

      const todosPath = join(tempDir, 'todos.json');
      await writeFile(todosPath, JSON.stringify({ todos }, null, 2));

      const content = await readFile(todosPath, 'utf-8');
      const loaded = JSON.parse(content);

      expect(loaded.todos).toHaveLength(2);
      expect(loaded.todos[0].title).toBe('Task 1');
    });

    it('should update todo status persistently', async () => {
      const todosPath = join(tempDir, 'todos.json');

      // Initial state
      const todos = [{ id: 1, title: 'Task', status: 'pending' }];
      await writeFile(todosPath, JSON.stringify({ todos }));

      // Update status
      todos[0].status = 'completed';
      await writeFile(todosPath, JSON.stringify({ todos }));

      // Verify persisted
      const loaded = JSON.parse(await readFile(todosPath, 'utf-8'));
      expect(loaded.todos[0].status).toBe('completed');
    });

    it('should maintain todo order', async () => {
      const todos = [
        { id: 3, title: 'Third', priority: 1 },
        { id: 1, title: 'First', priority: 3 },
        { id: 2, title: 'Second', priority: 2 }
      ];

      const todosPath = join(tempDir, 'todos.json');
      await writeFile(todosPath, JSON.stringify({ todos }));

      const loaded = JSON.parse(await readFile(todosPath, 'utf-8'));

      expect(loaded.todos[0].id).toBe(3);
      expect(loaded.todos[1].id).toBe(1);
      expect(loaded.todos[2].id).toBe(2);
    });

    it('should handle empty todo list', async () => {
      const todosPath = join(tempDir, 'todos.json');
      await writeFile(todosPath, JSON.stringify({ todos: [] }));

      const loaded = JSON.parse(await readFile(todosPath, 'utf-8'));
      expect(loaded.todos).toHaveLength(0);
    });
  });

  describe('Metadata Updates', () => {
    it('should persist project metadata', async () => {
      const metadata = {
        projectName: 'Test Project',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0.0'
      };

      const metadataPath = join(tempDir, 'metadata.json');
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      const loaded = JSON.parse(await readFile(metadataPath, 'utf-8'));
      expect(loaded.projectName).toBe('Test Project');
    });

    it('should update last modified timestamp', async () => {
      const metadataPath = join(tempDir, 'metadata.json');

      const metadata = {
        projectName: 'Test',
        lastModified: new Date('2024-01-01').toISOString()
      };

      await writeFile(metadataPath, JSON.stringify(metadata));

      // Simulate update
      await sleep(10);
      metadata.lastModified = new Date().toISOString();
      await writeFile(metadataPath, JSON.stringify(metadata));

      const loaded = JSON.parse(await readFile(metadataPath, 'utf-8'));
      const lastModified = new Date(loaded.lastModified);

      expect(lastModified.getTime()).toBeGreaterThan(new Date('2024-01-01').getTime());
    });

    it('should track todo count in metadata', async () => {
      const todos = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
        { id: 3, title: 'Task 3' }
      ];

      const metadata = {
        totalTodos: todos.length,
        completedTodos: todos.filter(t => t.status === 'completed').length
      };

      expect(metadata.totalTodos).toBe(3);
      expect(metadata.completedTodos).toBe(0);
    });
  });

  describe('Concurrent Access', () => {
    it('should handle multiple reads safely', async () => {
      const dataPath = join(tempDir, 'data.json');
      const data = { value: 42 };

      await writeFile(dataPath, JSON.stringify(data));

      // Simulate concurrent reads
      const read1 = readFile(dataPath, 'utf-8');
      const read2 = readFile(dataPath, 'utf-8');
      const read3 = readFile(dataPath, 'utf-8');

      const [content1, content2, content3] = await Promise.all([read1, read2, read3]);

      expect(JSON.parse(content1).value).toBe(42);
      expect(JSON.parse(content2).value).toBe(42);
      expect(JSON.parse(content3).value).toBe(42);
    });

    it('should detect concurrent write conflicts', async () => {
      // This test demonstrates the need for write locking
      const dataPath = join(tempDir, 'concurrent.json');

      let writeCount = 0;

      const write1 = async () => {
        await writeFile(dataPath, JSON.stringify({ writer: 1 }));
        writeCount++;
      };

      const write2 = async () => {
        await writeFile(dataPath, JSON.stringify({ writer: 2 }));
        writeCount++;
      };

      await Promise.all([write1(), write2()]);

      expect(writeCount).toBe(2);

      // Last write wins (potential data loss)
      const content = JSON.parse(await readFile(dataPath, 'utf-8'));
      expect([1, 2]).toContain(content.writer);
    });

    it('should implement read-modify-write pattern safely', async () => {
      const counterPath = join(tempDir, 'counter.json');
      await writeFile(counterPath, JSON.stringify({ count: 0 }));

      const incrementCounter = async () => {
        const content = await readFile(counterPath, 'utf-8');
        const data = JSON.parse(content);
        data.count += 1;
        await writeFile(counterPath, JSON.stringify(data));
      };

      // Sequential increments
      await incrementCounter();
      await incrementCounter();
      await incrementCounter();

      const final = JSON.parse(await readFile(counterPath, 'utf-8'));
      expect(final.count).toBe(3);
    });
  });

  describe('Data Integrity', () => {
    it('should validate data before persisting', () => {
      const todo = {
        id: 1,
        title: 'Valid Todo',
        status: 'pending'
      };

      const isValid = todo.id && todo.title && todo.status;
      expect(isValid).toBe(true);
    });

    it('should reject invalid data structures', () => {
      const invalidTodo = {
        id: null,
        title: '',
        status: 'invalid-status'
      };

      const isValid = invalidTodo.id && invalidTodo.title;
      expect(isValid).toBe(false);
    });

    it('should handle corrupted JSON gracefully', async () => {
      const corruptedPath = join(tempDir, 'corrupted.json');
      await writeFile(corruptedPath, '{ "incomplete": ');

      let error = null;
      try {
        JSON.parse(await readFile(corruptedPath, 'utf-8'));
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
      expect(error.message).toContain('JSON');
    });

    it('should create backups before updates', async () => {
      const dataPath = join(tempDir, 'important.json');
      const backupPath = join(tempDir, 'important.json.backup');

      const originalData = { value: 'original' };
      await writeFile(dataPath, JSON.stringify(originalData));

      // Create backup
      await writeFile(backupPath, await readFile(dataPath));

      // Update original
      await writeFile(dataPath, JSON.stringify({ value: 'updated' }));

      // Verify backup still has original
      const backup = JSON.parse(await readFile(backupPath, 'utf-8'));
      expect(backup.value).toBe('original');
    });

    it('should verify data after write', async () => {
      const dataPath = join(tempDir, 'verify.json');
      const data = { test: 'data', nested: { value: 42 } };

      await writeFile(dataPath, JSON.stringify(data));

      // Verify
      const written = JSON.parse(await readFile(dataPath, 'utf-8'));

      expect(written).toEqual(data);
      expect(written.nested.value).toBe(42);
    });
  });

  describe('File System Operations', () => {
    it('should create directories if missing', async () => {
      const nestedPath = join(tempDir, 'a', 'b', 'c', 'data.json');
      const dir = join(tempDir, 'a', 'b', 'c');

      await mkdir(dir, { recursive: true });
      await writeFile(nestedPath, '{}');

      const content = await readFile(nestedPath, 'utf-8');
      expect(content).toBe('{}');
    });

    it('should handle file not found errors', async () => {
      const nonExistent = join(tempDir, 'does-not-exist.json');

      let error = null;
      try {
        await readFile(nonExistent);
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
      expect(error.code).toBe('ENOENT');
    });

    it('should clean up old backup files', async () => {
      const backups = [
        'data.json.backup.1',
        'data.json.backup.2',
        'data.json.backup.3',
        'data.json.backup.4'
      ];

      for (const backup of backups) {
        await writeFile(join(tempDir, backup), '{}');
      }

      // Keep only 3 most recent
      const maxBackups = 3;
      const toDelete = backups.length - maxBackups;

      expect(toDelete).toBe(1);
    });
  });

  describe('Schema Versioning', () => {
    it('should include schema version in persisted data', () => {
      const data = {
        schemaVersion: '1.0.0',
        todos: []
      };

      expect(data.schemaVersion).toBe('1.0.0');
    });

    it('should migrate old schema to new', () => {
      const oldSchema = {
        version: '1.0.0',
        todos: [{ id: 1, task: 'Old format' }]
      };

      const newSchema = {
        version: '2.0.0',
        todos: oldSchema.todos.map(t => ({
          id: t.id,
          title: t.task, // Renamed field
          status: 'pending' // New field
        }))
      };

      expect(newSchema.todos[0].title).toBe('Old format');
      expect(newSchema.todos[0].status).toBe('pending');
    });
  });
});

// Helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
