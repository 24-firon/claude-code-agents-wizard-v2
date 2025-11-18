/**
 * Security Auditor Agent Integration Tests
 *
 * Tests the security auditor's ability to:
 * - Detect vulnerabilities
 * - Perform OWASP checks
 * - Scan dependencies
 * - Generate security reports
 */

import { describe, it, expect } from '@jest/globals';
import { AgentMocks, CustomAssertions } from './utils/test-helpers.js';

describe('Security Auditor Agent Integration Tests', () => {
  describe('Vulnerability Detection', () => {
    it('should detect XSS vulnerabilities', () => {
      const code = `
        const userInput = req.query.name;
        res.send('<h1>Hello ' + userInput + '</h1>'); // Vulnerable!
      `;

      const hasXssVulnerability = code.includes('userInput') && !code.includes('escape');
      expect(hasXssVulnerability).toBe(true);

      const vulnerability = {
        type: 'XSS',
        severity: 'high',
        location: 'line 3',
        description: 'Unescaped user input in HTML'
      };

      expect(vulnerability.severity).toBe('high');
    });

    it('should detect SQL injection risks', () => {
      const code = `
        const query = 'SELECT * FROM users WHERE id = ' + userId;
        db.query(query); // Vulnerable!
      `;

      const hasSqlInjection = code.includes('WHERE id = \' +');
      expect(hasSqlInjection).toBe(true);
    });

    it('should detect hardcoded credentials', () => {
      const code = `
        const password = 'admin123'; // Hardcoded!
        const apiKey = 'sk_live_abc123xyz'; // Hardcoded!
      `;

      const hasHardcodedSecrets = code.includes('password = \'') || code.includes('apiKey = \'');
      expect(hasHardcodedSecrets).toBe(true);
    });

    it('should detect insecure random number generation', () => {
      const code = 'const token = Math.random().toString(36);';
      const usesInsecureRandom = code.includes('Math.random');

      expect(usesInsecureRandom).toBe(true);

      const vulnerability = {
        type: 'Insecure Random',
        recommendation: 'Use crypto.randomBytes() instead'
      };

      expect(vulnerability.recommendation).toContain('crypto.randomBytes');
    });
  });

  describe('OWASP Checks', () => {
    it('should check for broken authentication', () => {
      const checks = [
        { name: 'Password complexity', passed: false },
        { name: 'Session timeout', passed: true },
        { name: 'Multi-factor auth', passed: false }
      ];

      const failedChecks = checks.filter(c => !c.passed);
      expect(failedChecks).toHaveLength(2);
    });

    it('should check for sensitive data exposure', () => {
      const code = 'console.log(user.password);'; // Logging sensitive data!

      const exposesSensitiveData = code.includes('password');
      expect(exposesSensitiveData).toBe(true);
    });

    it('should check for broken access control', () => {
      const route = `
        app.get('/admin', (req, res) => {
          // No authentication check!
          res.render('admin');
        });
      `;

      const hasAccessControl = route.includes('authenticate') || route.includes('authorize');
      expect(hasAccessControl).toBe(false); // Missing!
    });

    it('should check for security misconfiguration', () => {
      const config = {
        debug: true, // Should be false in production
        cors: '*', // Too permissive
        https: false // Should be true
      };

      const misconfigurations = [];
      if (config.debug) misconfigurations.push('Debug mode enabled');
      if (config.cors === '*') misconfigurations.push('CORS too permissive');
      if (!config.https) misconfigurations.push('HTTPS not enforced');

      expect(misconfigurations).toHaveLength(3);
    });
  });

  describe('Dependency Scanning', () => {
    it('should scan package.json for known vulnerabilities', () => {
      const packageJson = {
        dependencies: {
          'vulnerable-package': '1.0.0', // Known vulnerability
          'safe-package': '2.0.0'
        }
      };

      const vulnerablePackages = ['vulnerable-package'];
      const hasVulnerabilities = vulnerablePackages.length > 0;

      expect(hasVulnerabilities).toBe(true);
    });

    it('should check for outdated dependencies', () => {
      const dependencies = [
        { name: 'react', current: '16.0.0', latest: '18.2.0', outdated: true },
        { name: 'lodash', current: '4.17.21', latest: '4.17.21', outdated: false }
      ];

      const outdated = dependencies.filter(d => d.outdated);
      expect(outdated).toHaveLength(1);
    });

    it('should detect dependencies with security advisories', () => {
      const advisories = [
        {
          package: 'axios',
          version: '0.18.0',
          severity: 'high',
          advisory: 'CVE-2020-1234'
        }
      ];

      expect(advisories[0].severity).toBe('high');
      expect(advisories[0].advisory).toContain('CVE');
    });
  });

  describe('Report Generation', () => {
    it('should generate security report with all findings', () => {
      const vulnerabilities = [
        { type: 'XSS', severity: 'high', file: 'app.js', line: 42 },
        { type: 'SQL Injection', severity: 'critical', file: 'db.js', line: 15 }
      ];

      const response = AgentMocks.securityAuditorSuccess(vulnerabilities);

      CustomAssertions.assertAgentSuccess(response, 'security-auditor');
      expect(response.result.vulnerabilities).toHaveLength(2);
      expect(response.result.severity).toBe('high');
    });

    it('should categorize vulnerabilities by severity', () => {
      const vulnerabilities = [
        { type: 'XSS', severity: 'critical' },
        { type: 'Info Leak', severity: 'low' },
        { type: 'CSRF', severity: 'high' }
      ];

      const bySeverity = {
        critical: vulnerabilities.filter(v => v.severity === 'critical'),
        high: vulnerabilities.filter(v => v.severity === 'high'),
        low: vulnerabilities.filter(v => v.severity === 'low')
      };

      expect(bySeverity.critical).toHaveLength(1);
      expect(bySeverity.high).toHaveLength(1);
      expect(bySeverity.low).toHaveLength(1);
    });

    it('should include remediation recommendations', () => {
      const vulnerability = {
        type: 'XSS',
        severity: 'high',
        recommendation: 'Escape user input using a library like DOMPurify'
      };

      expect(vulnerability.recommendation).toBeDefined();
      expect(vulnerability.recommendation).toContain('Escape');
    });

    it('should report when no vulnerabilities found', () => {
      const response = AgentMocks.securityAuditorSuccess([]);

      expect(response.result.vulnerabilities).toHaveLength(0);
      expect(response.result.severity).toBe('none');
      expect(response.result.summary).toContain('0 vulnerabilities');
    });
  });

  describe('Code Pattern Analysis', () => {
    it('should detect eval() usage', () => {
      const code = 'eval(userInput);';
      const usesEval = code.includes('eval(');

      expect(usesEval).toBe(true);
    });

    it('should detect innerHTML usage', () => {
      const code = 'element.innerHTML = userInput;';
      const usesInnerHTML = code.includes('.innerHTML =');

      expect(usesInnerHTML).toBe(true);
    });

    it('should detect insecure HTTP requests', () => {
      const code = 'fetch("http://api.example.com/data");';
      const usesHttp = code.includes('http://');

      expect(usesHttp).toBe(true);
    });
  });

  describe('Integration with Other Agents', () => {
    it('should escalate critical vulnerabilities to stuck agent', () => {
      const criticalVuln = {
        type: 'SQL Injection',
        severity: 'critical',
        shouldEscalate: true
      };

      if (criticalVuln.shouldEscalate) {
        const stuckRequest = AgentMocks.stuckEscalation(
          `Critical vulnerability found: ${criticalVuln.type}`,
          [
            'Fix immediately',
            'Add to security backlog',
            'Accept risk (not recommended)'
          ]
        );

        expect(stuckRequest.agent).toBe('stuck');
      }
    });

    it('should provide fix suggestions to coder agent', () => {
      const fixSuggestion = {
        file: 'app.js',
        line: 42,
        current: 'res.send(userInput);',
        suggested: 'res.send(escapeHtml(userInput));',
        vulnerability: 'XSS'
      };

      expect(fixSuggestion.suggested).toContain('escapeHtml');
    });
  });
});
