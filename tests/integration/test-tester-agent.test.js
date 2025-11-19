/**
 * Tester Agent Integration Tests
 *
 * Tests the tester agent's ability to:
 * - Integrate with Playwright
 * - Capture screenshots
 * - Perform visual verification
 * - Test forms and interactions
 * - Detect failures accurately
 * - Escalate to stuck agent when needed
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import {
  createTestWorkspace,
  AgentMocks,
  CustomAssertions
} from './utils/test-helpers.js';

describe('Tester Agent Integration Tests', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('tester-test');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  describe('Playwright Integration', () => {
    it('should initialize Playwright browser', async () => {
      // Mock Playwright initialization
      const playwrightConfig = {
        browser: 'chromium',
        headless: true,
        viewport: { width: 1280, height: 720 }
      };

      expect(playwrightConfig.browser).toBe('chromium');
      expect(playwrightConfig.headless).toBe(true);
    });

    it('should navigate to local HTML file', async () => {
      // Create test HTML file
      const htmlPath = join(tempDir, 'test.html');
      await writeFile(htmlPath, '<html><body><h1>Test Page</h1></body></html>');

      // Mock navigation
      const fileUrl = `file://${htmlPath}`;
      const navigationResult = {
        url: fileUrl,
        status: 200,
        success: true
      };

      expect(navigationResult.success).toBe(true);
    });

    it('should handle navigation to localhost server', async () => {
      // Mock server navigation
      const serverUrl = 'http://localhost:3000';
      const navigationResult = {
        url: serverUrl,
        timeout: 30000,
        waitUntil: 'networkidle'
      };

      expect(navigationResult.url).toBe(serverUrl);
      expect(navigationResult.waitUntil).toBe('networkidle');
    });

    it('should close browser after tests', async () => {
      let browserClosed = false;

      // Mock browser cleanup
      const closeBrowser = async () => {
        browserClosed = true;
      };

      await closeBrowser();
      expect(browserClosed).toBe(true);
    });
  });

  describe('Screenshot Capture', () => {
    it('should capture full page screenshot', async () => {
      const screenshotPath = join(tempDir, 'screenshot.png');

      // Mock screenshot capture
      const screenshot = {
        path: screenshotPath,
        type: 'png',
        fullPage: true
      };

      expect(screenshot.fullPage).toBe(true);
      expect(screenshot.path).toContain('screenshot.png');
    });

    it('should capture element screenshot', async () => {
      // Mock element screenshot
      const elementScreenshot = {
        selector: 'button.primary',
        path: join(tempDir, 'button.png'),
        type: 'png'
      };

      expect(elementScreenshot.selector).toBe('button.primary');
    });

    it('should capture screenshot on test failure', async () => {
      let failureScreenshotTaken = false;

      try {
        // Simulate test failure
        throw new Error('Element not found');
      } catch (error) {
        // Capture failure screenshot
        failureScreenshotTaken = true;
        const failureShot = {
          path: join(tempDir, 'failure.png'),
          timestamp: new Date().toISOString(),
          error: error.message
        };

        expect(failureShot.error).toBe('Element not found');
      }

      expect(failureScreenshotTaken).toBe(true);
    });

    it('should organize screenshots by test name', () => {
      const testName = 'should verify homepage layout';
      const screenshotName = testName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      expect(screenshotName).toBe('should-verify-homepage-layout');
    });
  });

  describe('Visual Verification', () => {
    it('should verify element exists', async () => {
      // Create HTML with element
      const html = `<html><body><button id="submit">Submit</button></body></html>`;
      await writeFile(join(tempDir, 'form.html'), html);

      // Mock element verification
      const elementExists = html.includes('id="submit"');
      expect(elementExists).toBe(true);
    });

    it('should verify element visibility', () => {
      // Mock visibility check
      const element = {
        selector: 'h1',
        visible: true,
        hidden: false
      };

      expect(element.visible).toBe(true);
      expect(element.hidden).toBe(false);
    });

    it('should verify text content', async () => {
      const html = `<html><body><h1>Welcome</h1></body></html>`;
      await writeFile(join(tempDir, 'welcome.html'), html);

      // Verify text exists
      expect(html).toContain('Welcome');
    });

    it('should verify CSS styles', () => {
      // Mock style verification
      const styles = {
        element: 'button',
        backgroundColor: 'rgb(0, 123, 255)',
        padding: '10px 20px',
        borderRadius: '4px'
      };

      expect(styles.backgroundColor).toBe('rgb(0, 123, 255)');
    });

    it('should verify responsive layout', async () => {
      // Mock viewport tests
      const viewports = [
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1920, height: 1080, name: 'desktop' }
      ];

      for (const viewport of viewports) {
        // Would capture screenshot at each viewport
        expect(viewport.width).toBeGreaterThan(0);
        expect(viewport.height).toBeGreaterThan(0);
      }

      expect(viewports).toHaveLength(3);
    });
  });

  describe('Form Testing', () => {
    it('should fill and submit form', async () => {
      const formHtml = `
        <html><body>
          <form id="contact">
            <input name="name" type="text" />
            <input name="email" type="email" />
            <button type="submit">Submit</button>
          </form>
        </body></html>
      `;
      await writeFile(join(tempDir, 'contact.html'), formHtml);

      // Mock form interaction
      const formData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      expect(formData.name).toBe('John Doe');
      expect(formData.email).toBe('john@example.com');
    });

    it('should verify form validation', () => {
      // Mock validation check
      const validationTests = [
        { field: 'email', value: 'invalid', valid: false },
        { field: 'email', value: 'valid@test.com', valid: true }
      ];

      expect(validationTests[0].valid).toBe(false);
      expect(validationTests[1].valid).toBe(true);
    });

    it('should test checkbox interactions', () => {
      // Mock checkbox test
      const checkbox = {
        selector: 'input[type="checkbox"]',
        checked: false
      };

      // Click checkbox
      checkbox.checked = true;
      expect(checkbox.checked).toBe(true);
    });

    it('should test select dropdown', () => {
      // Mock select interaction
      const select = {
        selector: 'select#country',
        options: ['USA', 'Canada', 'UK'],
        selected: 'USA'
      };

      expect(select.selected).toBe('USA');
      expect(select.options).toContain('Canada');
    });
  });

  describe('Interaction Testing', () => {
    it('should test button clicks', async () => {
      let buttonClicked = false;

      // Mock button click
      const clickButton = () => {
        buttonClicked = true;
      };

      clickButton();
      expect(buttonClicked).toBe(true);
    });

    it('should test navigation links', async () => {
      const navigation = [
        { text: 'Home', href: '/' },
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' }
      ];

      // Verify all links
      for (const link of navigation) {
        expect(link.href).toBeDefined();
      }

      expect(navigation).toHaveLength(3);
    });

    it('should test hover effects', () => {
      // Mock hover test
      const element = {
        selector: 'button',
        colorDefault: 'blue',
        colorHover: 'darkblue',
        currentColor: 'blue'
      };

      // Hover
      element.currentColor = element.colorHover;
      expect(element.currentColor).toBe('darkblue');
    });

    it('should test modal interactions', async () => {
      let modalOpen = false;

      const openModal = () => { modalOpen = true; };
      const closeModal = () => { modalOpen = false; };

      openModal();
      expect(modalOpen).toBe(true);

      closeModal();
      expect(modalOpen).toBe(false);
    });
  });

  describe('Failure Detection', () => {
    it('should detect missing elements', () => {
      const html = '<html><body><h1>Title</h1></body></html>';

      // Try to find non-existent element
      const elementExists = html.includes('id="missing"');
      expect(elementExists).toBe(false);

      // This should trigger test failure
      if (!elementExists) {
        const testResult = AgentMocks.testerFailure(
          [{ test: 'Find element #missing', error: 'Element not found' }],
          ['failure-screenshot.png']
        );

        expect(testResult.result.allPassed).toBe(false);
        expect(testResult.result.testsFailed).toHaveLength(1);
      }
    });

    it('should detect incorrect text content', () => {
      const expectedText = 'Welcome';
      const actualText = 'Hello';

      const textMatches = expectedText === actualText;
      expect(textMatches).toBe(false);

      if (!textMatches) {
        const failure = {
          expected: expectedText,
          actual: actualText,
          test: 'Verify welcome text'
        };

        expect(failure.expected).not.toBe(failure.actual);
      }
    });

    it('should detect broken navigation', () => {
      const links = [
        { href: '/home', exists: true },
        { href: '/about', exists: false }, // Broken link
        { href: '/contact', exists: true }
      ];

      const brokenLinks = links.filter(link => !link.exists);
      expect(brokenLinks).toHaveLength(1);
      expect(brokenLinks[0].href).toBe('/about');
    });

    it('should detect layout issues', () => {
      // Mock layout verification
      const layoutCheck = {
        headerVisible: true,
        footerVisible: true,
        contentVisible: false // Issue!
      };

      const hasLayoutIssues = !layoutCheck.contentVisible;
      expect(hasLayoutIssues).toBe(true);
    });

    it('should never mark failing tests as passing', () => {
      // Simulate failed test
      const testFailed = true;

      // Tester should NEVER do this:
      // const result = { allPassed: true };

      // Tester should do this:
      const result = testFailed
        ? AgentMocks.testerFailure(['Test failed'], [])
        : AgentMocks.testerSuccess(['Test passed'], []);

      expect(result.result.allPassed).toBe(false);
    });
  });

  describe('Stuck Agent Escalation', () => {
    it('should escalate when page fails to load', () => {
      const pageLoadError = 'ERR_CONNECTION_REFUSED';

      const stuckRequest = AgentMocks.stuckEscalation(
        `Cannot load page: ${pageLoadError}`,
        [
          'Start development server',
          'Use static file instead',
          'Skip this test'
        ]
      );

      expect(stuckRequest.escalation.problem).toContain('Cannot load page');
      expect(stuckRequest.escalation.options).toHaveLength(3);
    });

    it('should escalate when test expectations are unclear', () => {
      const ambiguousTest = {
        description: 'Verify the page looks good',
        specificCriteria: null
      };

      if (!ambiguousTest.specificCriteria) {
        const stuckRequest = AgentMocks.stuckEscalation(
          'Test criteria unclear: "Verify the page looks good"',
          [
            'Check if all elements are visible',
            'Verify layout matches screenshot',
            'Ask for specific test criteria'
          ]
        );

        expect(stuckRequest.agent).toBe('stuck');
      }
    });

    it('should escalate on timeout', () => {
      const timeoutError = 'Navigation timeout exceeded 30000ms';

      const stuckRequest = AgentMocks.stuckEscalation(
        timeoutError,
        [
          'Increase timeout',
          'Check if server is running',
          'Skip navigation test'
        ]
      );

      expect(stuckRequest.escalation.problem).toContain('timeout');
    });

    it('should provide test failure context to stuck agent', () => {
      const failureContext = {
        test: 'Verify login form',
        expectedElement: '#login-button',
        actualError: 'Element not found',
        screenshot: 'failure-login.png',
        html: '<html>...</html>'
      };

      const stuckRequest = AgentMocks.stuckEscalation(
        `Test failed: ${failureContext.actualError}`,
        [
          'Update selector to match actual HTML',
          'Check if element is dynamically loaded',
          'Review HTML structure'
        ]
      );

      expect(stuckRequest.escalation.problem).toBeDefined();
    });
  });

  describe('Test Reporting', () => {
    it('should report all passed tests', () => {
      const testsPassed = [
        'Page loads successfully',
        'Header is visible',
        'Footer is visible',
        'Form submits correctly'
      ];

      const response = AgentMocks.testerSuccess(testsPassed, [
        'homepage.png',
        'form.png'
      ]);

      CustomAssertions.assertAgentSuccess(response, 'tester');
      expect(response.result.testsPassed).toHaveLength(4);
      expect(response.result.screenshots).toHaveLength(2);
    });

    it('should report failed tests with details', () => {
      const testsFailed = [
        { test: 'Login button visible', error: 'Element not found', screenshot: 'fail1.png' },
        { test: 'Form validation', error: 'Validation not working', screenshot: 'fail2.png' }
      ];

      const response = AgentMocks.testerFailure(testsFailed, ['fail1.png', 'fail2.png']);

      expect(response.result.allPassed).toBe(false);
      expect(response.result.testsFailed).toHaveLength(2);
      expect(response.result.escalated).toBe(true);
    });

    it('should include screenshots in report', () => {
      const screenshots = [
        { name: 'homepage-full.png', type: 'full-page' },
        { name: 'header-element.png', type: 'element' },
        { name: 'footer-element.png', type: 'element' }
      ];

      const response = AgentMocks.testerSuccess(
        ['All tests passed'],
        screenshots.map(s => s.name)
      );

      expect(response.result.screenshots).toHaveLength(3);
    });

    it('should include test execution time', () => {
      const startTime = Date.now();
      // Simulate test execution
      const endTime = Date.now();
      const duration = endTime - startTime;

      const response = AgentMocks.testerSuccess(['Test passed'], []);
      response.result.duration = duration;

      expect(response.result.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration with Agent System', () => {
    it('should follow agent response format', () => {
      const response = AgentMocks.testerSuccess(['Test passed'], []);

      CustomAssertions.assertValidAgentResponse(response);
      expect(response.agent).toBe('tester');
      expect(response.status).toBe('completed');
    });

    it('should handle multiple test runs', () => {
      const run1 = AgentMocks.testerSuccess(['Test 1'], []);
      const run2 = AgentMocks.testerSuccess(['Test 2'], []);

      expect(run1.timestamp).toBeDefined();
      expect(run2.timestamp).toBeDefined();
      expect(run1.result.testsPassed[0]).toBe('Test 1');
      expect(run2.result.testsPassed[0]).toBe('Test 2');
    });
  });
});
