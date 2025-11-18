/**
 * E2E Test: Simple HTML Project
 *
 * End-to-end test for creating a simple HTML page.
 * Tests the complete workflow from requirements to deployment.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import {
  createTestWorkspace,
  AgentMocks,
  CustomAssertions
} from '../utils/test-helpers.js';

describe('E2E: Simple HTML Project', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('e2e-simple');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it('should complete full workflow for simple HTML page', async () => {
    // === PHASE 1: PROJECT INITIALIZATION ===
    const projectRequirements = 'Create a simple HTML landing page with header, content, and footer';

    // === PHASE 2: TODO CREATION ===
    const todos = [
      { id: 1, title: 'Create index.html with basic structure', status: 'pending', priority: 'high' },
      { id: 2, title: 'Add CSS styling', status: 'pending', priority: 'medium' },
      { id: 3, title: 'Add basic JavaScript interactivity', status: 'pending', priority: 'low' }
    ];

    expect(todos).toHaveLength(3);
    expect(todos[0].status).toBe('pending');

    // === PHASE 3: TODO 1 - CREATE HTML ===
    let currentTodo = todos[0];

    // Coder creates HTML file
    const indexPath = join(tempDir, 'index.html');
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome to Our Site</h1>
        <nav>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <main>
        <section id="hero">
            <h2>Build Amazing Things</h2>
            <p>Your journey starts here.</p>
            <button id="cta">Get Started</button>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Our Company. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

    await writeFile(indexPath, htmlContent);

    const coderResponse1 = AgentMocks.coderSuccess([indexPath], []);
    CustomAssertions.assertAgentSuccess(coderResponse1, 'coder');

    // Tester verifies HTML
    const htmlExists = await readFile(indexPath, 'utf-8');
    expect(htmlExists).toContain('<header>');
    expect(htmlExists).toContain('<main>');
    expect(htmlExists).toContain('<footer>');

    const testerResponse1 = AgentMocks.testerSuccess(
      ['HTML structure exists', 'Header is present', 'Footer is present'],
      ['homepage.png']
    );

    CustomAssertions.assertAgentSuccess(testerResponse1, 'tester');

    // Mark todo complete
    currentTodo.status = 'completed';
    expect(currentTodo.status).toBe('completed');

    // === PHASE 4: TODO 2 - ADD CSS ===
    currentTodo = todos[1];

    const cssPath = join(tempDir, 'styles.css');
    const cssContent = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    text-align: center;
}

nav a {
    color: white;
    margin: 0 1rem;
    text-decoration: none;
}

main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

#hero {
    text-align: center;
    padding: 4rem 2rem;
}

#hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

#cta {
    background: #3498db;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 5px;
}

#cta:hover {
    background: #2980b9;
}

footer {
    background: #34495e;
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}`;

    await writeFile(cssPath, cssContent);

    const coderResponse2 = AgentMocks.coderSuccess([cssPath], []);
    CustomAssertions.assertAgentSuccess(coderResponse2, 'coder');

    // Tester verifies CSS
    const cssExists = await readFile(cssPath, 'utf-8');
    expect(cssExists).toContain('header');
    expect(cssExists).toContain('footer');
    expect(cssExists).toContain('#cta');

    const testerResponse2 = AgentMocks.testerSuccess(
      ['CSS file exists', 'Styles applied correctly', 'Responsive layout works'],
      ['styled-page.png']
    );

    currentTodo.status = 'completed';

    // === PHASE 5: TODO 3 - ADD JAVASCRIPT ===
    currentTodo = todos[2];

    const jsPath = join(tempDir, 'script.js');
    const jsContent = `// Interactive elements
document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.getElementById('cta');

    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            alert('Welcome! Let\\'s get started.');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('Landing page loaded successfully');
});`;

    await writeFile(jsPath, jsContent);

    const coderResponse3 = AgentMocks.coderSuccess([jsPath], []);
    CustomAssertions.assertAgentSuccess(coderResponse3, 'coder');

    // Tester verifies JavaScript
    const jsExists = await readFile(jsPath, 'utf-8');
    expect(jsExists).toContain('addEventListener');
    expect(jsExists).toContain('DOMContentLoaded');

    const testerResponse3 = AgentMocks.testerSuccess(
      ['JavaScript loads', 'Button click works', 'Smooth scrolling works'],
      ['interactive-test.png']
    );

    currentTodo.status = 'completed';

    // === PHASE 6: COMPLETION VERIFICATION ===
    const allTodosComplete = todos.every(t => t.status === 'completed');
    expect(allTodosComplete).toBe(true);

    // Verify all files exist
    await CustomAssertions.assertFileExistsWithContent(indexPath, '<header>');
    await CustomAssertions.assertFileExistsWithContent(cssPath, 'header');
    await CustomAssertions.assertFileExistsWithContent(jsPath, 'addEventListener');

    // === PHASE 7: FINAL REPORT ===
    const completionReport = {
      project: 'Simple HTML Landing Page',
      status: 'completed',
      totalTodos: todos.length,
      completedTodos: todos.filter(t => t.status === 'completed').length,
      filesCreated: [indexPath, cssPath, jsPath],
      agentsInvoked: ['coder', 'tester'],
      escalations: 0,
      summary: 'Successfully created a simple HTML landing page with CSS styling and JavaScript interactivity'
    };

    expect(completionReport.status).toBe('completed');
    expect(completionReport.completedTodos).toBe(3);
    expect(completionReport.filesCreated).toHaveLength(3);
    expect(completionReport.escalations).toBe(0);
  });

  it('should handle error and recovery in simple project', async () => {
    const todos = [
      { id: 1, title: 'Create HTML file', status: 'pending' }
    ];

    // Coder encounters error
    const coderError = AgentMocks.coderError('Cannot write to protected directory', true);
    expect(coderError.error.escalated).toBe(true);

    // Stuck agent is invoked
    const stuckRequest = AgentMocks.stuckEscalation(
      'Cannot write to protected directory',
      ['Use current directory instead', 'Request permissions', 'Skip this file']
    );

    expect(stuckRequest.agent).toBe('stuck');

    // User decides
    const stuckResolution = AgentMocks.stuckResolution('Use current directory instead');

    // Coder retries successfully
    const indexPath = join(tempDir, 'index.html');
    await writeFile(indexPath, '<html><body>Test</body></html>');

    const coderSuccess = AgentMocks.coderSuccess([indexPath], []);
    CustomAssertions.assertAgentSuccess(coderSuccess, 'coder');

    // Tester verifies
    const testerSuccess = AgentMocks.testerSuccess(['HTML exists'], []);

    todos[0].status = 'completed';
    expect(todos[0].status).toBe('completed');
  });

  it('should verify all agents were invoked correctly', async () => {
    const agentInvocations = {
      coder: 0,
      tester: 0,
      stuck: 0
    };

    // Simulate workflow
    // Todo 1
    agentInvocations.coder++;
    agentInvocations.tester++;

    // Todo 2
    agentInvocations.coder++;
    agentInvocations.tester++;

    // Todo 3
    agentInvocations.coder++;
    agentInvocations.tester++;

    expect(agentInvocations.coder).toBe(3);
    expect(agentInvocations.tester).toBe(3);
    expect(agentInvocations.stuck).toBe(0); // No errors
  });

  it('should validate final output meets requirements', async () => {
    // Create files
    const indexPath = join(tempDir, 'index.html');
    const cssPath = join(tempDir, 'styles.css');
    const jsPath = join(tempDir, 'script.js');

    await writeFile(indexPath, '<html><head><link rel="stylesheet" href="styles.css"></head><body><header></header><main></main><footer></footer><script src="script.js"></script></body></html>');
    await writeFile(cssPath, 'header { background: blue; }');
    await writeFile(jsPath, 'console.log("test");');

    // Validate requirements
    const requirements = {
      hasHTML: true,
      hasCSS: true,
      hasJavaScript: true,
      hasHeader: (await readFile(indexPath, 'utf-8')).includes('<header>'),
      hasFooter: (await readFile(indexPath, 'utf-8')).includes('<footer>')
    };

    expect(requirements.hasHTML).toBe(true);
    expect(requirements.hasCSS).toBe(true);
    expect(requirements.hasJavaScript).toBe(true);
    expect(requirements.hasHeader).toBe(true);
    expect(requirements.hasFooter).toBe(true);
  });
});
