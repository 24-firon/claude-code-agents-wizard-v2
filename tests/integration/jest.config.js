/**
 * Jest Configuration for Claude Code Agents Integration Tests
 *
 * This configuration sets up the test environment, coverage settings,
 * timeouts, and global setup/teardown for comprehensive integration testing.
 */

export default {
  // Use Node environment for testing
  testEnvironment: 'node',

  // Setup files to run after Jest is initialized
  setupFilesAfterEnv: ['<rootDir>/setup.js'],

  // Test file patterns
  testMatch: [
    '**/*.test.js',
    '**/__tests__/**/*.js'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/fixtures/'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    '../../.claude/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/fixtures/**',
    '!**/*.test.js'
  ],

  coverageDirectory: './coverage',

  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json'
  ],

  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Timeout settings (30 seconds default)
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Detect open handles (useful for debugging)
  detectOpenHandles: false,

  // Force exit after tests complete
  forceExit: false,

  // Maximum number of concurrent workers
  maxWorkers: '50%',

  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>'],

  // Transform settings (for ES modules)
  transform: {},

  // ES Modules support
  extensionsToTreatAsEsm: ['.js'],

  // Global setup/teardown
  globalSetup: undefined,
  globalTeardown: undefined,

  // Error on deprecated features
  errorOnDeprecated: true,

  // Notify on completion
  notify: false,

  // Fail fast (stop on first failure)
  bail: 0,

  // Colors in output
  colors: true
};
