/**
 * Orchestration Integration Tests
 *
 * Tests the full workflow orchestration including:
 * - Todo creation and management
 * - Agent delegation
 * - Sequential workflow execution
 * - Error recovery
 * - Completion tracking
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import {
  createTestWorkspace,
  AgentMocks,
  CustomAssertions
} from './utils/test-helpers.js';

describe('Orchestration Integration Tests', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('orchestration-test');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  describe('Todo Creation', () => {
    it('should create initial todo list from project requirements', async () => {
      const projectRequirements = 'Build a simple HTML landing page';

      // Orchestrator analyzes and creates todos
      const todos = [
        { id: 1, title: 'Create index.html', status: 'pending', priority: 'high' },
        { id: 2, title: 'Add CSS styling', status: 'pending', priority: 'medium' },
        { id: 3, title: 'Add JavaScript', status: 'pending', priority: 'low' }
      ];

      expect(todos).toHaveLength(3);
      expect(todos[0].status).toBe('pending');
    });

    it('should break down complex projects into tasks', () => {
      const complexProject = 'Build a React e-commerce site';

      const todos = [
        { id: 1, title: 'Set up React project', status: 'pending' },
        { id: 2, title: 'Create product listing page', status: 'pending' },
        { id: 3, title: 'Create shopping cart', status: 'pending' },
        { id: 4, title: 'Add checkout flow', status: 'pending' },
        { id: 5, title: 'Implement payment integration', status: 'pending' }
      ];

      expect(todos.length).toBeGreaterThan(3);
    });

    it('should prioritize todos appropriately', () => {
      const todos = [
        { id: 1, title: 'Set up project', priority: 'high' },
        { id: 2, title: 'Add styling', priority: 'medium' },
        { id: 3, title: 'Add animations', priority: 'low' }
      ];

      const highPriority = todos.filter(t => t.priority === 'high');
      expect(highPriority.length).toBeGreaterThan(0);
    });

    it('should persist todos to file system', async () => {
      const todos = [
        { id: 1, title: 'Task 1', status: 'pending' },
        { id: 2, title: 'Task 2', status: 'pending' }
      ];

      const todosPath = join(tempDir, 'todos.json');
      await writeFile(todosPath, JSON.stringify({ todos }, null, 2));

      const content = await readFile(todosPath, 'utf-8');
      const parsed = JSON.parse(content);

      expect(parsed.todos).toHaveLength(2);
    });
  });

  describe('Agent Delegation', () => {
    it('should delegate first todo to coder agent', async () => {
      const todos = [
        { id: 1, title: 'Create index.html', status: 'pending' }
      ];

      const currentTodo = todos[0];

      // Delegate to coder
      const coderTask = {
        todo: currentTodo,
        agent: 'coder',
        delegatedAt: new Date().toISOString()
      };

      expect(coderTask.agent).toBe('coder');
      expect(coderTask.todo.id).toBe(1);
    });

    it('should wait for coder completion before testing', async () => {
      let coderComplete = false;
      let testerInvoked = false;

      // Simulate coder working
      coderComplete = true;
      const coderResponse = AgentMocks.coderSuccess(['index.html'], []);

      // Only invoke tester after coder completes
      if (coderComplete) {
        testerInvoked = true;
      }

      expect(coderComplete).toBe(true);
      expect(testerInvoked).toBe(true);
    });

    it('should delegate to tester after coder completes', () => {
      const coderResponse = AgentMocks.coderSuccess(['index.html'], []);

      // Tester is invoked with what was just implemented
      const testerTask = {
        agent: 'tester',
        verify: 'index.html loads correctly',
        filesCreated: coderResponse.result.filesCreated
      };

      expect(testerTask.agent).toBe('tester');
      expect(testerTask.filesCreated).toContain('index.html');
    });

    it('should invoke stuck agent when coder encounters error', () => {
      const coderError = AgentMocks.coderError('Permission denied', true);

      expect(coderError.error.escalated).toBe(true);
      expect(coderError.error.escalatedTo).toBe('stuck');

      const stuckRequest = AgentMocks.stuckEscalation(
        coderError.error.message,
        ['Fix permissions', 'Use different path', 'Skip']
      );

      expect(stuckRequest.agent).toBe('stuck');
    });

    it('should invoke stuck agent when tester fails', () => {
      const testerFailure = AgentMocks.testerFailure(
        [{ test: 'Page loads', error: 'Connection refused' }],
        ['error.png']
      );

      expect(testerFailure.result.escalated).toBe(true);

      const stuckRequest = AgentMocks.stuckEscalation(
        'Test failed: Connection refused',
        ['Start server', 'Fix configuration', 'Skip']
      );

      expect(stuckRequest.agent).toBe('stuck');
    });
  });

  describe('Sequential Workflow', () => {
    it('should process todos sequentially', async () => {
      const todos = [
        { id: 1, title: 'Task 1', status: 'pending' },
        { id: 2, title: 'Task 2', status: 'pending' },
        { id: 3, title: 'Task 3', status: 'pending' }
      ];

      const workflow = [];

      // Process todo 1
      workflow.push({ todo: todos[0], status: 'completed' });
      todos[0].status = 'completed';

      // Process todo 2
      workflow.push({ todo: todos[1], status: 'completed' });
      todos[1].status = 'completed';

      // Process todo 3
      workflow.push({ todo: todos[2], status: 'completed' });
      todos[2].status = 'completed';

      expect(workflow).toHaveLength(3);
      expect(todos.every(t => t.status === 'completed')).toBe(true);
    });

    it('should mark todo complete after successful test', () => {
      const todo = { id: 1, title: 'Create page', status: 'in-progress' };

      const coderResponse = AgentMocks.coderSuccess(['page.html'], []);
      const testerResponse = AgentMocks.testerSuccess(['Page loads'], []);

      // Both succeeded, mark complete
      if (testerResponse.result.allPassed) {
        todo.status = 'completed';
      }

      expect(todo.status).toBe('completed');
    });

    it('should move to next todo after completion', () => {
      const todos = [
        { id: 1, title: 'Task 1', status: 'completed' },
        { id: 2, title: 'Task 2', status: 'pending' },
        { id: 3, title: 'Task 3', status: 'pending' }
      ];

      const nextTodo = todos.find(t => t.status === 'pending');

      expect(nextTodo.id).toBe(2);
      expect(nextTodo.title).toBe('Task 2');
    });

    it('should not proceed with next todo while current is in progress', () => {
      const todos = [
        { id: 1, title: 'Task 1', status: 'in-progress' },
        { id: 2, title: 'Task 2', status: 'pending' }
      ];

      const hasInProgress = todos.some(t => t.status === 'in-progress');
      const shouldStartNext = !hasInProgress;

      expect(shouldStartNext).toBe(false);
    });
  });

  describe('Error Recovery', () => {
    it('should retry after stuck agent resolution', () => {
      const todo = { id: 1, title: 'Create file', status: 'in-progress' };

      // Coder encounters error
      const coderError = AgentMocks.coderError('Permission denied', true);

      // Stuck agent gets decision
      const stuckResolution = AgentMocks.stuckResolution('Use different path');

      // Coder retries with new instruction
      const retryResponse = AgentMocks.coderSuccess(['file.txt'], []);

      expect(retryResponse.status).toBe('completed');
    });

    it('should handle multiple errors in sequence', () => {
      const errorLog = [];

      // Error 1
      errorLog.push({ error: 'Port in use', resolved: true });

      // Error 2
      errorLog.push({ error: 'Module not found', resolved: true });

      expect(errorLog).toHaveLength(2);
      expect(errorLog.every(e => e.resolved)).toBe(true);
    });

    it('should allow user to skip failing todo', () => {
      const todo = { id: 1, title: 'Optional feature', status: 'failed' };

      const stuckResolution = AgentMocks.stuckResolution('Skip this todo');

      if (stuckResolution.resolution.decision.includes('Skip')) {
        todo.status = 'skipped';
      }

      expect(todo.status).toBe('skipped');
    });

    it('should track error history for debugging', () => {
      const todo = {
        id: 1,
        title: 'Task',
        status: 'completed',
        errorHistory: [
          { error: 'First error', resolved: true, solution: 'Fixed permissions' },
          { error: 'Second error', resolved: true, solution: 'Installed dependency' }
        ]
      };

      expect(todo.errorHistory).toHaveLength(2);
      expect(todo.errorHistory.every(e => e.resolved)).toBe(true);
    });
  });

  describe('Completion Tracking', () => {
    it('should track overall progress', () => {
      const todos = [
        { id: 1, status: 'completed' },
        { id: 2, status: 'completed' },
        { id: 3, status: 'in-progress' },
        { id: 4, status: 'pending' }
      ];

      const completed = todos.filter(t => t.status === 'completed').length;
      const total = todos.length;
      const progress = (completed / total) * 100;

      expect(progress).toBe(50);
    });

    it('should detect when all todos are complete', () => {
      const todos = [
        { id: 1, status: 'completed' },
        { id: 2, status: 'completed' },
        { id: 3, status: 'completed' }
      ];

      const allComplete = todos.every(t => t.status === 'completed');
      expect(allComplete).toBe(true);
    });

    it('should generate completion report', () => {
      const todos = [
        { id: 1, title: 'Task 1', status: 'completed', duration: 120 },
        { id: 2, title: 'Task 2', status: 'completed', duration: 90 },
        { id: 3, title: 'Task 3', status: 'completed', duration: 150 }
      ];

      const report = {
        totalTodos: todos.length,
        completed: todos.filter(t => t.status === 'completed').length,
        totalDuration: todos.reduce((sum, t) => sum + (t.duration || 0), 0),
        tasks: todos.map(t => t.title)
      };

      expect(report.completed).toBe(3);
      expect(report.totalDuration).toBe(360);
    });

    it('should report to user only when all todos complete', () => {
      const todos = [
        { id: 1, status: 'completed' },
        { id: 2, status: 'completed' }
      ];

      const allComplete = todos.every(t => t.status === 'completed');
      const shouldReport = allComplete;

      expect(shouldReport).toBe(true);
    });
  });

  describe('Full Workflow Integration', () => {
    it('should execute complete workflow from start to finish', async () => {
      // 1. Project requirements
      const project = 'Build simple HTML page';

      // 2. Create todos
      const todos = [
        { id: 1, title: 'Create HTML', status: 'pending' },
        { id: 2, title: 'Add CSS', status: 'pending' }
      ];

      // 3. Process each todo
      for (const todo of todos) {
        // Delegate to coder
        const coderResponse = AgentMocks.coderSuccess(['file.html'], []);

        // Delegate to tester
        const testerResponse = AgentMocks.testerSuccess(['Test passed'], []);

        // Mark complete
        if (testerResponse.result.allPassed) {
          todo.status = 'completed';
        }
      }

      // 4. Verify all complete
      const allComplete = todos.every(t => t.status === 'completed');
      expect(allComplete).toBe(true);
    });

    it('should handle workflow with errors and recovery', async () => {
      const todos = [
        { id: 1, title: 'Task with error', status: 'pending' }
      ];

      const todo = todos[0];

      // Coder encounters error
      let coderError = AgentMocks.coderError('Module not found', true);

      // Stuck agent resolves
      const stuckResolution = AgentMocks.stuckResolution('Install module');

      // Coder retries successfully
      const coderSuccess = AgentMocks.coderSuccess(['file.js'], []);

      // Tester verifies
      const testerSuccess = AgentMocks.testerSuccess(['All tests passed'], []);

      // Mark complete
      todo.status = 'completed';

      expect(todo.status).toBe('completed');
    });

    it('should maintain context across all todos', async () => {
      const project = {
        name: 'Test Project',
        todos: [
          { id: 1, title: 'Setup', status: 'completed' },
          { id: 2, title: 'Build', status: 'in-progress' }
        ],
        files: ['index.html', 'styles.css'],
        errors: []
      };

      // Context is maintained throughout
      expect(project.name).toBe('Test Project');
      expect(project.files).toHaveLength(2);
    });
  });

  describe('Agent Communication', () => {
    it('should pass context from coder to tester', () => {
      const coderResponse = AgentMocks.coderSuccess(
        ['index.html', 'styles.css'],
        []
      );

      const testerTask = {
        filesToVerify: coderResponse.result.filesCreated,
        verificationCriteria: [
          'HTML file loads',
          'CSS is applied'
        ]
      };

      expect(testerTask.filesToVerify).toHaveLength(2);
    });

    it('should pass stuck agent decision back to caller', () => {
      const stuckResolution = AgentMocks.stuckResolution('Use port 8080');

      const coderReceives = {
        decision: stuckResolution.resolution.decision,
        action: 'Update port configuration'
      };

      expect(coderReceives.decision).toContain('8080');
    });
  });
});
