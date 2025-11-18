const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const semver = require('semver');
const {
  parseCommit,
  extractBreakingChanges,
  parseIssueReferences,
  parsePRReferences,
  extractCoAuthors,
  getCommitCategory,
  shouldExcludeScope
} = require('./parser');
const { analyzeCommits, generateSummaryReport } = require('./analyzer');
const config = require('./config.json');

/**
 * Get git commits since a specific tag or commit
 * @param {string} since - Tag, commit hash, or 'HEAD'
 * @param {string} until - Tag, commit hash, or 'HEAD' (default: 'HEAD')
 * @returns {Array} Array of commit objects
 */
function getCommits(since = null, until = 'HEAD') {
  try {
    let range;
    if (!since) {
      // Get all commits
      range = until;
    } else {
      range = `${since}..${until}`;
    }

    const format = '--format=%H%n%an%n%ae%n%at%n%s%n%b%n==END==';
    const cmd = `git log ${range} ${format}`;
    const output = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

    const commits = [];
    const commitBlocks = output.split('==END==\n').filter(block => block.trim());

    commitBlocks.forEach(block => {
      const lines = block.split('\n');
      if (lines.length < 5) return;

      const hash = lines[0];
      const authorName = lines[1];
      const authorEmail = lines[2];
      const timestamp = lines[3];
      const subject = lines[4];
      const body = lines.slice(5).join('\n').trim();

      commits.push({
        hash,
        shortHash: hash.substring(0, config.template.hashLength),
        author: {
          name: authorName,
          email: authorEmail
        },
        date: new Date(parseInt(timestamp) * 1000),
        message: `${subject}\n${body}`.trim(),
        subject,
        body
      });
    });

    return commits;
  } catch (error) {
    console.error('Error getting git commits:', error.message);
    return [];
  }
}

/**
 * Get the latest git tag
 * @returns {string|null} Latest tag or null
 */
function getLatestTag() {
  try {
    const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    return tag;
  } catch (error) {
    return null;
  }
}

/**
 * Get all git tags sorted by version
 * @returns {Array} Array of tag names
 */
function getAllTags() {
  try {
    const output = execSync('git tag --sort=-version:refname', { encoding: 'utf8' });
    return output.trim().split('\n').filter(tag => tag);
  } catch (error) {
    return [];
  }
}

/**
 * Get repository information
 * @returns {Object} Repository info
 */
function getRepoInfo() {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    const match = remoteUrl.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);

    if (match) {
      return {
        owner: match[1],
        repo: match[2],
        url: `https://github.com/${match[1]}/${match[2]}`
      };
    }
  } catch (error) {
    // Ignore
  }

  return {
    owner: 'owner',
    repo: 'repo',
    url: ''
  };
}

/**
 * Categorize commits by type
 * @param {Array} commits - Array of commit objects
 * @returns {Object} Categorized commits
 */
function categorizeCommits(commits) {
  const categorized = {};
  const breakingChanges = [];
  const unknownCommits = [];

  commits.forEach(commit => {
    const parsed = parseCommit(commit.message);

    // Check if scope should be excluded
    if (shouldExcludeScope(parsed.scope)) {
      return;
    }

    // Extract breaking changes
    const breaking = extractBreakingChanges(parsed);
    if (breaking.length > 0) {
      breaking.forEach(bc => {
        breakingChanges.push({
          ...commit,
          parsed,
          breakingChange: bc.description
        });
      });
    }

    // Categorize by type
    const type = parsed.type || 'chore';
    if (!categorized[type]) {
      categorized[type] = [];
    }

    categorized[type].push({
      ...commit,
      parsed,
      issues: parseIssueReferences(parsed),
      prs: parsePRReferences(parsed),
      coAuthors: extractCoAuthors(commit.message),
      category: getCommitCategory(type)
    });
  });

  return {
    categorized,
    breakingChanges,
    unknownCommits
  };
}

/**
 * Recommend semantic version bump
 * @param {Object} categorizedCommits - Categorized commits
 * @returns {Object} Version bump recommendation
 */
function recommendVersionBump(categorizedCommits) {
  let bump = 'patch';
  let reason = 'Bug fixes and minor changes';

  // Breaking changes = major
  if (categorizedCommits.breakingChanges.length > 0) {
    bump = 'major';
    reason = `${categorizedCommits.breakingChanges.length} breaking change(s)`;
  }
  // Features = minor
  else if (categorizedCommits.categorized.feat && categorizedCommits.categorized.feat.length > 0) {
    bump = 'minor';
    reason = `${categorizedCommits.categorized.feat.length} new feature(s)`;
  }
  // Fixes or other changes = patch
  else if (categorizedCommits.categorized.fix && categorizedCommits.categorized.fix.length > 0) {
    bump = 'patch';
    reason = `${categorizedCommits.categorized.fix.length} bug fix(es)`;
  }

  return { bump, reason };
}

/**
 * Calculate next version
 * @param {string} currentVersion - Current version
 * @param {string} bump - Version bump type (major, minor, patch)
 * @returns {string} Next version
 */
function calculateNextVersion(currentVersion, bump) {
  if (!currentVersion || !semver.valid(currentVersion)) {
    return '1.0.0';
  }

  return semver.inc(currentVersion, bump);
}

/**
 * Format link using template
 * @param {string} type - Link type (commit, issue, pr, compare)
 * @param {Object} data - Data to substitute in template
 * @returns {string} Formatted link
 */
function formatLink(type, data) {
  const template = config.linkFormats[type];
  if (!template) return '';

  const repoInfo = getRepoInfo();
  let link = template
    .replace('{owner}', repoInfo.owner)
    .replace('{repo}', repoInfo.repo);

  Object.entries(data).forEach(([key, value]) => {
    link = link.replace(`{${key}}`, value);
  });

  return link;
}

/**
 * Generate changelog for a release
 * @param {Object} options - Generation options
 * @returns {Object} Changelog data
 */
function generateChangelog(options = {}) {
  const {
    since = getLatestTag(),
    until = 'HEAD',
    version = null,
    date = new Date()
  } = options;

  // Get commits
  const commits = getCommits(since, until);

  if (commits.length === 0) {
    return {
      version: version || 'Unreleased',
      date,
      commits: [],
      categorized: {},
      breakingChanges: [],
      analytics: null,
      versionBump: null
    };
  }

  // Categorize commits
  const { categorized, breakingChanges } = categorizeCommits(commits);

  // Generate analytics
  const analytics = generateSummaryReport(commits);

  // Recommend version bump
  const versionBump = recommendVersionBump({ categorized, breakingChanges });

  // Calculate next version if not provided
  const nextVersion = version || calculateNextVersion(since, versionBump.bump);

  return {
    version: nextVersion,
    date,
    commits,
    categorized,
    breakingChanges,
    analytics,
    versionBump,
    repoInfo: getRepoInfo(),
    compareUrl: since ? formatLink('compare', { from: since, to: until }) : null
  };
}

/**
 * Render changelog using Handlebars template
 * @param {Object} changelogData - Changelog data
 * @returns {string} Rendered markdown
 */
function renderChangelog(changelogData) {
  const templatePath = path.join(__dirname, 'templates', 'changelog.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');

  // Register Handlebars helpers
  Handlebars.registerHelper('formatDate', function (date) {
    return date.toISOString().split('T')[0];
  });

  Handlebars.registerHelper('commitLink', function (hash) {
    return formatLink('commit', { hash });
  });

  Handlebars.registerHelper('issueLink', function (id) {
    return formatLink('issue', { id });
  });

  Handlebars.registerHelper('prLink', function (id) {
    return formatLink('pr', { id });
  });

  const template = Handlebars.compile(templateSource);
  return template({
    ...changelogData,
    config,
    categoryOrder: config.categoryOrder
  });
}

/**
 * Write changelog to file
 * @param {string} content - Changelog content
 * @param {string} outputPath - Output file path
 */
function writeChangelog(content, outputPath = 'CHANGELOG.md') {
  // If file exists, prepend new content (keep existing changelog)
  if (fs.existsSync(outputPath)) {
    const existing = fs.readFileSync(outputPath, 'utf8');

    // Split existing content to insert after header
    const lines = existing.split('\n');
    const headerEndIndex = lines.findIndex(line => line.startsWith('## '));

    if (headerEndIndex > 0) {
      const header = lines.slice(0, headerEndIndex).join('\n');
      const body = lines.slice(headerEndIndex).join('\n');
      content = `${header}\n\n${content}\n${body}`;
    } else {
      content = `${content}\n\n${existing}`;
    }
  } else {
    // Add header for new changelog
    const header = `# ${config.changelog.headerTitle}\n\n${config.changelog.headerDescription}\n\n`;
    content = header + content;
  }

  fs.writeFileSync(outputPath, content, 'utf8');
}

module.exports = {
  getCommits,
  getLatestTag,
  getAllTags,
  getRepoInfo,
  categorizeCommits,
  recommendVersionBump,
  calculateNextVersion,
  generateChangelog,
  renderChangelog,
  writeChangelog,
  formatLink
};
