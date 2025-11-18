const { createSuite } = require('../suite');

/**
 * Security Auditor Agent Benchmarks
 */

const suite = createSuite('Security Auditor Performance');

/**
 * Codebase scanning benchmark
 */
suite.add(
  'Codebase Scanning Speed',
  async () => {
    // Mock file scanning
    const files = Array.from({ length: 500 }, (_, i) => ({
      path: `/src/component-${i}.js`,
      lines: Math.floor(Math.random() * 500) + 100,
      size: Math.floor(Math.random() * 10000) + 1000
    }));

    let scannedFiles = 0;
    let totalLines = 0;

    for (const file of files) {
      // Mock scanning operation
      await new Promise(resolve => setTimeout(resolve, 1));

      scannedFiles++;
      totalLines += file.lines;
    }

    return {
      filesScanned: scannedFiles,
      totalLines,
      avgLinesPerFile: totalLines / scannedFiles
    };
  },
  { iterations: 10 }
);

/**
 * Vulnerability detection benchmark
 */
suite.add(
  'Vulnerability Detection',
  async () => {
    const vulnerabilityPatterns = [
      { type: 'SQL Injection', pattern: /SELECT.*FROM.*WHERE.*\$\{/ },
      { type: 'XSS', pattern: /innerHTML\s*=\s*[^'"]/ },
      { type: 'Hardcoded Secrets', pattern: /password\s*=\s*["'][^"']+["']/ },
      { type: 'Eval Usage', pattern: /eval\s*\(/ },
      { type: 'Unsafe Redirect', pattern: /window\.location\s*=\s*.*req\./ }
    ];

    const mockCodeSamples = [
      'const query = `SELECT * FROM users WHERE id = ${userId}`;',
      'element.innerHTML = userInput;',
      'const password = "admin123";',
      'eval(userCode);',
      'window.location = req.query.redirect;'
    ];

    const detections = [];

    for (const code of mockCodeSamples) {
      for (const pattern of vulnerabilityPatterns) {
        if (pattern.pattern.test(code)) {
          detections.push({
            type: pattern.type,
            severity: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)],
            line: Math.floor(Math.random() * 100)
          });
        }
      }
    }

    return {
      samplesScanned: mockCodeSamples.length,
      vulnerabilitiesFound: detections.length,
      bySeverity: {
        critical: detections.filter(d => d.severity === 'critical').length,
        high: detections.filter(d => d.severity === 'high').length,
        medium: detections.filter(d => d.severity === 'medium').length
      }
    };
  },
  { iterations: 50 }
);

/**
 * Dependency vulnerability scanning benchmark
 */
suite.add(
  'Dependency Vulnerability Scanning',
  async () => {
    const mockDependencies = [
      { name: 'react', version: '17.0.0' },
      { name: 'express', version: '4.17.0' },
      { name: 'lodash', version: '4.17.15' },
      { name: 'axios', version: '0.21.1' },
      { name: 'moment', version: '2.29.1' }
    ];

    const mockVulnerabilityDb = {
      'lodash@4.17.15': [{ severity: 'high', cve: 'CVE-2020-8203' }],
      'axios@0.21.1': [{ severity: 'medium', cve: 'CVE-2021-3749' }]
    };

    const results = [];

    for (const dep of mockDependencies) {
      // Mock vulnerability lookup
      await new Promise(resolve => setTimeout(resolve, 10));

      const key = `${dep.name}@${dep.version}`;
      const vulnerabilities = mockVulnerabilityDb[key] || [];

      results.push({
        package: dep.name,
        version: dep.version,
        vulnerabilities: vulnerabilities.length,
        vulnerable: vulnerabilities.length > 0
      });
    }

    return {
      dependenciesScanned: mockDependencies.length,
      vulnerablePackages: results.filter(r => r.vulnerable).length,
      totalVulnerabilities: results.reduce((sum, r) => sum + r.vulnerabilities, 0)
    };
  },
  { iterations: 30 }
);

/**
 * False positive rate benchmark
 */
suite.add(
  'False Positive Rate',
  async () => {
    const testCases = [
      { code: 'const safe = sanitize(userInput);', shouldFlag: false },
      { code: 'element.innerHTML = DOMPurify.sanitize(html);', shouldFlag: false },
      { code: 'const config = { password: process.env.DB_PASSWORD };', shouldFlag: false },
      { code: 'eval(untrustedCode);', shouldFlag: true },
      { code: 'element.innerHTML = userInput;', shouldFlag: true }
    ];

    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;

    for (const testCase of testCases) {
      // Mock detection
      const flagged = testCase.code.includes('eval') ||
                      (testCase.code.includes('innerHTML') && !testCase.code.includes('sanitize'));

      if (flagged && testCase.shouldFlag) truePositives++;
      else if (flagged && !testCase.shouldFlag) falsePositives++;
      else if (!flagged && !testCase.shouldFlag) trueNegatives++;
      else if (!flagged && testCase.shouldFlag) falseNegatives++;
    }

    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;

    return {
      testCases: testCases.length,
      truePositives,
      falsePositives,
      trueNegatives,
      falseNegatives,
      precision,
      recall,
      f1Score: 2 * (precision * recall) / (precision + recall) || 0
    };
  },
  { iterations: 100 }
);

/**
 * Large file handling benchmark
 */
suite.add(
  'Large File Handling',
  async () => {
    // Mock large file processing
    const fileSizes = [
      1024 * 100,   // 100KB
      1024 * 500,   // 500KB
      1024 * 1000,  // 1MB
      1024 * 5000,  // 5MB
      1024 * 10000  // 10MB
    ];

    const processingTimes = [];

    for (const size of fileSizes) {
      const startTime = Date.now();

      // Mock processing with simulated time based on size
      const delay = Math.floor(size / 10000); // Proportional delay
      await new Promise(resolve => setTimeout(resolve, Math.min(delay, 50)));

      const endTime = Date.now();
      processingTimes.push({
        size,
        time: endTime - startTime,
        throughput: size / (endTime - startTime)
      });
    }

    return {
      filesProcessed: fileSizes.length,
      totalSize: fileSizes.reduce((sum, s) => sum + s, 0),
      avgThroughput: processingTimes.reduce((sum, p) => sum + p.throughput, 0) / processingTimes.length
    };
  },
  { iterations: 15 }
);

/**
 * Security policy enforcement benchmark
 */
suite.add(
  'Security Policy Enforcement',
  async () => {
    const policies = [
      { rule: 'no-eval', enabled: true },
      { rule: 'no-inline-html', enabled: true },
      { rule: 'require-https', enabled: true },
      { rule: 'no-weak-crypto', enabled: true },
      { rule: 'sanitize-inputs', enabled: true }
    ];

    const codeSnippets = [
      'eval(code);',
      'element.innerHTML = html;',
      'fetch("http://api.example.com");',
      'crypto.createHash("md5");',
      'db.query(userInput);'
    ];

    const violations = [];

    for (let i = 0; i < codeSnippets.length; i++) {
      const snippet = codeSnippets[i];
      const policy = policies[i];

      // Mock policy check
      await new Promise(resolve => setTimeout(resolve, 2));

      violations.push({
        policy: policy.rule,
        violated: true,
        snippet: snippet.substring(0, 30) + '...'
      });
    }

    return {
      policiesChecked: policies.length,
      snippetsAnalyzed: codeSnippets.length,
      violations: violations.length
    };
  },
  { iterations: 40 }
);

/**
 * SAST (Static Analysis) benchmark
 */
suite.add(
  'Static Analysis (SAST)',
  async () => {
    const analysisRules = [
      'buffer-overflow',
      'race-condition',
      'null-pointer',
      'memory-leak',
      'unvalidated-input'
    ];

    const mockCodebase = Array.from({ length: 100 }, (_, i) => ({
      file: `file-${i}.js`,
      loc: Math.floor(Math.random() * 500) + 100
    }));

    let totalIssues = 0;

    for (const file of mockCodebase) {
      // Mock static analysis
      await new Promise(resolve => setTimeout(resolve, 2));

      // Random issues found
      const issuesFound = Math.floor(Math.random() * 3);
      totalIssues += issuesFound;
    }

    return {
      filesAnalyzed: mockCodebase.length,
      rulesApplied: analysisRules.length,
      totalIssues,
      issuesPerFile: totalIssues / mockCodebase.length
    };
  },
  { iterations: 20 }
);

module.exports = suite.build();
