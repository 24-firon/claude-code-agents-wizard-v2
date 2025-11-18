const { generateChangelog, formatLink } = require('./generator');
const { createGitHubRelease } = require('./github-integration');
const config = require('./config.json');

/**
 * Generate release notes from changelog data
 * @param {Object} changelogData - Changelog data
 * @returns {string} Release notes in markdown
 */
function generateReleaseNotes(changelogData) {
  let notes = '';

  // Breaking changes section
  if (changelogData.breakingChanges && changelogData.breakingChanges.length > 0) {
    notes += '## ⚠️ BREAKING CHANGES\n\n';
    changelogData.breakingChanges.forEach(commit => {
      notes += `* **${commit.parsed.scope || 'core'}**: ${commit.breakingChange}\n`;
    });
    notes += '\n';
  }

  // Categorized changes
  config.categoryOrder.forEach(type => {
    const commits = changelogData.categorized[type];
    if (!commits || commits.length === 0) return;

    const category = config.commitTypes[type];
    const emoji = config.template.includeEmojis ? `${category.emoji} ` : '';

    notes += `## ${emoji}${category.label}\n\n`;

    commits.forEach(commit => {
      let line = '* ';

      if (commit.parsed.scope) {
        line += `**${commit.parsed.scope}**: `;
      }

      line += commit.parsed.subject;

      // Add issue references
      if (commit.issues && commit.issues.length > 0) {
        const issueLinks = commit.issues.map(id => `[#${id}](${formatLink('issue', { id })})`);
        line += ` (${issueLinks.join(', ')})`;
      }

      // Add PR references
      if (commit.prs && commit.prs.length > 0) {
        const prLinks = commit.prs.map(id => `[PR #${id}](${formatLink('pr', { id })})`);
        line += ` (${prLinks.join(', ')})`;
      }

      // Add commit hash
      if (config.template.showCommitHash) {
        const commitUrl = formatLink('commit', { hash: commit.hash });
        line += ` ([${commit.shortHash}](${commitUrl}))`;
      }

      notes += line + '\n';
    });

    notes += '\n';
  });

  // Contributors section
  if (changelogData.analytics && changelogData.analytics.topContributors) {
    notes += '## 👥 Contributors\n\n';
    notes += 'Thanks to all the contributors who made this release possible:\n\n';

    changelogData.analytics.topContributors.forEach(contributor => {
      notes += `* **${contributor.name}** (${contributor.commits} commit${contributor.commits > 1 ? 's' : ''})\n`;
    });

    notes += '\n';
  }

  // Stats section
  if (changelogData.analytics) {
    notes += '## 📊 Release Statistics\n\n';
    notes += `* Total commits: ${changelogData.analytics.overview.totalCommits}\n`;
    notes += `* Contributors: ${changelogData.analytics.overview.totalContributors}\n`;

    if (changelogData.analytics.overview.breakingChanges > 0) {
      notes += `* Breaking changes: ${changelogData.analytics.overview.breakingChanges}\n`;
    }

    notes += `* Quality score: ${changelogData.analytics.overview.qualityScore}/100\n`;
    notes += '\n';
  }

  // Compare link
  if (changelogData.compareUrl) {
    notes += `**Full Changelog**: ${changelogData.compareUrl}\n`;
  }

  return notes.trim();
}

/**
 * Generate release notes with enhanced GitHub data
 * @param {Object} changelogData - Changelog data (enriched with GitHub data)
 * @returns {string} Enhanced release notes
 */
function generateEnhancedReleaseNotes(changelogData) {
  let notes = generateReleaseNotes(changelogData);

  // Add migration guide for breaking changes
  if (changelogData.breakingChanges && changelogData.breakingChanges.length > 0) {
    notes += '\n\n## 📖 Migration Guide\n\n';
    notes += 'This release contains breaking changes. Please review the following:\n\n';

    changelogData.breakingChanges.forEach((commit, index) => {
      notes += `### ${index + 1}. ${commit.parsed.scope || 'Core'} Changes\n\n`;
      notes += `${commit.breakingChange}\n\n`;

      // Add PR description if available
      if (commit.prData && commit.prData.length > 0) {
        const pr = commit.prData[0];
        if (pr.body) {
          notes += `**Details**: See [PR #${pr.number}](${pr.url}) for more information.\n\n`;
        }
      }
    });
  }

  return notes;
}

/**
 * Create a GitHub release with generated notes
 * @param {Object} options - Release options
 * @returns {Promise<Object>} Created release data
 */
async function createRelease(options = {}) {
  const {
    since = null,
    version = null,
    draft = false,
    prerelease = false,
    enhanced = true
  } = options;

  // Generate changelog
  const changelogData = generateChangelog({ since, version });

  if (changelogData.commits.length === 0) {
    throw new Error('No commits found for release');
  }

  // Generate release notes
  const releaseNotes = enhanced
    ? generateEnhancedReleaseNotes(changelogData)
    : generateReleaseNotes(changelogData);

  // Create GitHub release
  const release = await createGitHubRelease({
    tag: `v${changelogData.version}`,
    name: `Release ${changelogData.version}`,
    body: releaseNotes,
    draft,
    prerelease
  });

  return {
    ...release,
    changelog: changelogData,
    notes: releaseNotes
  };
}

/**
 * Preview release notes without creating release
 * @param {Object} options - Preview options
 * @returns {Object} Preview data
 */
function previewRelease(options = {}) {
  const { since = null, version = null } = options;

  const changelogData = generateChangelog({ since, version });

  if (changelogData.commits.length === 0) {
    return {
      version: 'No changes',
      notes: 'No commits found since last release',
      commits: 0
    };
  }

  const releaseNotes = generateEnhancedReleaseNotes(changelogData);

  return {
    version: changelogData.version,
    versionBump: changelogData.versionBump,
    notes: releaseNotes,
    commits: changelogData.commits.length,
    breakingChanges: changelogData.breakingChanges.length,
    analytics: changelogData.analytics
  };
}

/**
 * Format release notes for different platforms
 * @param {string} notes - Markdown release notes
 * @param {string} format - Output format (github, plain, html)
 * @returns {string} Formatted notes
 */
function formatReleaseNotes(notes, format = 'github') {
  switch (format) {
    case 'plain':
      // Strip markdown formatting
      return notes
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/[*_#]/g, '') // Remove formatting
        .replace(/^#{1,6}\s+/gm, '') // Remove headers
        .trim();

    case 'html':
      // Use marked to convert to HTML
      const marked = require('marked');
      return marked.parse(notes);

    case 'github':
    default:
      return notes;
  }
}

module.exports = {
  generateReleaseNotes,
  generateEnhancedReleaseNotes,
  createRelease,
  previewRelease,
  formatReleaseNotes
};
