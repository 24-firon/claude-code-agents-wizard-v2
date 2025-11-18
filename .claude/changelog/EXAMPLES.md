# Changelog Generator - Usage Examples

## Example 1: Basic Changelog Generation

Generate a changelog from the last release:

```bash
./cli.js generate
```

Output:
```
✔ Changelog written to CHANGELOG.md

✨ Changelog generated successfully!

Summary:
  Version: 2.1.0
  Commits: 15
  Breaking Changes: 0
  Recommended Bump: minor (3 new feature(s))
```

## Example 2: Preview Before Generating

Preview what the next release will look like:

```bash
./cli.js preview
```

Output:
```
✔ Preview generated

📋 Release Preview

Version: 2.1.0
Bump Type: minor
Reason: 3 new feature(s)
Commits: 15
Breaking Changes: 0
Quality Score: 88/100

================================================================================
## [2.1.0] (2025-01-15)

### ✨ Features

* **cli**: add interactive mode for release creation (#123)
* **parser**: support custom commit type configurations
...
================================================================================
```

## Example 3: Validate Commit Messages

Check if your commits follow conventional commits:

```bash
./cli.js validate -c 20
```

Output:
```
📝 Commit Validation Report

✓ Valid commits: 18
✗ Invalid commits: 2

⚠️  Issues Found:

[abc1234] Update the documentation
  ✗ Invalid commit type: "Update". Valid types: feat, fix, docs, ...

[def5678] added new feature
  ⚠ Subject should start with lowercase letter
```

## Example 4: Version Bump Recommendation

Get a recommendation for the next version:

```bash
./cli.js bump
```

Output:
```
✔ Analysis complete

📦 Version Bump Recommendation

Current Version: 2.0.0
Recommended Bump: minor
Next Version: 2.1.0
Reason: 3 new feature(s)
```

Apply the bump to package.json:

```bash
./cli.js bump --apply
```

Create a git tag:

```bash
./cli.js bump --apply --tag
```

## Example 5: GitHub Release

Create a GitHub release with auto-generated notes:

```bash
export GITHUB_TOKEN=your_token_here
./cli.js release
```

Output:
```
✔ GitHub release created

✨ Release created successfully!

Tag: v2.1.0
Name: Release 2.1.0
URL: https://github.com/owner/repo/releases/tag/v2.1.0
```

Create a draft release:

```bash
./cli.js release --draft
```

## Example 6: Commit Analytics

View detailed analytics about your commits:

```bash
./cli.js analytics
```

Output:
```
✔ Analysis complete

📊 Commit Analytics
==================================================

Total Commits: 42
Contributors: 8
Breaking Changes: 1
Quality Score: 85/100

📈 Commit Types:
  ✨ Features: 15 (36%)
  🐛 Bug Fixes: 12 (29%)
  📚 Documentation: 8 (19%)
  ♻️ Chores: 7 (17%)

👥 Top Contributors:
  1. John Doe: 15 commits
  2. Jane Smith: 12 commits
  3. Bob Johnson: 8 commits
  4. Alice Williams: 5 commits
  5. Charlie Brown: 2 commits
```

## Example 7: Custom Version Range

Generate changelog for a specific range:

```bash
./cli.js generate -s v1.0.0 -u v2.0.0
```

Generate with a specific version:

```bash
./cli.js generate -v 3.0.0-beta.1
```

## Example 8: Dry Run

Preview the changelog without writing to file:

```bash
./cli.js generate --dry-run
```

## Example 9: Complete Release Workflow

Step-by-step workflow for creating a release:

```bash
# 1. Validate recent commits
./cli.js validate

# 2. Check analytics
./cli.js analytics

# 3. Preview the release
./cli.js preview

# 4. Generate changelog
./cli.js generate

# 5. Review the changelog
cat CHANGELOG.md

# 6. Bump version and tag
./cli.js bump --apply --tag

# 7. Push changes
git push origin main --tags

# 8. Create GitHub release
export GITHUB_TOKEN=your_token
./cli.js release
```

## Example 10: Programmatic Usage

Use the generator in your Node.js code:

```javascript
const { generateChangelog, renderChangelog } = require('./generator');
const { previewRelease } = require('./release-notes-generator');

// Generate changelog data
const data = generateChangelog({
  since: 'v1.0.0',
  version: '2.0.0'
});

console.log(`Found ${data.commits.length} commits`);
console.log(`Breaking changes: ${data.breakingChanges.length}`);
console.log(`Recommended bump: ${data.versionBump.bump}`);

// Render to markdown
const markdown = renderChangelog(data);
console.log(markdown);

// Preview release
const preview = previewRelease({ since: 'v1.0.0' });
console.log(preview.notes);
```

## Example 11: Custom Configuration

Create a custom config.json:

```json
{
  "commitTypes": {
    "feat": {
      "label": "🎉 New Features",
      "emoji": "🎉",
      "semverBump": "minor"
    },
    "fix": {
      "label": "🔧 Bug Fixes",
      "emoji": "🔧",
      "semverBump": "patch"
    }
  },
  "template": {
    "includeEmojis": true,
    "showAuthor": false,
    "showCommitHash": true,
    "hashLength": 8
  }
}
```

## Example 12: Continuous Integration

Use in GitHub Actions:

```yaml
name: Generate Changelog

on:
  push:
    tags:
      - 'v*'

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd .claude/changelog
          npm install

      - name: Generate changelog
        run: |
          cd .claude/changelog
          ./cli.js generate

      - name: Create GitHub Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          cd .claude/changelog
          ./cli.js release
```

## Example 13: Breaking Changes

Handle breaking changes properly:

Commit with breaking change:
```bash
git commit -m "feat!: remove deprecated API

BREAKING CHANGE: The old authentication API has been removed.
Please migrate to the new OAuth-based authentication.

Migration guide:
- Replace auth.login() with auth.oauth.authorize()
- Update API endpoints from /v1/ to /v2/
"
```

Preview the breaking changes:
```bash
./cli.js preview
```

Output will include migration guide:
```
⚠️ BREAKING CHANGES

* **api**: The old authentication API has been removed...

📖 Migration Guide

1. API Changes
The old authentication API has been removed.
Please migrate to the new OAuth-based authentication.

Details: See PR #123 for more information.
```

## Example 14: Batch Processing

Process multiple repositories:

```bash
#!/bin/bash

REPOS=("repo1" "repo2" "repo3")

for repo in "${REPOS[@]}"; do
  echo "Processing $repo..."
  cd "$repo"
  .claude/changelog/cli.js generate
  cd ..
done
```

## Example 15: Quality Improvements

Track quality improvements over time:

```bash
# Check current quality
./cli.js analytics -s v1.0.0

# After improving commits
./cli.js analytics -s v2.0.0

# Compare scores
echo "Compare quality scores between releases"
```

## Tips & Tricks

1. **Alias for convenience**:
   ```bash
   echo 'alias changelog="~/project/.claude/changelog/cli.js"' >> ~/.bashrc
   ```

2. **Pre-commit hook**:
   ```bash
   # .git/hooks/commit-msg
   #!/bin/bash
   .claude/changelog/cli.js validate -c 1
   ```

3. **Weekly reports**:
   ```bash
   # Get weekly stats
   ./cli.js analytics -s "@{1.week.ago}"
   ```

4. **Environment variables**:
   ```bash
   # Save in ~/.bashrc
   export GITHUB_TOKEN=your_token
   export CHANGELOG_OUTPUT=docs/CHANGELOG.md
   ```

5. **Custom templates**:
   Edit `templates/changelog.hbs` to customize output format

## Common Use Cases

### For Open Source Projects
- Generate changelog on each release
- Include contributor statistics
- Show breaking changes prominently
- Link to GitHub issues and PRs

### For Enterprise Projects
- Track commit quality metrics
- Validate commit messages in CI
- Generate internal release notes
- Analyze team contribution patterns

### For Personal Projects
- Keep track of changes over time
- Learn from commit history
- Improve commit message quality
- Prepare for public release

---

For more examples, see the [README.md](README.md) documentation.
