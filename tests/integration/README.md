# Integration Test Suite

Comprehensive integration test suite for the Claude Code Agents Wizard orchestration system.

## Overview

This test suite provides complete coverage for all agents, orchestration workflows, and end-to-end scenarios. Tests verify that the agent system works correctly from requirements to deployment.

## Test Structure

```
tests/integration/
├── test-coder-agent.test.js          # Coder agent tests
├── test-tester-agent.test.js         # Tester agent tests
├── test-stuck-agent.test.js          # Stuck agent tests
├── test-researcher-agent.test.js     # Researcher agent tests
├── test-security-auditor.test.js     # Security auditor tests
├── test-performance-optimizer.test.js # Performance optimizer tests
├── test-recovery-agent.test.js       # Recovery agent tests
├── test-orchestration.test.js        # Orchestration workflow tests
├── test-workspace-switching.test.js  # Workspace management tests
├── test-persistence.test.js          # Data persistence tests
├── test-metrics.test.js              # Metrics collection tests
├── e2e/
│   ├── simple-project.test.js        # E2E: Simple HTML project
│   ├── react-app.test.js             # E2E: React application
│   └── error-recovery.test.js        # E2E: Error handling
├── utils/
│   └── test-helpers.js               # Test utilities
├── fixtures/
│   ├── sample-todos.json             # Sample todo data
│   ├── sample-project.html           # Sample HTML project
│   └── mock-agent-responses.json     # Mock agent responses
├── package.json                      # Test dependencies
├── jest.config.js                    # Jest configuration
├── setup.js                          # Global test setup
└── README.md                         # This file
```

## Running Tests

### Install Dependencies

```bash
cd tests/integration
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run with Coverage

```bash
npm run test:coverage
```

### Run Specific Test Suites

```bash
# Run only agent tests
npm run test:agents

# Run only E2E tests
npm run test:e2e

# Run only orchestration tests
npm run test:orchestration

# Run specific test file
npm test test-coder-agent.test.js
```

### Run in CI Mode

```bash
npm run test:ci
```

## Test Categories

### Agent Tests

Tests for individual agent functionality:

#### Coder Agent (`test-coder-agent.test.js`)
- File creation
- File editing
- Multi-file operations
- Error handling
- Stuck agent invocation
- Completion reporting

#### Tester Agent (`test-tester-agent.test.js`)
- Playwright integration
- Screenshot capture
- Visual verification
- Form testing
- Interaction testing
- Failure detection
- Stuck escalation

#### Stuck Agent (`test-stuck-agent.test.js`)
- Human escalation
- Question formatting
- Option presentation
- Decision relay
- Context preservation

#### Researcher Agent (`test-researcher-agent.test.js`)
- Web search functionality
- Documentation fetching
- Information synthesis
- Citation tracking

#### Security Auditor (`test-security-auditor.test.js`)
- Vulnerability detection
- OWASP compliance checks
- Dependency scanning
- Security report generation

#### Performance Optimizer (`test-performance-optimizer.test.js`)
- Lighthouse integration
- Bundle size analysis
- Optimization suggestions
- Performance metrics

#### Recovery Agent (`test-recovery-agent.test.js`)
- Error pattern matching
- Confidence scoring
- Escalation logic
- Pattern learning

### Orchestration Tests

Tests for workflow orchestration (`test-orchestration.test.js`):
- Todo creation and management
- Agent delegation
- Sequential workflow execution
- Error recovery
- Completion tracking
- Agent communication

### System Tests

#### Workspace Management (`test-workspace-switching.test.js`)
- Workspace creation
- Workspace switching
- Workspace isolation
- Configuration loading

#### Data Persistence (`test-persistence.test.js`)
- Todo persistence
- Metadata updates
- Concurrent access handling
- Data integrity
- File system operations

#### Metrics Collection (`test-metrics.test.js`)
- Metric collection
- Data aggregation
- Session tracking
- Statistics calculation
- Performance metrics

### End-to-End Tests

Complete workflow tests from requirements to deployment:

#### Simple Project (`e2e/simple-project.test.js`)
- Create simple HTML landing page
- Full workflow validation
- All agents invoked correctly
- Error handling and recovery
- Final output verification

#### React App (`e2e/react-app.test.js`)
- Complete React todo app
- Component hierarchy
- State management
- Styling
- Testing phases
- Deployment readiness

#### Error Recovery (`e2e/error-recovery.test.js`)
- Permission errors
- Connection errors
- Multiple sequential errors
- Test failure and fix cycles
- Recovery pattern learning
- Project completion despite errors

## Test Utilities

### `test-helpers.js`

Provides common utilities for all tests:

#### AgentMocks
Mock agent responses for testing:
```javascript
import { AgentMocks } from './utils/test-helpers.js';

// Mock successful coder response
const response = AgentMocks.coderSuccess(['file.js'], []);

// Mock coder error
const error = AgentMocks.coderError('Permission denied', true);

// Mock tester success
const testResult = AgentMocks.testerSuccess(['Test passed'], ['screenshot.png']);

// Mock stuck escalation
const escalation = AgentMocks.stuckEscalation('Problem', ['Option 1', 'Option 2']);
```

#### FixtureCreator
Create test fixtures:
```javascript
import { createTestWorkspace } from './utils/test-helpers.js';

const workspace = await createTestWorkspace('test-name');
const projectDir = await workspace.fixtureCreator.createSimpleHtmlProject();
await workspace.cleanup();
```

#### CustomAssertions
Specialized assertions:
```javascript
import { CustomAssertions } from './utils/test-helpers.js';

// Assert valid agent response
CustomAssertions.assertValidAgentResponse(response);

// Assert agent success
CustomAssertions.assertAgentSuccess(response, 'coder');

// Assert file exists with content
await CustomAssertions.assertFileExistsWithContent(filePath, 'expected content');
```

## Writing New Tests

### Test Template

```javascript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createTestWorkspace, AgentMocks } from './utils/test-helpers.js';

describe('My Test Suite', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('my-test');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it('should test something', async () => {
    // Your test code here
    expect(true).toBe(true);
  });
});
```

### Best Practices

1. **Use descriptive test names**: Test names should clearly describe what is being tested
2. **Clean up resources**: Always use `workspace.cleanup()` in `afterEach`
3. **Test one thing**: Each test should verify one specific behavior
4. **Use test helpers**: Leverage the provided utilities for consistency
5. **Mock agent responses**: Use `AgentMocks` for predictable tests
6. **Verify error paths**: Test both success and failure scenarios
7. **Check escalations**: Verify stuck agent is invoked appropriately

## Coverage Goals

Target coverage thresholds (configured in `jest.config.js`):

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Continuous Integration

Tests are designed to run in CI environments:

```bash
# CI mode with coverage and limited workers
npm run test:ci
```

CI-specific features:
- Deterministic output (no colors)
- Coverage reports
- Limited concurrent workers
- Proper exit codes

## Debugging Tests

### Verbose Output

```bash
npm run test:verbose
```

### Run Single Test

```bash
npm test -- --testNamePattern="should create a simple HTML file"
```

### Debug with Node Inspector

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open Chrome DevTools at `chrome://inspect`

## Fixtures

Test fixtures are located in `fixtures/`:

- **sample-todos.json**: Example todo list structure
- **sample-project.html**: Simple HTML project for testing
- **mock-agent-responses.json**: Sample agent response formats

## Contributing

When adding new tests:

1. Place agent tests in the root `tests/integration/` directory
2. Place E2E tests in `tests/integration/e2e/`
3. Add shared utilities to `tests/integration/utils/test-helpers.js`
4. Add test fixtures to `tests/integration/fixtures/`
5. Update this README with new test descriptions
6. Ensure tests pass with `npm test`
7. Verify coverage meets thresholds with `npm run test:coverage`

## Troubleshooting

### Tests Timeout

Increase timeout in test:
```javascript
it('long running test', async () => {
  // Test code
}, 60000); // 60 second timeout
```

### Permission Errors

Ensure temp directories are writable and cleaned up properly.

### Mock Data Issues

Verify mock data matches actual agent response formats in production.

## License

MIT - Same as main project

## Questions?

For questions or issues with the test suite, please open an issue in the main repository.
