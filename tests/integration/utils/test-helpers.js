/**
 * Test Helper Utilities
 *
 * Common utilities for mocking agent responses, creating fixtures,
 * cleanup helpers, and custom assertions for integration tests.
 */

import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { mkdtemp } from 'fs/promises';

/**
 * Mock Agent Response Builders
 */
export const AgentMocks = {
  /**
   * Mock successful coder agent response
   */
  coderSuccess: (filesCreated = [], filesModified = []) => ({
    agent: 'coder',
    status: 'completed',
    timestamp: new Date().toISOString(),
    result: {
      filesCreated,
      filesModified,
      summary: `Created ${filesCreated.length} files, modified ${filesModified.length} files`
    }
  }),

  /**
   * Mock coder agent error
   */
  coderError: (error, shouldEscalate = true) => ({
    agent: 'coder',
    status: 'error',
    timestamp: new Date().toISOString(),
    error: {
      message: error,
      escalated: shouldEscalate,
      escalatedTo: shouldEscalate ? 'stuck' : null
    }
  }),

  /**
   * Mock successful tester agent response
   */
  testerSuccess: (testsPassed = [], screenshots = []) => ({
    agent: 'tester',
    status: 'completed',
    timestamp: new Date().toISOString(),
    result: {
      allPassed: true,
      testsPassed,
      testsFailed: [],
      screenshots,
      summary: `All ${testsPassed.length} tests passed`
    }
  }),

  /**
   * Mock tester agent failure
   */
  testerFailure: (testsFailed = [], screenshots = []) => ({
    agent: 'tester',
    status: 'completed',
    timestamp: new Date().toISOString(),
    result: {
      allPassed: false,
      testsPassed: [],
      testsFailed,
      screenshots,
      summary: `${testsFailed.length} tests failed`,
      escalated: true,
      escalatedTo: 'stuck'
    }
  }),

  /**
   * Mock stuck agent escalation
   */
  stuckEscalation: (problem, options = []) => ({
    agent: 'stuck',
    status: 'waiting',
    timestamp: new Date().toISOString(),
    escalation: {
      problem,
      options,
      context: 'Integration test scenario'
    }
  }),

  /**
   * Mock stuck agent resolution
   */
  stuckResolution: (decision) => ({
    agent: 'stuck',
    status: 'resolved',
    timestamp: new Date().toISOString(),
    resolution: {
      decision,
      source: 'human'
    }
  }),

  /**
   * Mock researcher agent response
   */
  researcherSuccess: (findings = []) => ({
    agent: 'researcher',
    status: 'completed',
    timestamp: new Date().toISOString(),
    result: {
      findings,
      citations: findings.map((_, i) => ({ id: i, source: 'mock-source' })),
      summary: `Found ${findings.length} relevant resources`
    }
  }),

  /**
   * Mock security auditor response
   */
  securityAuditorSuccess: (vulnerabilities = []) => ({
    agent: 'security-auditor',
    status: 'completed',
    timestamp: new Date().toISOString(),
    result: {
      vulnerabilities,
      severity: vulnerabilities.length > 0 ? 'high' : 'none',
      recommendations: [],
      summary: `Found ${vulnerabilities.length} vulnerabilities`
    }
  }),

  /**
   * Mock performance optimizer response
   */
  performanceOptimizerSuccess: (metrics = {}) => ({
    agent: 'performance-optimizer',
    status: 'completed',
    timestamp: new Date().toISOString(),
    result: {
      metrics: {
        performance: 95,
        accessibility: 100,
        bestPractices: 90,
        seo: 85,
        ...metrics
      },
      suggestions: [],
      summary: 'Performance within acceptable range'
    }
  }),

  /**
   * Mock recovery agent response
   */
  recoveryAgentSuccess: (pattern, confidence) => ({
    agent: 'recovery',
    status: 'completed',
    timestamp: new Date().toISOString(),
    result: {
      pattern,
      confidence,
      action: confidence > 0.8 ? 'auto-apply' : 'suggest',
      summary: `Matched pattern with ${Math.round(confidence * 100)}% confidence`
    }
  })
};

/**
 * Fixture Creators
 */
export class FixtureCreator {
  constructor(baseDir) {
    this.baseDir = baseDir;
  }

  /**
   * Create a simple HTML project fixture
   */
  async createSimpleHtmlProject(name = 'simple-project') {
    const projectDir = join(this.baseDir, name);
    await mkdir(projectDir, { recursive: true });

    await writeFile(
      join(projectDir, 'index.html'),
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a test project.</p>
    <script src="script.js"></script>
</body>
</html>`
    );

    await writeFile(
      join(projectDir, 'styles.css'),
      `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
}`
    );

    await writeFile(
      join(projectDir, 'script.js'),
      `console.log('Test project loaded');`
    );

    return projectDir;
  }

  /**
   * Create a React project fixture
   */
  async createReactProject(name = 'react-project') {
    const projectDir = join(this.baseDir, name);
    await mkdir(join(projectDir, 'src'), { recursive: true });

    await writeFile(
      join(projectDir, 'package.json'),
      JSON.stringify({
        name: name,
        version: '1.0.0',
        type: 'module',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        }
      }, null, 2)
    );

    await writeFile(
      join(projectDir, 'src', 'App.jsx'),
      `export default function App() {
  return (
    <div className="App">
      <h1>React Test App</h1>
    </div>
  );
}`
    );

    return projectDir;
  }

  /**
   * Create a todos.json fixture
   */
  async createTodosFixture(todos = []) {
    const todosPath = join(this.baseDir, 'todos.json');
    const defaultTodos = todos.length > 0 ? todos : [
      {
        id: 1,
        title: 'Create index.html',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Add CSS styling',
        status: 'pending',
        priority: 'medium'
      }
    ];

    await writeFile(
      todosPath,
      JSON.stringify({ todos: defaultTodos }, null, 2)
    );

    return todosPath;
  }

  /**
   * Create workspace config fixture
   */
  async createWorkspaceConfig(name = 'test-workspace') {
    const configDir = join(this.baseDir, '.claude', 'workspaces', name);
    await mkdir(configDir, { recursive: true });

    const config = {
      name,
      created: new Date().toISOString(),
      settings: {
        autoTest: true,
        autoCommit: false
      }
    };

    await writeFile(
      join(configDir, 'config.json'),
      JSON.stringify(config, null, 2)
    );

    return configDir;
  }
}

/**
 * Cleanup Helpers
 */
export class CleanupHelper {
  constructor() {
    this.resources = [];
  }

  /**
   * Register a resource for cleanup
   */
  register(resource, cleanupFn) {
    this.resources.push({ resource, cleanupFn });
  }

  /**
   * Register a directory for cleanup
   */
  registerDir(dir) {
    this.register(dir, async () => {
      await rm(dir, { recursive: true, force: true });
    });
  }

  /**
   * Register a file for cleanup
   */
  registerFile(file) {
    this.register(file, async () => {
      await rm(file, { force: true });
    });
  }

  /**
   * Clean up all registered resources
   */
  async cleanup() {
    for (const { resource, cleanupFn } of this.resources) {
      try {
        await cleanupFn(resource);
      } catch (error) {
        console.error(`Failed to cleanup ${resource}:`, error);
      }
    }
    this.resources = [];
  }
}

/**
 * Custom Assertions
 */
export const CustomAssertions = {
  /**
   * Assert agent response has required fields
   */
  assertValidAgentResponse: (response) => {
    expect(response).toBeDefined();
    expect(response).toHaveProperty('agent');
    expect(response).toHaveProperty('status');
    expect(response).toHaveProperty('timestamp');
  },

  /**
   * Assert successful agent completion
   */
  assertAgentSuccess: (response, agentName) => {
    CustomAssertions.assertValidAgentResponse(response);
    expect(response.agent).toBe(agentName);
    expect(response.status).toBe('completed');
    expect(response.result).toBeDefined();
  },

  /**
   * Assert agent error with escalation
   */
  assertAgentErrorWithEscalation: (response, agentName) => {
    CustomAssertions.assertValidAgentResponse(response);
    expect(response.agent).toBe(agentName);
    expect(response.status).toBe('error');
    expect(response.error).toBeDefined();
    expect(response.error.escalated).toBe(true);
    expect(response.error.escalatedTo).toBe('stuck');
  },

  /**
   * Assert file exists and has content
   */
  assertFileExistsWithContent: async (filePath, expectedContent = null) => {
    const content = await readFile(filePath, 'utf-8');
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);

    if (expectedContent) {
      expect(content).toContain(expectedContent);
    }

    return content;
  },

  /**
   * Assert todos structure is valid
   */
  assertValidTodosStructure: (todos) => {
    expect(Array.isArray(todos)).toBe(true);
    todos.forEach(todo => {
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('status');
    });
  }
};

/**
 * Create a temporary test workspace
 */
export async function createTestWorkspace(name = 'test-workspace') {
  const tempDir = await mkdtemp(join(tmpdir(), `claude-test-${name}-`));
  const fixtureCreator = new FixtureCreator(tempDir);
  const cleanupHelper = new CleanupHelper();

  cleanupHelper.registerDir(tempDir);

  return {
    tempDir,
    fixtureCreator,
    cleanupHelper,
    async cleanup() {
      await cleanupHelper.cleanup();
    }
  };
}

/**
 * Mock HTTP server helper (using nock)
 */
export class MockHttpServer {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.nock = null;
  }

  async start() {
    const nock = (await import('nock')).default;
    this.nock = nock;
    return this;
  }

  mockEndpoint(path, method = 'GET', response = {}) {
    const scope = this.nock(this.baseUrl);
    scope[method.toLowerCase()](path).reply(200, response);
    return scope;
  }

  cleanup() {
    if (this.nock) {
      this.nock.cleanAll();
    }
  }
}

export default {
  AgentMocks,
  FixtureCreator,
  CleanupHelper,
  CustomAssertions,
  createTestWorkspace,
  MockHttpServer
};
