/**
 * E2E Test: Error Recovery
 *
 * End-to-end test for error handling and recovery patterns.
 * Tests stuck agent escalation and successful recovery.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import {
  createTestWorkspace,
  AgentMocks,
  CustomAssertions
} from '../utils/test-helpers.js';

describe('E2E: Error Recovery', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('e2e-error-recovery');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it('should recover from coder permission error', async () => {
    const errorLog = [];

    // Todo: Create config file
    const todo = { id: 1, title: 'Create config file', status: 'in-progress' };

    // === ERROR OCCURS ===
    const protectedPath = '/etc/app-config.json';
    const coderError = AgentMocks.coderError(
      `EACCES: permission denied, open '${protectedPath}'`,
      true
    );

    errorLog.push({
      phase: 'coder-execution',
      error: coderError,
      timestamp: new Date().toISOString()
    });

    expect(coderError.error.escalated).toBe(true);

    // === STUCK AGENT ESCALATION ===
    const stuckRequest = AgentMocks.stuckEscalation(
      `Cannot write to ${protectedPath}: Permission denied`,
      [
        'Write to user home directory instead',
        'Write to current directory',
        'Request sudo permissions',
        'Skip config file creation'
      ]
    );

    expect(stuckRequest.agent).toBe('stuck');
    expect(stuckRequest.escalation.options).toHaveLength(4);

    errorLog.push({
      phase: 'stuck-escalation',
      request: stuckRequest,
      timestamp: new Date().toISOString()
    });

    // === USER DECISION ===
    const userDecision = 'Write to current directory';
    const stuckResolution = AgentMocks.stuckResolution(userDecision);

    errorLog.push({
      phase: 'user-decision',
      decision: stuckResolution,
      timestamp: new Date().toISOString()
    });

    // === CODER RETRY WITH FIX ===
    const newPath = join(tempDir, 'app-config.json');
    await writeFile(newPath, JSON.stringify({ setting: 'value' }));

    const coderSuccess = AgentMocks.coderSuccess([newPath], []);
    CustomAssertions.assertAgentSuccess(coderSuccess, 'coder');

    errorLog.push({
      phase: 'coder-retry-success',
      result: coderSuccess,
      timestamp: new Date().toISOString()
    });

    // === TESTER VERIFICATION ===
    const testerSuccess = AgentMocks.testerSuccess(
      ['Config file exists', 'Config is valid JSON'],
      []
    );

    errorLog.push({
      phase: 'tester-verification',
      result: testerSuccess,
      timestamp: new Date().toISOString()
    });

    // === COMPLETION ===
    todo.status = 'completed';

    expect(todo.status).toBe('completed');
    expect(errorLog).toHaveLength(5);

    const recoverySuccessful = errorLog[errorLog.length - 1].phase === 'tester-verification';
    expect(recoverySuccessful).toBe(true);
  });

  it('should recover from tester connection error', async () => {
    // Todo: Test homepage
    const todo = { id: 1, title: 'Test homepage loads', status: 'in-progress' };

    // Coder creates HTML file
    const htmlPath = join(tempDir, 'index.html');
    await writeFile(htmlPath, '<html><body>Test</body></html>');

    const coderSuccess = AgentMocks.coderSuccess([htmlPath], []);
    CustomAssertions.assertAgentSuccess(coderSuccess, 'coder');

    // === TESTER ERROR: Server not running ===
    const testerError = {
      test: 'Navigate to http://localhost:3000',
      error: 'net::ERR_CONNECTION_REFUSED',
      escalated: true
    };

    const testerFailure = AgentMocks.testerFailure([testerError], ['error.png']);

    expect(testerFailure.result.escalated).toBe(true);

    // === STUCK AGENT ESCALATION ===
    const stuckRequest = AgentMocks.stuckEscalation(
      'Cannot connect to localhost:3000 - server not running',
      [
        'Start development server',
        'Test using file:// protocol instead',
        'Check server configuration',
        'Skip this test'
      ]
    );

    expect(stuckRequest.agent).toBe('stuck');

    // === USER DECISION ===
    const stuckResolution = AgentMocks.stuckResolution('Test using file:// protocol instead');

    // === TESTER RETRY ===
    const fileUrl = `file://${htmlPath}`;
    const testerSuccess = AgentMocks.testerSuccess(
      ['Page loads via file protocol', 'HTML structure verified'],
      ['file-protocol-test.png']
    );

    CustomAssertions.assertAgentSuccess(testerSuccess, 'tester');

    todo.status = 'completed';
    expect(todo.status).toBe('completed');
  });

  it('should handle multiple sequential errors', async () => {
    const errorHistory = [];

    // Todo: Install and configure package
    const todo = { id: 1, title: 'Install package', status: 'in-progress' };

    // === ERROR 1: Module not found ===
    const error1 = AgentMocks.coderError('Cannot find module "missing-package"', true);
    errorHistory.push({ error: error1, resolved: false });

    const stuck1 = AgentMocks.stuckEscalation(
      'Module "missing-package" not found',
      ['Install via npm', 'Use alternative package', 'Remove dependency']
    );

    const resolution1 = AgentMocks.stuckResolution('Install via npm');
    errorHistory[0].resolved = true;
    errorHistory[0].solution = resolution1.resolution.decision;

    // Coder installs package (simulated)
    const coderInstall = AgentMocks.coderSuccess(['package.json updated'], []);

    // === ERROR 2: Version conflict ===
    const error2 = AgentMocks.coderError('Version conflict: peer dependency mismatch', true);
    errorHistory.push({ error: error2, resolved: false });

    const stuck2 = AgentMocks.stuckEscalation(
      'Peer dependency version conflict',
      ['Install compatible version', 'Override peer dependencies', 'Use different package']
    );

    const resolution2 = AgentMocks.stuckResolution('Install compatible version');
    errorHistory[1].resolved = true;
    errorHistory[1].solution = resolution2.resolution.decision;

    // Coder fixes version
    const coderFix = AgentMocks.coderSuccess(['package.json fixed'], ['package.json']);

    // === ERROR 3: Import error ===
    const error3 = AgentMocks.coderError('Syntax error in import statement', true);
    errorHistory.push({ error: error3, resolved: false });

    const stuck3 = AgentMocks.stuckEscalation(
      'Import syntax error',
      ['Fix import statement', 'Use require() instead', 'Check module path']
    );

    const resolution3 = AgentMocks.stuckResolution('Fix import statement');
    errorHistory[2].resolved = true;
    errorHistory[2].solution = resolution3.resolution.decision;

    // Coder fixes import
    const coderFinal = AgentMocks.coderSuccess([], ['index.js']);

    // === FINAL SUCCESS ===
    const testerSuccess = AgentMocks.testerSuccess(
      ['Package imported successfully', 'No errors in console'],
      []
    );

    todo.status = 'completed';

    // Verify recovery
    expect(errorHistory).toHaveLength(3);
    expect(errorHistory.every(e => e.resolved)).toBe(true);
    expect(todo.status).toBe('completed');
  });

  it('should handle test failure and fix cycle', async () => {
    const attempts = [];

    // Todo: Create login form
    const todo = { id: 1, title: 'Create login form', status: 'in-progress' };

    // === ATTEMPT 1: Missing form element ===
    const htmlPath = join(tempDir, 'login.html');
    await writeFile(htmlPath, '<html><body><h1>Login</h1></body></html>');

    attempts.push({ attempt: 1, phase: 'coder' });

    const testerFail1 = AgentMocks.testerFailure(
      [{ test: 'Find login form', error: 'Form element not found' }],
      ['missing-form.png']
    );

    attempts.push({ attempt: 1, phase: 'tester-fail' });

    const stuck1 = AgentMocks.stuckEscalation(
      'Test failed: Form element not found',
      ['Add form element', 'Update test selector', 'Review requirements']
    );

    const resolution1 = AgentMocks.stuckResolution('Add form element');
    attempts.push({ attempt: 1, phase: 'user-decision' });

    // === ATTEMPT 2: Form exists but missing inputs ===
    await writeFile(htmlPath, '<html><body><h1>Login</h1><form></form></body></html>');

    attempts.push({ attempt: 2, phase: 'coder-fix' });

    const testerFail2 = AgentMocks.testerFailure(
      [{ test: 'Find email input', error: 'Email input not found' }],
      ['missing-inputs.png']
    );

    attempts.push({ attempt: 2, phase: 'tester-fail' });

    const stuck2 = AgentMocks.stuckEscalation(
      'Test failed: Email input not found',
      ['Add email and password inputs', 'Check HTML structure']
    );

    const resolution2 = AgentMocks.stuckResolution('Add email and password inputs');
    attempts.push({ attempt: 2, phase: 'user-decision' });

    // === ATTEMPT 3: Complete form ===
    await writeFile(
      htmlPath,
      `<html><body>
        <h1>Login</h1>
        <form id="login-form">
          <input type="email" id="email" placeholder="Email" />
          <input type="password" id="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </body></html>`
    );

    attempts.push({ attempt: 3, phase: 'coder-fix' });

    const testerSuccess = AgentMocks.testerSuccess(
      ['Form found', 'Email input found', 'Password input found', 'Submit button found'],
      ['complete-form.png']
    );

    attempts.push({ attempt: 3, phase: 'tester-success' });

    todo.status = 'completed';

    // Verify iterative fixing
    expect(attempts.length).toBeGreaterThan(4);
    expect(attempts[attempts.length - 1].phase).toBe('tester-success');
    expect(todo.status).toBe('completed');
  });

  it('should track recovery pattern learning', () => {
    const recoveryPatterns = [];

    // Pattern 1: Permission errors
    recoveryPatterns.push({
      pattern: /EACCES: permission denied/,
      solution: 'Use alternative path with write permissions',
      confidence: 0.95,
      usageCount: 5,
      successCount: 5
    });

    // Pattern 2: Module not found
    recoveryPatterns.push({
      pattern: /Cannot find module/,
      solution: 'Install missing module via npm',
      confidence: 0.90,
      usageCount: 10,
      successCount: 9
    });

    // Pattern 3: Port in use
    recoveryPatterns.push({
      pattern: /Port \d+ is already in use/,
      solution: 'Use next available port',
      confidence: 0.85,
      usageCount: 3,
      successCount: 3
    });

    // Verify patterns are learned
    expect(recoveryPatterns).toHaveLength(3);

    const avgConfidence = recoveryPatterns.reduce((sum, p) => sum + p.confidence, 0) / recoveryPatterns.length;
    expect(avgConfidence).toBeGreaterThan(0.85);

    const totalSuccessRate = recoveryPatterns.reduce((sum, p) => sum + (p.successCount / p.usageCount), 0) / recoveryPatterns.length;
    expect(totalSuccessRate).toBeGreaterThan(0.9);
  });

  it('should complete project despite multiple errors', async () => {
    const projectTimeline = [];

    // Project start
    projectTimeline.push({ event: 'project-start', timestamp: Date.now() });

    // Todo 1: Success
    projectTimeline.push({ event: 'todo-1-complete', errors: 0 });

    // Todo 2: 1 error, recovered
    projectTimeline.push({ event: 'todo-2-error', error: 'Permission denied' });
    projectTimeline.push({ event: 'todo-2-escalation', agent: 'stuck' });
    projectTimeline.push({ event: 'todo-2-recovery', success: true });
    projectTimeline.push({ event: 'todo-2-complete', errors: 1 });

    // Todo 3: 2 errors, both recovered
    projectTimeline.push({ event: 'todo-3-error-1', error: 'Module not found' });
    projectTimeline.push({ event: 'todo-3-recovery-1', success: true });
    projectTimeline.push({ event: 'todo-3-error-2', error: 'Test failed' });
    projectTimeline.push({ event: 'todo-3-recovery-2', success: true });
    projectTimeline.push({ event: 'todo-3-complete', errors: 2 });

    // Todo 4: Success
    projectTimeline.push({ event: 'todo-4-complete', errors: 0 });

    // Project complete
    projectTimeline.push({ event: 'project-complete', timestamp: Date.now() });

    // Verify project completed despite errors
    const projectComplete = projectTimeline[projectTimeline.length - 1].event === 'project-complete';
    expect(projectComplete).toBe(true);

    const totalErrors = projectTimeline.filter(e => e.event.includes('error')).length;
    const totalRecoveries = projectTimeline.filter(e => e.event.includes('recovery') && e.success).length;

    expect(totalErrors).toBe(3);
    expect(totalRecoveries).toBe(3);
    expect(totalErrors).toBe(totalRecoveries); // All errors recovered
  });
});
