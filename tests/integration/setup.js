/**
 * Global Test Setup for Claude Code Agents Integration Tests
 *
 * This file runs after Jest is initialized but before any tests run.
 * It sets up the test environment, initializes mocks, and provides
 * global utilities for all tests.
 */

import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { tmpdir } from 'os';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';

// Global test state
global.testState = {
  tempDirs: [],
  mockServers: [],
  cleanupFunctions: []
};

/**
 * Create a temporary directory for testing
 * Automatically cleaned up after tests
 */
global.createTempDir = async (prefix = 'claude-test-') => {
  const tempDir = await mkdtemp(join(tmpdir(), prefix));
  global.testState.tempDirs.push(tempDir);
  return tempDir;
};

/**
 * Register a cleanup function to run after tests
 */
global.registerCleanup = (cleanupFn) => {
  global.testState.cleanupFunctions.push(cleanupFn);
};

/**
 * Mock agent response helper
 */
global.mockAgentResponse = (agentName, response) => {
  return {
    agent: agentName,
    status: 'success',
    timestamp: new Date().toISOString(),
    response: response
  };
};

/**
 * Mock agent error helper
 */
global.mockAgentError = (agentName, error) => {
  return {
    agent: agentName,
    status: 'error',
    timestamp: new Date().toISOString(),
    error: error
  };
};

/**
 * Create a mock file structure
 */
global.createMockFileStructure = async (baseDir, structure) => {
  const { mkdir, writeFile } = await import('fs/promises');

  for (const [path, content] of Object.entries(structure)) {
    const fullPath = join(baseDir, path);
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));

    if (dir) {
      await mkdir(dir, { recursive: true });
    }

    if (typeof content === 'string') {
      await writeFile(fullPath, content, 'utf-8');
    }
  }
};

/**
 * Wait for a condition to be true
 */
global.waitFor = async (condition, timeout = 5000, interval = 100) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
};

/**
 * Sleep helper
 */
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Global setup - runs once before all tests
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.CI = process.env.CI || 'false';

  // Disable colors in test output if needed
  if (process.env.CI === 'true') {
    process.env.FORCE_COLOR = '0';
  }

  // Initialize test state
  global.testState.startTime = Date.now();

  console.log('🧪 Setting up integration test environment...');
});

// Global teardown - runs once after all tests
afterAll(async () => {
  console.log('🧹 Cleaning up integration test environment...');

  // Run all registered cleanup functions
  for (const cleanupFn of global.testState.cleanupFunctions) {
    try {
      await cleanupFn();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Clean up temporary directories
  for (const tempDir of global.testState.tempDirs) {
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error(`Error removing temp dir ${tempDir}:`, error);
    }
  }

  const duration = Date.now() - global.testState.startTime;
  console.log(`✅ Test suite completed in ${duration}ms`);
});

// Before each test
beforeEach(() => {
  // Clear any test-specific state
  global.testState.currentTest = expect.getState().currentTestName;
});

// After each test
afterEach(() => {
  // Clean up any test-specific resources
  global.testState.currentTest = null;
});

// Export utilities for direct import
export {
  createTempDir,
  registerCleanup,
  mockAgentResponse,
  mockAgentError,
  createMockFileStructure,
  waitFor,
  sleep
};
