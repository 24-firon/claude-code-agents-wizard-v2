/**
 * Stuck Agent Integration Tests
 *
 * Tests the stuck agent's ability to:
 * - Handle human escalation
 * - Format questions clearly
 * - Present options to the user
 * - Relay decisions back to calling agent
 */

import { describe, it, expect } from '@jest/globals';
import { AgentMocks, CustomAssertions } from './utils/test-helpers.js';

describe('Stuck Agent Integration Tests', () => {
  describe('Human Escalation', () => {
    it('should escalate with clear problem description', () => {
      const problem = 'Cannot find dependency "react" in package.json';

      const escalation = AgentMocks.stuckEscalation(problem, [
        'Install react via npm',
        'Add react to package.json manually',
        'Use a different framework'
      ]);

      expect(escalation.escalation.problem).toBe(problem);
      expect(escalation.agent).toBe('stuck');
      expect(escalation.status).toBe('waiting');
    });

    it('should include context about where error occurred', () => {
      const escalation = AgentMocks.stuckEscalation(
        'File not found: config.json',
        ['Create default config', 'Skip configuration', 'Ask user for path']
      );

      escalation.escalation.context = {
        agent: 'coder',
        operation: 'read configuration',
        file: 'config.json'
      };

      expect(escalation.escalation.context).toBeDefined();
      expect(escalation.escalation.context.agent).toBe('coder');
    });

    it('should escalate from coder agent', () => {
      const coderError = AgentMocks.coderError(
        'Permission denied writing to /etc/app.conf',
        true
      );

      expect(coderError.error.escalated).toBe(true);
      expect(coderError.error.escalatedTo).toBe('stuck');

      // Stuck agent receives this
      const stuckRequest = AgentMocks.stuckEscalation(
        coderError.error.message,
        [
          'Write to user directory instead',
          'Request sudo permissions',
          'Skip configuration file'
        ]
      );

      expect(stuckRequest.agent).toBe('stuck');
    });

    it('should escalate from tester agent', () => {
      const testerFailure = AgentMocks.testerFailure(
        [{ test: 'Homepage loads', error: 'Connection refused' }],
        ['error.png']
      );

      expect(testerFailure.result.escalated).toBe(true);

      const stuckRequest = AgentMocks.stuckEscalation(
        'Test failed: Connection refused',
        [
          'Start development server',
          'Check server configuration',
          'Skip this test'
        ]
      );

      expect(stuckRequest.escalation.problem).toContain('Connection refused');
    });
  });

  describe('Question Formatting', () => {
    it('should format question clearly', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Image file "hero.jpg" not found. How should I proceed?',
        [
          'Use a placeholder image',
          'Download from Unsplash',
          'Skip the image'
        ]
      );

      const question = escalation.escalation.problem;
      expect(question).toContain('Image file "hero.jpg" not found');
      expect(question).toContain('How should I proceed');
    });

    it('should highlight the specific issue', () => {
      const problem = 'Port 3000 is already in use by another process';

      const escalation = AgentMocks.stuckEscalation(problem, [
        'Use port 3001 instead',
        'Kill process on port 3000',
        'Find available port automatically'
      ]);

      expect(escalation.escalation.problem).toContain('Port 3000');
      expect(escalation.escalation.problem).toContain('already in use');
    });

    it('should avoid technical jargon when possible', () => {
      // Good: Clear problem statement
      const goodProblem = 'The website cannot connect to the database';

      // Bad: Too technical
      const badProblem = 'ECONNREFUSED 127.0.0.1:5432 postgresql';

      const escalation = AgentMocks.stuckEscalation(goodProblem, [
        'Start the database server',
        'Check database credentials',
        'Use a different database'
      ]);

      expect(escalation.escalation.problem).not.toContain('ECONNREFUSED');
      expect(escalation.escalation.problem).toContain('cannot connect');
    });

    it('should include relevant error details', () => {
      const errorDetails = {
        operation: 'npm install',
        package: 'some-package',
        error: 'Package not found'
      };

      const problem = `Failed to install "${errorDetails.package}": ${errorDetails.error}`;

      const escalation = AgentMocks.stuckEscalation(problem, [
        'Check package name spelling',
        'Try a different version',
        'Use alternative package'
      ]);

      expect(escalation.escalation.problem).toContain('some-package');
      expect(escalation.escalation.problem).toContain('Package not found');
    });
  });

  describe('Option Presentation', () => {
    it('should provide clear options to user', () => {
      const escalation = AgentMocks.stuckEscalation(
        'CSS framework not specified',
        [
          'Use Tailwind CSS',
          'Use Bootstrap',
          'Use vanilla CSS',
          'Ask user for preference'
        ]
      );

      expect(escalation.escalation.options).toHaveLength(4);
      escalation.escalation.options.forEach(option => {
        expect(option).toBeDefined();
        expect(typeof option).toBe('string');
        expect(option.length).toBeGreaterThan(0);
      });
    });

    it('should order options by recommended action first', () => {
      const options = [
        'Create missing file (recommended)',
        'Skip this step',
        'Use different file'
      ];

      const escalation = AgentMocks.stuckEscalation(
        'Configuration file missing',
        options
      );

      expect(escalation.escalation.options[0]).toContain('recommended');
    });

    it('should provide actionable options', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Build failed: TypeScript errors found',
        [
          'Fix TypeScript errors automatically',
          'Switch to JavaScript',
          'Show me the errors to fix manually'
        ]
      );

      escalation.escalation.options.forEach(option => {
        // Each option should start with a verb (action)
        const startsWithVerb = /^(Fix|Switch|Show|Create|Install|Use|Skip|Ask)/.test(option);
        expect(startsWithVerb).toBe(true);
      });
    });

    it('should include "ask user" as option when appropriate', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Unclear which database to use',
        [
          'Use PostgreSQL',
          'Use MySQL',
          'Use SQLite',
          'Ask user which database they prefer'
        ]
      );

      const hasAskOption = escalation.escalation.options.some(
        opt => opt.toLowerCase().includes('ask user')
      );

      expect(hasAskOption).toBe(true);
    });

    it('should limit options to reasonable number', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Multiple solutions available',
        [
          'Option 1',
          'Option 2',
          'Option 3',
          'Option 4'
        ]
      );

      // Should have 2-5 options (not too many)
      expect(escalation.escalation.options.length).toBeGreaterThanOrEqual(2);
      expect(escalation.escalation.options.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Decision Relay', () => {
    it('should capture user decision', () => {
      const userDecision = 'Use Tailwind CSS';

      const resolution = AgentMocks.stuckResolution(userDecision);

      expect(resolution.resolution.decision).toBe(userDecision);
      expect(resolution.status).toBe('resolved');
    });

    it('should relay decision back to calling agent', () => {
      // User makes decision
      const userChoice = 'Install react via npm';

      const resolution = AgentMocks.stuckResolution(userChoice);

      // Stuck agent returns this to coder
      expect(resolution.resolution.decision).toBe(userChoice);
      expect(resolution.resolution.source).toBe('human');

      // Coder receives and acts on decision
      const coderAction = {
        action: 'install-package',
        package: 'react',
        source: resolution.resolution.decision
      };

      expect(coderAction.action).toBe('install-package');
    });

    it('should mark resolution as human-approved', () => {
      const resolution = AgentMocks.stuckResolution('Proceed with option 1');

      expect(resolution.resolution.source).toBe('human');
      expect(resolution.status).toBe('resolved');
    });

    it('should include timestamp of decision', () => {
      const resolution = AgentMocks.stuckResolution('Use placeholder image');

      expect(resolution.timestamp).toBeDefined();
      const timestamp = new Date(resolution.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
    });

    it('should handle user providing custom solution', () => {
      const customSolution = 'Use port 8080 instead of 3000';

      const resolution = AgentMocks.stuckResolution(customSolution);

      expect(resolution.resolution.decision).toBe(customSolution);

      // This custom solution goes back to the agent
      const agentReceives = resolution.resolution.decision;
      expect(agentReceives).toContain('port 8080');
    });
  });

  describe('Agent Response Format', () => {
    it('should follow standard agent response format', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Problem description',
        ['Option 1', 'Option 2']
      );

      CustomAssertions.assertValidAgentResponse(escalation);
      expect(escalation.agent).toBe('stuck');
    });

    it('should have waiting status during escalation', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Waiting for user input',
        ['Yes', 'No']
      );

      expect(escalation.status).toBe('waiting');
    });

    it('should have resolved status after decision', () => {
      const resolution = AgentMocks.stuckResolution('Yes');

      expect(resolution.status).toBe('resolved');
      expect(resolution.agent).toBe('stuck');
    });
  });

  describe('Context Preservation', () => {
    it('should preserve calling agent context', () => {
      const escalation = AgentMocks.stuckEscalation(
        'File operation failed',
        ['Retry', 'Skip', 'Change path']
      );

      escalation.escalation.callingAgent = 'coder';
      escalation.escalation.operation = 'write file';
      escalation.escalation.targetPath = '/path/to/file.js';

      expect(escalation.escalation.callingAgent).toBe('coder');
      expect(escalation.escalation.operation).toBe('write file');
    });

    it('should preserve error stack for debugging', () => {
      const error = new Error('Permission denied');
      error.stack = 'Error: Permission denied\n  at ...';

      const escalation = AgentMocks.stuckEscalation(
        error.message,
        ['Request permissions', 'Use different location']
      );

      escalation.escalation.errorStack = error.stack;

      expect(escalation.escalation.errorStack).toContain('Permission denied');
    });

    it('should include relevant file paths', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Cannot find imported module',
        ['Install module', 'Check import path', 'Use different module']
      );

      escalation.escalation.filePath = '/src/components/App.jsx';
      escalation.escalation.importPath = './utils/helpers';

      expect(escalation.escalation.filePath).toBeDefined();
      expect(escalation.escalation.importPath).toBeDefined();
    });
  });

  describe('Multiple Escalations', () => {
    it('should handle sequential escalations', () => {
      const escalation1 = AgentMocks.stuckEscalation(
        'First problem',
        ['Option A', 'Option B']
      );

      const resolution1 = AgentMocks.stuckResolution('Option A');

      // After resolution, another issue
      const escalation2 = AgentMocks.stuckEscalation(
        'Second problem',
        ['Option C', 'Option D']
      );

      expect(escalation1.escalation.problem).toBe('First problem');
      expect(resolution1.resolution.decision).toBe('Option A');
      expect(escalation2.escalation.problem).toBe('Second problem');
    });

    it('should track escalation history', () => {
      const history = [];

      // First escalation
      const esc1 = AgentMocks.stuckEscalation('Issue 1', ['Fix', 'Skip']);
      history.push(esc1);

      const res1 = AgentMocks.stuckResolution('Fix');
      history.push(res1);

      // Second escalation
      const esc2 = AgentMocks.stuckEscalation('Issue 2', ['Yes', 'No']);
      history.push(esc2);

      expect(history).toHaveLength(3);
      expect(history[0].status).toBe('waiting');
      expect(history[1].status).toBe('resolved');
      expect(history[2].status).toBe('waiting');
    });
  });

  describe('Edge Cases', () => {
    it('should handle escalation with no clear options', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Unknown error occurred',
        [
          'Retry operation',
          'Skip this step',
          'Provide more information'
        ]
      );

      expect(escalation.escalation.options).toHaveLength(3);
      expect(escalation.escalation.options).toContain('Provide more information');
    });

    it('should handle very long problem descriptions', () => {
      const longProblem = 'A'.repeat(500);

      const escalation = AgentMocks.stuckEscalation(
        longProblem,
        ['Option 1', 'Option 2']
      );

      expect(escalation.escalation.problem.length).toBeGreaterThan(100);
    });

    it('should handle special characters in options', () => {
      const escalation = AgentMocks.stuckEscalation(
        'Code formatting issue',
        [
          'Use "double quotes"',
          "Use 'single quotes'",
          'Use `backticks`'
        ]
      );

      expect(escalation.escalation.options[0]).toContain('"');
      expect(escalation.escalation.options[1]).toContain("'");
      expect(escalation.escalation.options[2]).toContain('`');
    });
  });

  describe('Integration with Other Agents', () => {
    it('should integrate with coder agent workflow', () => {
      // Coder encounters error
      const coderError = AgentMocks.coderError('Module not found', true);

      // Stuck agent is invoked
      const stuck = AgentMocks.stuckEscalation(
        coderError.error.message,
        ['Install module', 'Skip import']
      );

      // User decides
      const resolution = AgentMocks.stuckResolution('Install module');

      // Coder receives decision and continues
      expect(resolution.resolution.decision).toBe('Install module');
    });

    it('should integrate with tester agent workflow', () => {
      // Tester finds failure
      const testerFail = AgentMocks.testerFailure(
        [{ test: 'Login', error: 'Button not found' }],
        ['fail.png']
      );

      // Stuck agent is invoked
      const stuck = AgentMocks.stuckEscalation(
        'Test failed: Button not found',
        ['Update selector', 'Fix HTML', 'Skip test']
      );

      // User decides
      const resolution = AgentMocks.stuckResolution('Fix HTML');

      expect(resolution.resolution.decision).toBe('Fix HTML');
    });
  });
});
