const conventionalCommitsParser = require('conventional-commits-parser');
const config = require('./config.json');

/**
 * Parse a conventional commit message
 * @param {string} commitMessage - Raw commit message
 * @returns {Object} Parsed commit data
 */
function parseCommit(commitMessage) {
  const options = {
    headerPattern: /^(\w*)(?:\(([^)]*)\))?: (.*)$/,
    headerCorrespondence: ['type', 'scope', 'subject'],
    noteKeywords: config.breakingChangeKeywords,
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash']
  };

  const parsed = conventionalCommitsParser.sync(commitMessage, options);

  return {
    type: parsed.type || 'chore',
    scope: parsed.scope || null,
    subject: parsed.subject || commitMessage.split('\n')[0],
    body: parsed.body || null,
    footer: parsed.footer || null,
    notes: parsed.notes || [],
    references: parsed.references || [],
    mentions: parsed.mentions || [],
    revert: parsed.revert || null,
    raw: commitMessage
  };
}

/**
 * Extract breaking changes from a parsed commit
 * @param {Object} parsedCommit - Parsed commit object
 * @returns {Array} Array of breaking change descriptions
 */
function extractBreakingChanges(parsedCommit) {
  const breakingChanges = [];

  // Check notes for breaking changes
  if (parsedCommit.notes && parsedCommit.notes.length > 0) {
    parsedCommit.notes.forEach(note => {
      if (config.breakingChangeKeywords.some(keyword =>
        note.title.toUpperCase().includes(keyword.toUpperCase())
      )) {
        breakingChanges.push({
          description: note.text,
          commit: parsedCommit
        });
      }
    });
  }

  // Check subject for breaking change indicator (!)
  if (parsedCommit.subject && parsedCommit.subject.includes('!')) {
    breakingChanges.push({
      description: parsedCommit.subject.replace('!', '').trim(),
      commit: parsedCommit
    });
  }

  return breakingChanges;
}

/**
 * Parse issue references from commit
 * @param {Object} parsedCommit - Parsed commit object
 * @returns {Array} Array of issue numbers
 */
function parseIssueReferences(parsedCommit) {
  const issues = new Set();

  // From references array
  if (parsedCommit.references && parsedCommit.references.length > 0) {
    parsedCommit.references.forEach(ref => {
      if (ref.issue) {
        issues.add(ref.issue);
      }
    });
  }

  // From body and footer using regex
  const text = `${parsedCommit.body || ''} ${parsedCommit.footer || ''}`;
  const issueRegex = /#(\d+)/g;
  let match;
  while ((match = issueRegex.exec(text)) !== null) {
    issues.add(match[1]);
  }

  return Array.from(issues);
}

/**
 * Parse PR references from commit
 * @param {Object} parsedCommit - Parsed commit object
 * @returns {Array} Array of PR numbers
 */
function parsePRReferences(parsedCommit) {
  const prs = new Set();
  const text = `${parsedCommit.subject || ''} ${parsedCommit.body || ''} ${parsedCommit.footer || ''}`;

  // Match PR references like (#123) or PR #123
  const prRegex = /(?:PR|pr|pull request)?\s*#(\d+)/gi;
  let match;
  while ((match = prRegex.exec(text)) !== null) {
    prs.add(match[1]);
  }

  // Also check references array for PR actions
  if (parsedCommit.references && parsedCommit.references.length > 0) {
    parsedCommit.references.forEach(ref => {
      if (ref.action === 'pull' || ref.prefix === 'PR') {
        prs.add(ref.issue);
      }
    });
  }

  return Array.from(prs);
}

/**
 * Extract co-authors from commit message
 * @param {string} commitMessage - Raw commit message
 * @returns {Array} Array of co-author objects
 */
function extractCoAuthors(commitMessage) {
  const coAuthors = [];
  const coAuthorRegex = /Co-authored-by:\s*([^<]+)<([^>]+)>/gi;
  let match;

  while ((match = coAuthorRegex.exec(commitMessage)) !== null) {
    coAuthors.push({
      name: match[1].trim(),
      email: match[2].trim()
    });
  }

  return coAuthors;
}

/**
 * Validate if commit follows conventional commits format
 * @param {string} commitMessage - Raw commit message
 * @returns {Object} Validation result
 */
function validateCommit(commitMessage) {
  const parsed = parseCommit(commitMessage);
  const validTypes = Object.keys(config.commitTypes);

  const errors = [];
  const warnings = [];

  // Check if type is valid
  if (!validTypes.includes(parsed.type)) {
    errors.push(`Invalid commit type: "${parsed.type}". Valid types: ${validTypes.join(', ')}`);
  }

  // Check if subject exists and is not too long
  if (!parsed.subject || parsed.subject.trim().length === 0) {
    errors.push('Commit subject is required');
  } else if (parsed.subject.length > 100) {
    warnings.push(`Subject is too long (${parsed.subject.length} chars). Recommended: < 100 chars`);
  }

  // Check if subject starts with lowercase
  if (parsed.subject && /^[A-Z]/.test(parsed.subject)) {
    warnings.push('Subject should start with lowercase letter');
  }

  // Check if subject ends with period
  if (parsed.subject && parsed.subject.endsWith('.')) {
    warnings.push('Subject should not end with a period');
  }

  // Check body line length
  if (parsed.body) {
    const bodyLines = parsed.body.split('\n');
    bodyLines.forEach((line, index) => {
      if (line.length > 100) {
        warnings.push(`Body line ${index + 1} is too long (${line.length} chars). Recommended: < 100 chars`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    parsed
  };
}

/**
 * Get commit category configuration
 * @param {string} type - Commit type
 * @returns {Object} Category configuration
 */
function getCommitCategory(type) {
  return config.commitTypes[type] || config.commitTypes.chore;
}

/**
 * Check if commit scope should be excluded
 * @param {string} scope - Commit scope
 * @returns {boolean} True if scope should be excluded
 */
function shouldExcludeScope(scope) {
  return scope && config.excludedScopes.includes(scope);
}

module.exports = {
  parseCommit,
  extractBreakingChanges,
  parseIssueReferences,
  parsePRReferences,
  extractCoAuthors,
  validateCommit,
  getCommitCategory,
  shouldExcludeScope
};
