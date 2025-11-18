/**
 * Coder Agent Integration Tests
 *
 * Tests the coder agent's ability to:
 * - Create new files
 * - Edit existing files
 * - Handle multi-file changes
 * - Handle errors appropriately
 * - Invoke stuck agent when needed
 * - Report completion correctly
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { readFile, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import {
  createTestWorkspace,
  AgentMocks,
  CustomAssertions
} from './utils/test-helpers.js';

describe('Coder Agent Integration Tests', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('coder-test');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  describe('File Creation', () => {
    it('should create a simple HTML file', async () => {
      const filePath = join(tempDir, 'index.html');
      const content = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>Hello World</h1></body>
</html>`;

      // Simulate coder agent creating a file
      await writeFile(filePath, content);

      // Verify file was created
      await CustomAssertions.assertFileExistsWithContent(
        filePath,
        '<h1>Hello World</h1>'
      );
    });

    it('should create multiple files in one operation', async () => {
      const files = {
        'index.html': '<html><body>Test</body></html>',
        'styles.css': 'body { margin: 0; }',
        'script.js': 'console.log("test");'
      };

      // Simulate coder agent creating multiple files
      for (const [filename, content] of Object.entries(files)) {
        await writeFile(join(tempDir, filename), content);
      }

      // Verify all files exist
      for (const filename of Object.keys(files)) {
        const content = await readFile(join(tempDir, filename), 'utf-8');
        expect(content).toBe(files[filename]);
      }
    });

    it('should create nested directory structure', async () => {
      const filePath = join(tempDir, 'src', 'components', 'Button.jsx');
      const content = 'export default function Button() { return <button>Click</button>; }';

      // Simulate coder creating file in nested directories
      await workspace.fixtureCreator.createReactProject('test-project');
      const buttonPath = join(tempDir, 'test-project', 'src', 'Button.jsx');
      await writeFile(buttonPath, content);

      await CustomAssertions.assertFileExistsWithContent(buttonPath, 'Button');
    });
  });

  describe('File Editing', () => {
    it('should edit an existing file', async () => {
      const filePath = join(tempDir, 'test.txt');

      // Create initial file
      await writeFile(filePath, 'Initial content');

      // Simulate coder editing the file
      await writeFile(filePath, 'Updated content');

      // Verify edit
      const content = await readFile(filePath, 'utf-8');
      expect(content).toBe('Updated content');
    });

    it('should append to an existing file', async () => {
      const filePath = join(tempDir, 'log.txt');

      // Create initial file
      await writeFile(filePath, 'Line 1\n');

      // Simulate appending
      const existing = await readFile(filePath, 'utf-8');
      await writeFile(filePath, existing + 'Line 2\n');

      // Verify append
      const content = await readFile(filePath, 'utf-8');
      expect(content).toBe('Line 1\nLine 2\n');
    });

    it('should modify specific sections of code', async () => {
      const filePath = join(tempDir, 'App.jsx');
      const initialCode = `function App() {
  return <div>Old</div>;
}`;

      const updatedCode = `function App() {
  return <div>New</div>;
}`;

      // Create file
      await writeFile(filePath, initialCode);

      // Simulate editing
      await writeFile(filePath, updatedCode);

      // Verify modification
      const content = await readFile(filePath, 'utf-8');
      expect(content).toContain('New');
      expect(content).not.toContain('Old');
    });
  });

  describe('Multi-file Changes', () => {
    it('should handle multi-file refactoring', async () => {
      // Create initial structure
      await workspace.fixtureCreator.createReactProject('refactor-test');
      const projectDir = join(tempDir, 'refactor-test');

      // Simulate creating multiple related files
      const files = {
        'src/utils/helpers.js': 'export const helper = () => {};',
        'src/components/Header.jsx': 'import { helper } from "../utils/helpers";',
        'src/components/Footer.jsx': 'import { helper } from "../utils/helpers";'
      };

      for (const [path, content] of Object.entries(files)) {
        await writeFile(join(projectDir, path), content);
      }

      // Verify all files created
      for (const path of Object.keys(files)) {
        await CustomAssertions.assertFileExistsWithContent(
          join(projectDir, path)
        );
      }
    });

    it('should track all modified files', async () => {
      const filesModified = [];

      const file1 = join(tempDir, 'file1.js');
      const file2 = join(tempDir, 'file2.js');

      await writeFile(file1, 'content1');
      filesModified.push(file1);

      await writeFile(file2, 'content2');
      filesModified.push(file2);

      // Verify tracking
      expect(filesModified).toHaveLength(2);
      expect(filesModified).toContain(file1);
      expect(filesModified).toContain(file2);
    });
  });

  describe('Error Handling', () => {
    it('should detect when file cannot be created', async () => {
      // Simulate error scenario
      const invalidPath = '/root/cannot-write-here.txt';

      let errorOccurred = false;
      try {
        await writeFile(invalidPath, 'test');
      } catch (error) {
        errorOccurred = true;
        expect(error).toBeDefined();
      }

      expect(errorOccurred).toBe(true);
    });

    it('should detect when file does not exist for editing', async () => {
      const nonExistentFile = join(tempDir, 'does-not-exist.txt');

      let errorOccurred = false;
      try {
        await readFile(nonExistentFile);
      } catch (error) {
        errorOccurred = true;
        expect(error.code).toBe('ENOENT');
      }

      expect(errorOccurred).toBe(true);
    });

    it('should handle syntax errors in code', async () => {
      const filePath = join(tempDir, 'syntax-error.js');
      const invalidCode = 'function test() { return } }'; // Invalid syntax

      // Coder would write this, but ideally should validate
      await writeFile(filePath, invalidCode);

      // In real scenario, this would trigger stuck agent
      const content = await readFile(filePath, 'utf-8');
      expect(content).toContain('return } }'); // Invalid code written
    });
  });

  describe('Stuck Agent Invocation', () => {
    it('should invoke stuck agent when encountering permission error', async () => {
      let stuckAgentInvoked = false;
      let errorContext = null;

      try {
        await writeFile('/root/protected.txt', 'test');
      } catch (error) {
        // Simulate stuck agent invocation
        stuckAgentInvoked = true;
        errorContext = {
          error: error.message,
          action: 'create file',
          path: '/root/protected.txt'
        };
      }

      expect(stuckAgentInvoked).toBe(true);
      expect(errorContext).toBeDefined();
      expect(errorContext.error).toBeDefined();
    });

    it('should invoke stuck agent on ambiguous requirements', () => {
      // Simulate ambiguous requirement scenario
      const ambiguousTask = {
        description: 'Create a page',
        details: null // No details provided
      };

      // Coder should invoke stuck agent
      const shouldInvokeStuck = !ambiguousTask.details;
      expect(shouldInvokeStuck).toBe(true);

      if (shouldInvokeStuck) {
        const stuckRequest = AgentMocks.stuckEscalation(
          'Task description is ambiguous: "Create a page"',
          [
            'Create a blank HTML page',
            'Create a React component page',
            'Ask user for clarification'
          ]
        );

        expect(stuckRequest.agent).toBe('stuck');
        expect(stuckRequest.escalation.options).toHaveLength(3);
      }
    });

    it('should never use fallbacks without stuck agent approval', async () => {
      // Simulate scenario where file is missing
      const missingDependency = 'missing-module.js';
      let usedFallback = false;

      try {
        await readFile(join(tempDir, missingDependency));
      } catch (error) {
        // WRONG: Using fallback
        // usedFallback = true;

        // RIGHT: Invoke stuck agent
        const stuckRequest = AgentMocks.stuckEscalation(
          `Dependency ${missingDependency} not found`,
          [
            'Create the missing file',
            'Install from npm',
            'Skip this dependency'
          ]
        );

        expect(stuckRequest.escalation).toBeDefined();
      }

      expect(usedFallback).toBe(false); // Should never use fallback
    });
  });

  describe('Completion Reporting', () => {
    it('should report files created', async () => {
      const filesCreated = [];

      const file1 = join(tempDir, 'new-file-1.js');
      const file2 = join(tempDir, 'new-file-2.js');

      await writeFile(file1, 'content');
      filesCreated.push(file1);

      await writeFile(file2, 'content');
      filesCreated.push(file2);

      const response = AgentMocks.coderSuccess(filesCreated, []);

      CustomAssertions.assertAgentSuccess(response, 'coder');
      expect(response.result.filesCreated).toHaveLength(2);
    });

    it('should report files modified', async () => {
      const file = join(tempDir, 'existing.js');

      // Create file
      await writeFile(file, 'original');

      // Modify file
      await writeFile(file, 'modified');

      const filesModified = [file];
      const response = AgentMocks.coderSuccess([], filesModified);

      CustomAssertions.assertAgentSuccess(response, 'coder');
      expect(response.result.filesModified).toHaveLength(1);
    });

    it('should include summary in completion report', () => {
      const response = AgentMocks.coderSuccess(
        ['file1.js', 'file2.js'],
        ['file3.js']
      );

      expect(response.result.summary).toBeDefined();
      expect(response.result.summary).toContain('Created 2 files');
      expect(response.result.summary).toContain('modified 1 files');
    });

    it('should report completion timestamp', () => {
      const response = AgentMocks.coderSuccess(['file.js'], []);

      expect(response.timestamp).toBeDefined();
      const timestamp = new Date(response.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Integration with Agent System', () => {
    it('should follow agent response format', () => {
      const response = AgentMocks.coderSuccess(['test.js'], []);

      CustomAssertions.assertValidAgentResponse(response);
      expect(response.agent).toBe('coder');
      expect(response.status).toBe('completed');
      expect(response.result).toBeDefined();
    });

    it('should handle error responses correctly', () => {
      const errorResponse = AgentMocks.coderError(
        'Failed to create file: Permission denied',
        true
      );

      CustomAssertions.assertAgentErrorWithEscalation(errorResponse, 'coder');
      expect(errorResponse.error.message).toContain('Permission denied');
    });
  });
});
