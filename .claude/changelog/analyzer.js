const { parseCommit, getCommitCategory } = require('./parser');
const config = require('./config.json');

/**
 * Analyze commits and generate statistics
 * @param {Array} commits - Array of commit objects
 * @returns {Object} Analytics data
 */
function analyzeCommits(commits) {
  const analytics = {
    totalCommits: commits.length,
    contributors: {},
    commitTypes: {},
    scopeDistribution: {},
    breakingChanges: 0,
    dateRange: {
      earliest: null,
      latest: null
    },
    commitFrequency: {},
    qualityMetrics: {
      wellFormatted: 0,
      hasScope: 0,
      hasBody: 0,
      hasIssueReference: 0,
      averageSubjectLength: 0
    }
  };

  if (commits.length === 0) {
    return analytics;
  }

  let totalSubjectLength = 0;

  commits.forEach(commit => {
    // Parse commit message
    const parsed = parseCommit(commit.message);

    // Track contributors
    const author = commit.author.name;
    if (!analytics.contributors[author]) {
      analytics.contributors[author] = {
        name: author,
        email: commit.author.email,
        commits: 0,
        additions: 0,
        deletions: 0,
        types: {}
      };
    }
    analytics.contributors[author].commits++;

    // Track commit types
    if (!analytics.commitTypes[parsed.type]) {
      analytics.commitTypes[parsed.type] = {
        count: 0,
        label: getCommitCategory(parsed.type).label,
        emoji: getCommitCategory(parsed.type).emoji
      };
    }
    analytics.commitTypes[parsed.type].count++;

    // Track contributor types
    if (!analytics.contributors[author].types[parsed.type]) {
      analytics.contributors[author].types[parsed.type] = 0;
    }
    analytics.contributors[author].types[parsed.type]++;

    // Track scope distribution
    if (parsed.scope) {
      if (!analytics.scopeDistribution[parsed.scope]) {
        analytics.scopeDistribution[parsed.scope] = 0;
      }
      analytics.scopeDistribution[parsed.scope]++;
      analytics.qualityMetrics.hasScope++;
    }

    // Track breaking changes
    if (parsed.notes && parsed.notes.length > 0) {
      const hasBreaking = parsed.notes.some(note =>
        config.breakingChangeKeywords.some(keyword =>
          note.title.toUpperCase().includes(keyword.toUpperCase())
        )
      );
      if (hasBreaking) {
        analytics.breakingChanges++;
      }
    }

    // Track date range
    const commitDate = new Date(commit.date);
    if (!analytics.dateRange.earliest || commitDate < analytics.dateRange.earliest) {
      analytics.dateRange.earliest = commitDate;
    }
    if (!analytics.dateRange.latest || commitDate > analytics.dateRange.latest) {
      analytics.dateRange.latest = commitDate;
    }

    // Track commit frequency by day
    const dateKey = commitDate.toISOString().split('T')[0];
    if (!analytics.commitFrequency[dateKey]) {
      analytics.commitFrequency[dateKey] = 0;
    }
    analytics.commitFrequency[dateKey]++;

    // Quality metrics
    if (parsed.type && parsed.subject) {
      analytics.qualityMetrics.wellFormatted++;
    }
    if (parsed.body) {
      analytics.qualityMetrics.hasBody++;
    }
    if (parsed.references && parsed.references.length > 0) {
      analytics.qualityMetrics.hasIssueReference++;
    }
    totalSubjectLength += (parsed.subject || '').length;
  });

  // Calculate average subject length
  analytics.qualityMetrics.averageSubjectLength = Math.round(
    totalSubjectLength / commits.length
  );

  return analytics;
}

/**
 * Get top contributors sorted by commit count
 * @param {Object} analytics - Analytics data
 * @param {number} limit - Number of top contributors to return
 * @returns {Array} Array of top contributors
 */
function getTopContributors(analytics, limit = 10) {
  return Object.values(analytics.contributors)
    .sort((a, b) => b.commits - a.commits)
    .slice(0, limit);
}

/**
 * Get commit type distribution as percentages
 * @param {Object} analytics - Analytics data
 * @returns {Object} Commit type distribution with percentages
 */
function getTypeDistribution(analytics) {
  const distribution = {};
  const total = analytics.totalCommits;

  Object.entries(analytics.commitTypes).forEach(([type, data]) => {
    distribution[type] = {
      ...data,
      percentage: Math.round((data.count / total) * 100)
    };
  });

  return distribution;
}

/**
 * Calculate commit frequency pattern
 * @param {Object} analytics - Analytics data
 * @returns {Object} Frequency pattern analysis
 */
function analyzeFrequencyPattern(analytics) {
  const frequencies = Object.values(analytics.commitFrequency);
  const days = Object.keys(analytics.commitFrequency).length;

  if (frequencies.length === 0) {
    return {
      averagePerDay: 0,
      maxInDay: 0,
      minInDay: 0,
      totalDays: 0
    };
  }

  return {
    averagePerDay: Math.round((analytics.totalCommits / days) * 10) / 10,
    maxInDay: Math.max(...frequencies),
    minInDay: Math.min(...frequencies),
    totalDays: days
  };
}

/**
 * Calculate quality score (0-100)
 * @param {Object} analytics - Analytics data
 * @returns {number} Quality score
 */
function calculateQualityScore(analytics) {
  if (analytics.totalCommits === 0) {
    return 0;
  }

  const metrics = analytics.qualityMetrics;
  const total = analytics.totalCommits;

  const weights = {
    wellFormatted: 0.3,
    hasScope: 0.2,
    hasBody: 0.3,
    hasIssueReference: 0.2
  };

  const score =
    (metrics.wellFormatted / total) * weights.wellFormatted * 100 +
    (metrics.hasScope / total) * weights.hasScope * 100 +
    (metrics.hasBody / total) * weights.hasBody * 100 +
    (metrics.hasIssueReference / total) * weights.hasIssueReference * 100;

  return Math.round(score);
}

/**
 * Generate a summary report
 * @param {Array} commits - Array of commit objects
 * @returns {Object} Summary report
 */
function generateSummaryReport(commits) {
  const analytics = analyzeCommits(commits);
  const topContributors = getTopContributors(analytics, 5);
  const typeDistribution = getTypeDistribution(analytics);
  const frequencyPattern = analyzeFrequencyPattern(analytics);
  const qualityScore = calculateQualityScore(analytics);

  return {
    overview: {
      totalCommits: analytics.totalCommits,
      totalContributors: Object.keys(analytics.contributors).length,
      breakingChanges: analytics.breakingChanges,
      dateRange: analytics.dateRange,
      qualityScore
    },
    topContributors,
    typeDistribution,
    frequencyPattern,
    scopeDistribution: analytics.scopeDistribution
  };
}

/**
 * Format analytics for console output
 * @param {Object} analytics - Analytics data
 * @returns {string} Formatted string
 */
function formatAnalytics(analytics) {
  const summary = generateSummaryReport(
    // Note: This expects raw commits, but we're working with analytics
    // In practice, this would be called with commits, not analytics
    []
  );

  let output = '\n📊 Commit Analytics\n';
  output += '='.repeat(50) + '\n\n';

  output += `Total Commits: ${analytics.totalCommits}\n`;
  output += `Contributors: ${Object.keys(analytics.contributors).length}\n`;
  output += `Breaking Changes: ${analytics.breakingChanges}\n`;
  output += `Quality Score: ${calculateQualityScore(analytics)}/100\n\n`;

  output += '📈 Commit Types:\n';
  Object.entries(analytics.commitTypes).forEach(([type, data]) => {
    const percentage = Math.round((data.count / analytics.totalCommits) * 100);
    output += `  ${data.emoji} ${data.label}: ${data.count} (${percentage}%)\n`;
  });

  output += '\n👥 Top Contributors:\n';
  getTopContributors(analytics, 5).forEach((contributor, index) => {
    output += `  ${index + 1}. ${contributor.name}: ${contributor.commits} commits\n`;
  });

  return output;
}

module.exports = {
  analyzeCommits,
  getTopContributors,
  getTypeDistribution,
  analyzeFrequencyPattern,
  calculateQualityScore,
  generateSummaryReport,
  formatAnalytics
};
