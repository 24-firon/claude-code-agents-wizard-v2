const { Octokit } = require('@octokit/rest');
const { getRepoInfo } = require('./generator');

/**
 * Initialize Octokit client
 * @returns {Octokit} Octokit instance
 */
function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  return new Octokit({
    auth: token
  });
}

/**
 * Check if GitHub token is available
 * @returns {boolean} True if token is available
 */
function hasGitHubToken() {
  return !!process.env.GITHUB_TOKEN;
}

/**
 * Fetch pull request information
 * @param {string} prNumber - PR number
 * @returns {Promise<Object>} PR data
 */
async function fetchPRInfo(prNumber) {
  if (!hasGitHubToken()) {
    return null;
  }

  try {
    const octokit = getOctokit();
    const repoInfo = getRepoInfo();

    const { data } = await octokit.pulls.get({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      pull_number: parseInt(prNumber)
    });

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      url: data.html_url,
      state: data.state,
      merged: data.merged,
      mergedAt: data.merged_at,
      user: {
        login: data.user.login,
        name: data.user.name,
        avatar: data.user.avatar_url
      },
      labels: data.labels.map(label => ({
        name: label.name,
        color: label.color
      }))
    };
  } catch (error) {
    console.error(`Error fetching PR #${prNumber}:`, error.message);
    return null;
  }
}

/**
 * Fetch issue information
 * @param {string} issueNumber - Issue number
 * @returns {Promise<Object>} Issue data
 */
async function fetchIssueInfo(issueNumber) {
  if (!hasGitHubToken()) {
    return null;
  }

  try {
    const octokit = getOctokit();
    const repoInfo = getRepoInfo();

    const { data } = await octokit.issues.get({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      issue_number: parseInt(issueNumber)
    });

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      url: data.html_url,
      state: data.state,
      user: {
        login: data.user.login,
        name: data.user.name,
        avatar: data.user.avatar_url
      },
      labels: data.labels.map(label => ({
        name: label.name,
        color: label.color
      }))
    };
  } catch (error) {
    console.error(`Error fetching issue #${issueNumber}:`, error.message);
    return null;
  }
}

/**
 * Fetch contributor information
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} User data
 */
async function fetchContributorInfo(username) {
  if (!hasGitHubToken()) {
    return null;
  }

  try {
    const octokit = getOctokit();

    const { data } = await octokit.users.getByUsername({
      username
    });

    return {
      login: data.login,
      name: data.name,
      email: data.email,
      avatar: data.avatar_url,
      url: data.html_url,
      bio: data.bio,
      company: data.company,
      location: data.location
    };
  } catch (error) {
    console.error(`Error fetching contributor ${username}:`, error.message);
    return null;
  }
}

/**
 * Enrich commits with GitHub data
 * @param {Array} commits - Array of commit objects
 * @returns {Promise<Array>} Enriched commits
 */
async function enrichCommitsWithGitHub(commits) {
  if (!hasGitHubToken()) {
    console.log('⚠️  No GitHub token found. Skipping GitHub enrichment.');
    console.log('   Set GITHUB_TOKEN environment variable for PR/issue details.');
    return commits;
  }

  const enriched = [];

  for (const commit of commits) {
    const enrichedCommit = { ...commit };

    // Fetch PR information
    if (commit.prs && commit.prs.length > 0) {
      enrichedCommit.prData = [];
      for (const prNumber of commit.prs) {
        const prInfo = await fetchPRInfo(prNumber);
        if (prInfo) {
          enrichedCommit.prData.push(prInfo);
        }
      }
    }

    // Fetch issue information
    if (commit.issues && commit.issues.length > 0) {
      enrichedCommit.issueData = [];
      for (const issueNumber of commit.issues) {
        const issueInfo = await fetchIssueInfo(issueNumber);
        if (issueInfo) {
          enrichedCommit.issueData.push(issueInfo);
        }
      }
    }

    enriched.push(enrichedCommit);
  }

  return enriched;
}

/**
 * Create a GitHub release
 * @param {Object} options - Release options
 * @returns {Promise<Object>} Release data
 */
async function createGitHubRelease(options) {
  if (!hasGitHubToken()) {
    throw new Error('GitHub token required to create releases');
  }

  const {
    tag,
    name,
    body,
    draft = false,
    prerelease = false
  } = options;

  try {
    const octokit = getOctokit();
    const repoInfo = getRepoInfo();

    const { data } = await octokit.repos.createRelease({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      tag_name: tag,
      name: name || tag,
      body,
      draft,
      prerelease
    });

    return {
      id: data.id,
      url: data.html_url,
      tag: data.tag_name,
      name: data.name
    };
  } catch (error) {
    throw new Error(`Failed to create GitHub release: ${error.message}`);
  }
}

/**
 * Get latest GitHub release
 * @returns {Promise<Object>} Latest release data
 */
async function getLatestRelease() {
  if (!hasGitHubToken()) {
    return null;
  }

  try {
    const octokit = getOctokit();
    const repoInfo = getRepoInfo();

    const { data } = await octokit.repos.getLatestRelease({
      owner: repoInfo.owner,
      repo: repoInfo.repo
    });

    return {
      id: data.id,
      tag: data.tag_name,
      name: data.name,
      body: data.body,
      url: data.html_url,
      publishedAt: data.published_at
    };
  } catch (error) {
    if (error.status === 404) {
      return null; // No releases yet
    }
    throw error;
  }
}

/**
 * List all releases
 * @param {number} perPage - Number of releases per page
 * @returns {Promise<Array>} Array of releases
 */
async function listReleases(perPage = 30) {
  if (!hasGitHubToken()) {
    return [];
  }

  try {
    const octokit = getOctokit();
    const repoInfo = getRepoInfo();

    const { data } = await octokit.repos.listReleases({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      per_page: perPage
    });

    return data.map(release => ({
      id: release.id,
      tag: release.tag_name,
      name: release.name,
      body: release.body,
      url: release.html_url,
      publishedAt: release.published_at,
      draft: release.draft,
      prerelease: release.prerelease
    }));
  } catch (error) {
    console.error('Error listing releases:', error.message);
    return [];
  }
}

module.exports = {
  hasGitHubToken,
  fetchPRInfo,
  fetchIssueInfo,
  fetchContributorInfo,
  enrichCommitsWithGitHub,
  createGitHubRelease,
  getLatestRelease,
  listReleases
};
