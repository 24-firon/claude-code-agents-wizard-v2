# Intelligent Changelog Generator

An intelligent, automated changelog generator with conventional commits support, semantic versioning, GitHub integration, and beautiful formatting.

## Features

- **Conventional Commits**: Full support for conventional commits specification
- **Semantic Versioning**: Automatic version bump recommendations
- **GitHub Integration**: Fetch PR/issue descriptions, labels, and contributor info
- **Beautiful Output**: Handlebars templates with emojis and markdown formatting
- **Commit Analytics**: Contributor statistics, quality scores, and insights
- **CLI Tool**: Powerful command-line interface with multiple commands
- **Breaking Changes**: Automatic detection and migration guide generation
- **Customizable**: Extensive configuration options
- **Release Notes**: Generate GitHub release notes automatically

## Installation

```bash
# Install dependencies
npm install

# Make CLI executable
chmod +x cli.js

# Link globally (optional)
npm link
```

## Quick Start

```bash
# Generate changelog
./cli.js generate

# Preview next release
./cli.js preview

# Validate commit messages
./cli.js validate

# Get version bump recommendation
./cli.js bump

# Create GitHub release
export GITHUB_TOKEN=your_token_here
./cli.js release
```

## Commands

### Generate Changelog

Generate a changelog from git commits:

```bash
./cli.js generate [options]

Options:
  -s, --since <tag>      Generate changelog since this tag
  -u, --until <ref>      Generate changelog until this ref (default: HEAD)
  -v, --version <ver>    Version for this release
  -o, --output <file>    Output file (default: CHANGELOG.md)
  --no-analytics         Exclude analytics from changelog
  --append               Append to existing changelog (default: true)
  --dry-run              Preview without writing file
```

Examples:

```bash
# Generate changelog since last tag
./cli.js generate

# Generate changelog for specific version
./cli.js generate -v 2.0.0

# Generate and preview without writing
./cli.js generate --dry-run

# Generate since specific tag
./cli.js generate -s v1.0.0
```

### Preview Release

Preview the next release without creating it:

```bash
./cli.js preview [options]

Options:
  -s, --since <tag>      Preview since this tag
  -v, --version <ver>    Version for preview
```

Examples:

```bash
# Preview next release
./cli.js preview

# Preview with specific version
./cli.js preview -v 2.1.0
```

### Validate Commits

Validate commit messages against conventional commits:

```bash
./cli.js validate [options]

Options:
  -c, --commits <num>    Number of recent commits to validate (default: 10)
  --all                  Validate all commits
```

Examples:

```bash
# Validate last 10 commits
./cli.js validate

# Validate last 50 commits
./cli.js validate -c 50

# Validate all commits
./cli.js validate --all
```

### Bump Version

Get version bump recommendation and optionally apply it:

```bash
./cli.js bump [options]

Options:
  -s, --since <tag>      Analyze commits since this tag
  --apply                Apply the version bump to package.json
  --tag                  Create git tag for new version
```

Examples:

```bash
# Get recommendation
./cli.js bump

# Apply bump to package.json
./cli.js bump --apply

# Apply and create git tag
./cli.js bump --apply --tag
```

### Create GitHub Release

Create a GitHub release with generated changelog:

```bash
./cli.js release [options]

Options:
  -s, --since <tag>      Release since this tag
  -v, --version <ver>    Version for this release
  --draft                Create as draft release
  --prerelease           Mark as prerelease
```

Examples:

```bash
# Create release
export GITHUB_TOKEN=your_token
./cli.js release

# Create draft release
./cli.js release --draft

# Create prerelease
./cli.js release --prerelease
```

### Analytics

Show commit analytics and statistics:

```bash
./cli.js analytics [options]

Options:
  -s, --since <tag>      Analyze commits since this tag
  -u, --until <ref>      Analyze commits until this ref (default: HEAD)
```

Examples:

```bash
# Show analytics since last tag
./cli.js analytics

# Analyze specific range
./cli.js analytics -s v1.0.0 -u v2.0.0
```

## Configuration

Edit `config.json` to customize behavior:

```json
{
  "commitTypes": {
    "feat": {
      "label": "Features",
      "emoji": "✨",
      "semverBump": "minor"
    },
    "fix": {
      "label": "Bug Fixes",
      "emoji": "🐛",
      "semverBump": "patch"
    }
  },
  "categoryOrder": ["feat", "fix", "docs", "..."],
  "breakingChangeKeywords": ["BREAKING CHANGE", "BREAKING CHANGES"],
  "template": {
    "includeEmojis": true,
    "showAuthor": true,
    "showCommitHash": true
  }
}
```

### Commit Types

Define custom commit types with labels, emojis, and semver bump rules:

- `feat`: New features (minor bump)
- `fix`: Bug fixes (patch bump)
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes
- `revert`: Revert previous commits

### Link Formats

Customize how links are generated:

```json
{
  "linkFormats": {
    "commit": "https://github.com/{owner}/{repo}/commit/{hash}",
    "issue": "https://github.com/{owner}/{repo}/issues/{id}",
    "pr": "https://github.com/{owner}/{repo}/pull/{id}"
  }
}
```

### Template Options

Control what appears in the changelog:

```json
{
  "template": {
    "includeEmojis": true,
    "groupByScope": false,
    "showAuthor": true,
    "showCommitHash": true,
    "hashLength": 7,
    "includeDate": true
  }
}
```

## Conventional Commits Format

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Examples:

```
feat(api): add user authentication endpoint

Implement JWT-based authentication with refresh tokens.
Includes rate limiting and security headers.

Closes #123
BREAKING CHANGE: API now requires authentication headers
```

```
fix(parser): handle multi-line commit bodies

Previously, multi-line bodies were not parsed correctly.
This fix ensures all lines are captured.

Fixes #456
```

```
docs: update installation instructions

Add troubleshooting section and common issues.
```

### Breaking Changes

Indicate breaking changes in two ways:

1. Add `!` after type/scope: `feat!: remove deprecated API`
2. Add footer: `BREAKING CHANGE: API endpoint renamed`

## GitHub Integration

Set up GitHub integration for enhanced features:

```bash
# Set GitHub token
export GITHUB_TOKEN=your_personal_access_token

# Or add to your shell profile
echo 'export GITHUB_TOKEN=your_token' >> ~/.bashrc
```

With GitHub integration enabled:

- Fetch PR descriptions and labels
- Get issue details automatically
- Retrieve contributor information
- Create releases programmatically

## Commit Analytics

The generator provides detailed analytics:

- **Total commits**: Number of commits in the release
- **Contributors**: Number of unique contributors
- **Breaking changes**: Count of breaking changes
- **Quality score**: 0-100 score based on commit quality
- **Type distribution**: Percentage breakdown by commit type
- **Top contributors**: Most active contributors
- **Commit frequency**: Commits per day analysis

Quality score factors:

- Well-formatted commits (30%)
- Commits with scope (20%)
- Commits with body (30%)
- Commits with issue references (20%)

## Templates

Customize the changelog template by editing `templates/changelog.hbs`:

```handlebars
## [{{version}}]({{compareUrl}}) ({{formatDate date}})

{{#if breakingChanges.length}}
### ⚠️ BREAKING CHANGES
{{#each breakingChanges}}
* **{{parsed.scope}}:** {{breakingChange}}
{{/each}}
{{/if}}

{{#each categoryOrder}}
### {{emoji}} {{label}}
{{#each commits}}
* {{subject}} ([{{shortHash}}]({{commitLink hash}}))
{{/each}}
{{/each}}
```

Available helpers:

- `formatDate`: Format date as YYYY-MM-DD
- `commitLink`: Generate commit link
- `issueLink`: Generate issue link
- `prLink`: Generate PR link

## API Usage

Use the generator programmatically:

```javascript
const { generateChangelog, renderChangelog, writeChangelog } = require('./generator');
const { previewRelease, createRelease } = require('./release-notes-generator');

// Generate changelog
const data = generateChangelog({
  since: 'v1.0.0',
  until: 'HEAD',
  version: '2.0.0'
});

// Render to markdown
const markdown = renderChangelog(data);

// Write to file
writeChangelog(markdown, 'CHANGELOG.md');

// Preview release
const preview = previewRelease({ since: 'v1.0.0' });
console.log(preview.notes);

// Create GitHub release
const release = await createRelease({
  version: '2.0.0',
  draft: false
});
```

## Semantic Versioning

The generator automatically recommends version bumps:

- **Major** (x.0.0): Breaking changes detected
- **Minor** (0.x.0): New features added
- **Patch** (0.0.x): Bug fixes or other changes

Version calculation rules:

1. If breaking changes exist → major bump
2. Else if features exist → minor bump
3. Else if fixes exist → patch bump
4. Else → patch bump

## Best Practices

1. **Follow conventional commits**: Consistent format improves changelog quality
2. **Use scopes**: Group related changes together
3. **Write descriptive subjects**: Clear, concise commit messages
4. **Reference issues/PRs**: Link commits to context
5. **Document breaking changes**: Always explain breaking changes
6. **Keep commits atomic**: One logical change per commit
7. **Use appropriate types**: Choose the correct commit type

## Troubleshooting

### No commits found

**Problem**: `No commits found since last release`

**Solution**:
- Create some commits first
- Or specify a different `--since` tag
- Check if you have any git tags: `git tag -l`

### Invalid commit format

**Problem**: Commits fail validation

**Solution**:
- Follow conventional commits format: `type(scope): subject`
- Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject should be lowercase and < 100 characters

### GitHub token errors

**Problem**: `GitHub token required`

**Solution**:
```bash
export GITHUB_TOKEN=your_token
# Get token from https://github.com/settings/tokens
```

### Permission denied

**Problem**: `Permission denied: ./cli.js`

**Solution**:
```bash
chmod +x cli.js
```

## Examples

### Basic Workflow

```bash
# 1. Make some commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update readme"

# 2. Validate commits
./cli.js validate

# 3. Preview release
./cli.js preview

# 4. Generate changelog
./cli.js generate

# 5. Bump version
./cli.js bump --apply --tag

# 6. Create GitHub release
./cli.js release
```

### Release Preparation

```bash
# Check what's new since last release
./cli.js preview

# Get version recommendation
./cli.js bump

# Generate changelog for review
./cli.js generate --dry-run

# Apply changes
./cli.js generate
./cli.js bump --apply --tag

# Create release
./cli.js release
```

### Quality Checks

```bash
# Validate recent commits
./cli.js validate -c 20

# Check analytics
./cli.js analytics

# Review quality score
./cli.js preview
```

## Contributing

Contributions are welcome! Please follow conventional commits for your PRs.

## License

MIT License - see LICENSE file for details

## Support

- **Issues**: Report bugs or request features on GitHub
- **Documentation**: Check this README and code comments
- **Examples**: See CHANGELOG.md for example output

---

Made with ❤️ by Claude Code Agents
