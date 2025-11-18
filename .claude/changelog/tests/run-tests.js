#!/usr/bin/env node

/**
 * Simple test runner for changelog generator
 * Run with: node tests/run-tests.js
 */

const { parseCommit, validateCommit, extractBreakingChanges } = require('../parser');
const { analyzeCommits, calculateQualityScore } = require('../analyzer');
const { getRepoInfo, categorizeCommits } = require('../generator');

console.log('🧪 Running Changelog Generator Tests\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test Parser
console.log('📝 Parser Tests\n');

test('Parse basic conventional commit', () => {
  const commit = 'feat(api): add user endpoint';
  const parsed = parseCommit(commit);
  assert(parsed.type === 'feat', 'Type should be feat');
  assert(parsed.scope === 'api', 'Scope should be api');
  assert(parsed.subject === 'add user endpoint', 'Subject should match');
});

test('Parse commit without scope', () => {
  const commit = 'fix: resolve bug';
  const parsed = parseCommit(commit);
  assert(parsed.type === 'fix', 'Type should be fix');
  assert(parsed.scope === null, 'Scope should be null');
  assert(parsed.subject === 'resolve bug', 'Subject should match');
});

test('Parse breaking change with !', () => {
  const commit = 'feat!: remove deprecated API';
  const parsed = parseCommit(commit);
  const breaking = extractBreakingChanges(parsed);
  assert(breaking.length > 0, 'Should detect breaking change');
});

test('Parse breaking change with footer', () => {
  const commit = 'feat: new feature\n\nBREAKING CHANGE: This breaks things';
  const parsed = parseCommit(commit);
  const breaking = extractBreakingChanges(parsed);
  assert(breaking.length > 0, 'Should detect breaking change in footer');
});

test('Validate valid commit', () => {
  const commit = 'feat(api): add new endpoint';
  const result = validateCommit(commit);
  assert(result.valid === true, 'Should be valid');
  assert(result.errors.length === 0, 'Should have no errors');
});

test('Validate invalid commit type', () => {
  const commit = 'invalid(api): add new endpoint';
  const result = validateCommit(commit);
  assert(result.valid === false, 'Should be invalid');
  assert(result.errors.length > 0, 'Should have errors');
});

// Test Analyzer
console.log('\n📊 Analyzer Tests\n');

test('Analyze empty commits', () => {
  const analytics = analyzeCommits([]);
  assert(analytics.totalCommits === 0, 'Total commits should be 0');
});

test('Analyze commits with contributors', () => {
  const commits = [
    {
      message: 'feat: add feature',
      author: { name: 'John Doe', email: 'john@example.com' },
      date: new Date()
    },
    {
      message: 'fix: fix bug',
      author: { name: 'Jane Smith', email: 'jane@example.com' },
      date: new Date()
    }
  ];
  const analytics = analyzeCommits(commits);
  assert(analytics.totalCommits === 2, 'Total commits should be 2');
  assert(Object.keys(analytics.contributors).length === 2, 'Should have 2 contributors');
});

test('Calculate quality score', () => {
  const analytics = {
    totalCommits: 10,
    qualityMetrics: {
      wellFormatted: 10,
      hasScope: 8,
      hasBody: 5,
      hasIssueReference: 3
    }
  };
  const score = calculateQualityScore(analytics);
  assert(score >= 0 && score <= 100, 'Score should be between 0 and 100');
  assert(typeof score === 'number', 'Score should be a number');
});

// Test Generator
console.log('\n⚙️ Generator Tests\n');

test('Get repository info', () => {
  const repoInfo = getRepoInfo();
  assert(repoInfo.owner, 'Should have owner');
  assert(repoInfo.repo, 'Should have repo');
});

test('Categorize commits', () => {
  const commits = [
    {
      message: 'feat: add feature',
      hash: 'abc123',
      author: { name: 'John', email: 'john@example.com' },
      date: new Date()
    },
    {
      message: 'fix: fix bug',
      hash: 'def456',
      author: { name: 'Jane', email: 'jane@example.com' },
      date: new Date()
    }
  ];

  const { categorized } = categorizeCommits(commits);
  assert(categorized.feat, 'Should have feat category');
  assert(categorized.fix, 'Should have fix category');
  assert(categorized.feat.length === 1, 'Should have 1 feat commit');
  assert(categorized.fix.length === 1, 'Should have 1 fix commit');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n✓ Passed: ${passed}`);
console.log(`✗ Failed: ${failed}`);
console.log(`\nTotal: ${passed + failed} tests\n`);

if (failed > 0) {
  process.exit(1);
}
