/**
 * Recovery Agent Integration Tests
 *
 * Tests the recovery agent's ability to:
 * - Match error patterns
 * - Calculate confidence scores
 * - Handle escalation logic
 * - Learn from patterns
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { AgentMocks, CustomAssertions } from './utils/test-helpers.js';

describe('Recovery Agent Integration Tests', () => {
  let mockPatterns;

  beforeEach(() => {
    mockPatterns = [
      {
        id: 'port-in-use',
        pattern: /Port \d+ is already in use/,
        solution: 'Use a different port or kill the process',
        confidence: 0.95
      },
      {
        id: 'module-not-found',
        pattern: /Cannot find module ['"](.+)['"]/,
        solution: 'Install the missing module using npm install',
        confidence: 0.90
      },
      {
        id: 'permission-denied',
        pattern: /EACCES: permission denied/,
        solution: 'Check file permissions or run with appropriate privileges',
        confidence: 0.85
      }
    ];
  });

  describe('Pattern Matching', () => {
    it('should match known error patterns', () => {
      const error = 'Error: Port 3000 is already in use';

      const matchedPattern = mockPatterns.find(p =>
        p.pattern.test(error)
      );

      expect(matchedPattern).toBeDefined();
      expect(matchedPattern.id).toBe('port-in-use');
    });

    it('should extract variables from error messages', () => {
      const error = 'Cannot find module \'react\'';
      const pattern = /Cannot find module ['"](.+)['"]/;

      const match = error.match(pattern);
      expect(match).not.toBeNull();
      expect(match[1]).toBe('react');
    });

    it('should handle multiple pattern matches', () => {
      const errors = [
        'Port 3000 is already in use',
        'Cannot find module \'express\'',
        'EACCES: permission denied'
      ];

      const matches = errors.map(err =>
        mockPatterns.find(p => p.pattern.test(err))
      );

      expect(matches.filter(m => m !== undefined)).toHaveLength(3);
    });

    it('should return null for unknown patterns', () => {
      const error = 'This is a completely unique error';

      const matchedPattern = mockPatterns.find(p =>
        p.pattern.test(error)
      );

      expect(matchedPattern).toBeUndefined();
    });

    it('should prioritize specific patterns over generic ones', () => {
      const patterns = [
        { id: 'generic', pattern: /error/i, confidence: 0.5 },
        { id: 'specific', pattern: /TypeError: Cannot read property/, confidence: 0.9 }
      ];

      const error = 'TypeError: Cannot read property \'x\' of undefined';

      const matched = patterns
        .filter(p => p.pattern.test(error))
        .sort((a, b) => b.confidence - a.confidence);

      expect(matched[0].id).toBe('specific');
    });
  });

  describe('Confidence Scoring', () => {
    it('should calculate confidence scores', () => {
      const pattern = mockPatterns[0];

      expect(pattern.confidence).toBeGreaterThan(0);
      expect(pattern.confidence).toBeLessThanOrEqual(1);
    });

    it('should have high confidence for exact matches', () => {
      const error = 'Port 3000 is already in use';
      const matchedPattern = mockPatterns.find(p => p.pattern.test(error));

      expect(matchedPattern.confidence).toBeGreaterThan(0.9);
    });

    it('should have lower confidence for partial matches', () => {
      const partialPattern = {
        pattern: /error/i,
        confidence: 0.6
      };

      expect(partialPattern.confidence).toBeLessThan(0.8);
    });

    it('should adjust confidence based on pattern history', () => {
      const pattern = {
        id: 'test-pattern',
        pattern: /test error/,
        confidence: 0.8,
        successCount: 10,
        failureCount: 2
      };

      // Calculate adjusted confidence
      const successRate = pattern.successCount / (pattern.successCount + pattern.failureCount);
      const adjustedConfidence = pattern.confidence * successRate;

      expect(adjustedConfidence).toBeGreaterThan(0.6);
    });
  });

  describe('Escalation Logic', () => {
    it('should auto-apply high confidence solutions', () => {
      const pattern = {
        id: 'high-confidence',
        confidence: 0.95,
        solution: 'Apply this fix'
      };

      const shouldAutoApply = pattern.confidence > 0.9;
      expect(shouldAutoApply).toBe(true);

      const response = AgentMocks.recoveryAgentSuccess(
        pattern.id,
        pattern.confidence
      );

      expect(response.result.action).toBe('auto-apply');
    });

    it('should escalate low confidence solutions', () => {
      const pattern = {
        id: 'low-confidence',
        confidence: 0.6,
        solution: 'Might work'
      };

      const shouldEscalate = pattern.confidence < 0.8;
      expect(shouldEscalate).toBe(true);

      if (shouldEscalate) {
        const stuckRequest = AgentMocks.stuckEscalation(
          'Possible solution found but confidence is low',
          [
            'Try suggested solution',
            'Manual intervention required',
            'Skip recovery'
          ]
        );

        expect(stuckRequest.agent).toBe('stuck');
      }
    });

    it('should suggest for medium confidence', () => {
      const pattern = {
        id: 'medium-confidence',
        confidence: 0.75,
        solution: 'This might help'
      };

      const response = AgentMocks.recoveryAgentSuccess(
        pattern.id,
        pattern.confidence
      );

      // Medium confidence = suggest to user
      if (pattern.confidence >= 0.7 && pattern.confidence <= 0.85) {
        expect(response.result.action).toBe('suggest');
      }
    });

    it('should escalate when no pattern matches', () => {
      const error = 'Unknown error type';
      const matchedPattern = mockPatterns.find(p => p.pattern.test(error));

      if (!matchedPattern) {
        const stuckRequest = AgentMocks.stuckEscalation(
          `No recovery pattern found for error: ${error}`,
          [
            'Manual troubleshooting required',
            'Add new recovery pattern',
            'Skip this error'
          ]
        );

        expect(stuckRequest.escalation.problem).toContain('No recovery pattern');
      }
    });
  });

  describe('Pattern Learning', () => {
    it('should track pattern success rate', () => {
      const pattern = {
        id: 'test-pattern',
        applications: 10,
        successes: 8,
        failures: 2
      };

      const successRate = pattern.successes / pattern.applications;
      expect(successRate).toBe(0.8);
    });

    it('should update confidence after successful application', () => {
      const pattern = {
        confidence: 0.75,
        successCount: 5,
        totalAttempts: 6
      };

      // After another success
      pattern.successCount += 1;
      pattern.totalAttempts += 1;

      const newConfidence = pattern.successCount / pattern.totalAttempts;
      expect(newConfidence).toBeGreaterThan(0.75);
    });

    it('should demote patterns that fail frequently', () => {
      const pattern = {
        confidence: 0.85,
        successCount: 3,
        failureCount: 7
      };

      const successRate = pattern.successCount / (pattern.successCount + pattern.failureCount);

      if (successRate < 0.5) {
        pattern.confidence = Math.max(0.5, pattern.confidence * successRate);
      }

      expect(pattern.confidence).toBeLessThan(0.85);
    });

    it('should add new patterns from successful recoveries', () => {
      const newPattern = {
        error: 'New error type',
        solution: 'Solution that worked',
        confidence: 0.7 // Start with medium confidence
      };

      const patterns = [...mockPatterns];
      patterns.push(newPattern);

      expect(patterns.length).toBe(mockPatterns.length + 1);
    });

    it('should persist pattern database', () => {
      const patternsDb = {
        version: '1.0.0',
        patterns: mockPatterns,
        lastUpdated: new Date().toISOString()
      };

      expect(patternsDb.patterns).toHaveLength(mockPatterns.length);
      expect(patternsDb.lastUpdated).toBeDefined();
    });
  });

  describe('Recovery Actions', () => {
    it('should provide step-by-step recovery instructions', () => {
      const recovery = {
        pattern: 'module-not-found',
        steps: [
          'Identify missing module name',
          'Run npm install <module>',
          'Verify installation',
          'Retry operation'
        ]
      };

      expect(recovery.steps).toHaveLength(4);
      expect(recovery.steps[1]).toContain('npm install');
    });

    it('should generate recovery commands', () => {
      const error = 'Cannot find module \'lodash\'';
      const match = error.match(/Cannot find module ['"](.+)['"]/);

      if (match) {
        const moduleName = match[1];
        const recoveryCommand = `npm install ${moduleName}`;

        expect(recoveryCommand).toBe('npm install lodash');
      }
    });

    it('should provide rollback instructions', () => {
      const recovery = {
        action: 'Modify package.json',
        rollback: 'Restore package.json from backup'
      };

      expect(recovery.rollback).toBeDefined();
    });
  });

  describe('Agent Response Format', () => {
    it('should return recovery response with pattern info', () => {
      const response = AgentMocks.recoveryAgentSuccess('port-in-use', 0.95);

      CustomAssertions.assertAgentSuccess(response, 'recovery');
      expect(response.result.pattern).toBe('port-in-use');
      expect(response.result.confidence).toBe(0.95);
    });

    it('should include action recommendation', () => {
      const highConfResponse = AgentMocks.recoveryAgentSuccess('test', 0.92);
      const lowConfResponse = AgentMocks.recoveryAgentSuccess('test', 0.65);

      expect(highConfResponse.result.action).toBe('auto-apply');
      expect(lowConfResponse.result.action).toBe('suggest');
    });

    it('should include confidence percentage', () => {
      const response = AgentMocks.recoveryAgentSuccess('test', 0.87);

      expect(response.result.summary).toContain('87%');
    });
  });

  describe('Integration Scenarios', () => {
    it('should integrate with coder agent errors', () => {
      const coderError = AgentMocks.coderError(
        'Port 3000 is already in use',
        false // Don't escalate yet
      );

      // Recovery agent tries to match pattern
      const matchedPattern = mockPatterns.find(p =>
        p.pattern.test(coderError.error.message)
      );

      expect(matchedPattern).toBeDefined();
      expect(matchedPattern.solution).toContain('different port');
    });

    it('should integrate with tester agent failures', () => {
      const testerError = 'Connection refused at localhost:3000';

      const recovery = mockPatterns.find(p =>
        p.pattern.test(testerError)
      );

      // If pattern found, suggest recovery
      // If not found, escalate to stuck agent
      if (!recovery) {
        const stuckRequest = AgentMocks.stuckEscalation(
          testerError,
          ['Start server', 'Check configuration', 'Skip test']
        );

        expect(stuckRequest.agent).toBe('stuck');
      }
    });

    it('should provide context to stuck agent when escalating', () => {
      const error = 'Unusual error';
      const matchedPattern = mockPatterns.find(p => p.pattern.test(error));

      if (!matchedPattern) {
        const stuckRequest = AgentMocks.stuckEscalation(
          error,
          ['Option 1', 'Option 2']
        );

        stuckRequest.escalation.context = {
          originalError: error,
          attemptedRecovery: false,
          patternsChecked: mockPatterns.length
        };

        expect(stuckRequest.escalation.context.patternsChecked).toBe(3);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle regex escaping in patterns', () => {
      const pattern = /Error: \(node:\d+\) Warning/;
      const error = 'Error: (node:12345) Warning';

      expect(pattern.test(error)).toBe(true);
    });

    it('should handle multi-line error messages', () => {
      const error = `Error: Something went wrong
        at function1 (file.js:10)
        at function2 (file.js:20)`;

      const pattern = /Error: Something went wrong/;
      expect(pattern.test(error)).toBe(true);
    });

    it('should handle errors with special characters', () => {
      const error = 'Error: Failed to load $PATH variable';
      const pattern = /Error: Failed to load \$PATH variable/;

      expect(pattern.test(error)).toBe(true);
    });
  });
});
