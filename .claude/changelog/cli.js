#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const {
  generateChangelog,
  renderChangelog,
  writeChangelog,
  getLatestTag,
  getAllTags,
  calculateNextVersion
} = require('./generator');
const { previewRelease, createRelease } = require('./release-notes-generator');
const { validateCommit } = require('./parser');
const { analyzeCommits, formatAnalytics, generateSummaryReport } = require('./analyzer');
const { hasGitHubToken } = require('./github-integration');
const { execSync } = require('child_process');
const config = require('./config.json');

const program = new Command();

program
  .name('changelog')
  .description('Intelligent automated changelog generator')
  .version('1.0.0');

/**
 * Generate command - Create changelog
 */
program
  .command('generate')
  .description('Generate changelog from git commits')
  .option('-s, --since <tag>', 'Generate changelog since this tag')
  .option('-u, --until <ref>', 'Generate changelog until this ref', 'HEAD')
  .option('-v, --version <version>', 'Version for this release')
  .option('-o, --output <file>', 'Output file', 'CHANGELOG.md')
  .option('--no-analytics', 'Exclude analytics from changelog')
  .option('--append', 'Append to existing changelog', true)
  .option('--dry-run', 'Preview without writing file')
  .action(async (options) => {
    const spinner = ora('Generating changelog...').start();

    try {
      // Get commits
      const since = options.since || getLatestTag();
      const changelogData = generateChangelog({
        since,
        until: options.until,
        version: options.version
      });

      if (changelogData.commits.length === 0) {
        spinner.warn('No commits found since last release');
        console.log(chalk.yellow('\n💡 Tip: Create some commits or specify a different --since tag'));
        return;
      }

      // Optionally remove analytics
      if (!options.analytics) {
        changelogData.analytics = null;
      }

      // Render changelog
      const markdown = renderChangelog(changelogData);

      if (options.dryRun) {
        spinner.succeed('Changelog preview generated');
        console.log(chalk.cyan('\n' + '='.repeat(80)));
        console.log(markdown);
        console.log(chalk.cyan('='.repeat(80) + '\n'));
      } else {
        // Write to file
        writeChangelog(markdown, options.output);
        spinner.succeed(`Changelog written to ${options.output}`);

        // Show summary
        console.log(chalk.green('\n✨ Changelog generated successfully!\n'));
        console.log(chalk.bold('Summary:'));
        console.log(`  Version: ${chalk.cyan(changelogData.version)}`);
        console.log(`  Commits: ${chalk.cyan(changelogData.commits.length)}`);
        console.log(`  Breaking Changes: ${chalk.cyan(changelogData.breakingChanges.length)}`);
        if (changelogData.versionBump) {
          console.log(`  Recommended Bump: ${chalk.cyan(changelogData.versionBump.bump)} (${changelogData.versionBump.reason})`);
        }
      }
    } catch (error) {
      spinner.fail('Failed to generate changelog');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Preview command - Preview next release
 */
program
  .command('preview')
  .description('Preview changelog for next release')
  .option('-s, --since <tag>', 'Preview since this tag')
  .option('-v, --version <version>', 'Version for preview')
  .action(async (options) => {
    const spinner = ora('Generating preview...').start();

    try {
      const preview = previewRelease({
        since: options.since,
        version: options.version
      });

      spinner.succeed('Preview generated');

      console.log(chalk.bold.cyan('\n📋 Release Preview\n'));
      console.log(chalk.bold('Version:'), chalk.cyan(preview.version));

      if (preview.versionBump) {
        console.log(chalk.bold('Bump Type:'), chalk.cyan(preview.versionBump.bump));
        console.log(chalk.bold('Reason:'), preview.versionBump.reason);
      }

      console.log(chalk.bold('Commits:'), chalk.cyan(preview.commits));
      console.log(chalk.bold('Breaking Changes:'), chalk.cyan(preview.breakingChanges));

      if (preview.analytics) {
        console.log(chalk.bold('Quality Score:'), chalk.cyan(`${preview.analytics.overview.qualityScore}/100`));
      }

      console.log(chalk.cyan('\n' + '='.repeat(80)));
      console.log(preview.notes);
      console.log(chalk.cyan('='.repeat(80) + '\n'));
    } catch (error) {
      spinner.fail('Failed to generate preview');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Validate command - Validate commit messages
 */
program
  .command('validate')
  .description('Validate commit messages against conventional commits')
  .option('-c, --commits <number>', 'Number of recent commits to validate', '10')
  .option('--all', 'Validate all commits')
  .action(async (options) => {
    const spinner = ora('Validating commits...').start();

    try {
      // Get commits
      const limit = options.all ? '' : `-n ${options.commits}`;
      const output = execSync(`git log ${limit} --format=%H%n%s%n%b%n==END==`, { encoding: 'utf8' });
      const commitBlocks = output.split('==END==\n').filter(block => block.trim());

      let validCount = 0;
      let invalidCount = 0;
      const issues = [];

      commitBlocks.forEach(block => {
        const lines = block.split('\n');
        if (lines.length < 2) return;

        const hash = lines[0];
        const message = lines.slice(1).join('\n').trim();

        const validation = validateCommit(message);

        if (validation.valid) {
          validCount++;
        } else {
          invalidCount++;
          issues.push({
            hash: hash.substring(0, 7),
            message: message.split('\n')[0],
            errors: validation.errors,
            warnings: validation.warnings
          });
        }
      });

      spinner.stop();

      console.log(chalk.bold.cyan('\n📝 Commit Validation Report\n'));
      console.log(chalk.green(`✓ Valid commits: ${validCount}`));
      console.log(chalk.red(`✗ Invalid commits: ${invalidCount}`));

      if (issues.length > 0) {
        console.log(chalk.bold('\n⚠️  Issues Found:\n'));
        issues.forEach(issue => {
          console.log(chalk.yellow(`[${issue.hash}]`), chalk.white(issue.message));
          issue.errors.forEach(error => {
            console.log(chalk.red(`  ✗ ${error}`));
          });
          issue.warnings.forEach(warning => {
            console.log(chalk.yellow(`  ⚠ ${warning}`));
          });
          console.log();
        });

        process.exit(1);
      } else {
        console.log(chalk.green('\n✨ All commits are valid!\n'));
      }
    } catch (error) {
      spinner.fail('Failed to validate commits');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Bump command - Bump version based on commits
 */
program
  .command('bump')
  .description('Recommend and apply version bump')
  .option('-s, --since <tag>', 'Analyze commits since this tag')
  .option('--apply', 'Apply the version bump to package.json')
  .option('--tag', 'Create git tag for new version')
  .action(async (options) => {
    const spinner = ora('Analyzing commits...').start();

    try {
      const since = options.since || getLatestTag();
      const changelogData = generateChangelog({ since });

      if (changelogData.commits.length === 0) {
        spinner.warn('No commits found to analyze');
        return;
      }

      const { versionBump } = changelogData;
      const currentVersion = since || '0.0.0';
      const nextVersion = changelogData.version;

      spinner.succeed('Analysis complete');

      console.log(chalk.bold.cyan('\n📦 Version Bump Recommendation\n'));
      console.log(chalk.bold('Current Version:'), chalk.cyan(currentVersion));
      console.log(chalk.bold('Recommended Bump:'), chalk.cyan(versionBump.bump));
      console.log(chalk.bold('Next Version:'), chalk.cyan(nextVersion));
      console.log(chalk.bold('Reason:'), versionBump.reason);

      if (options.apply) {
        const packageJsonPath = path.join(process.cwd(), 'package.json');

        if (!fs.existsSync(packageJsonPath)) {
          console.log(chalk.yellow('\n⚠️  No package.json found'));
          return;
        }

        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Update package.json to version ${nextVersion}?`,
            default: false
          }
        ]);

        if (confirm) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          packageJson.version = nextVersion;
          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

          console.log(chalk.green(`✓ Updated package.json to ${nextVersion}`));

          if (options.tag) {
            execSync(`git add package.json && git commit -m "chore: bump version to ${nextVersion}" && git tag v${nextVersion}`);
            console.log(chalk.green(`✓ Created git tag v${nextVersion}`));
          }
        }
      }
    } catch (error) {
      spinner.fail('Failed to analyze version bump');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Release command - Create GitHub release
 */
program
  .command('release')
  .description('Create GitHub release with changelog')
  .option('-s, --since <tag>', 'Release since this tag')
  .option('-v, --version <version>', 'Version for this release')
  .option('--draft', 'Create as draft release')
  .option('--prerelease', 'Mark as prerelease')
  .action(async (options) => {
    if (!hasGitHubToken()) {
      console.error(chalk.red('\n❌ Error: GITHUB_TOKEN environment variable is required'));
      console.log(chalk.yellow('Set it with: export GITHUB_TOKEN=your_token_here\n'));
      process.exit(1);
    }

    const spinner = ora('Creating GitHub release...').start();

    try {
      const release = await createRelease({
        since: options.since,
        version: options.version,
        draft: options.draft,
        prerelease: options.prerelease
      });

      spinner.succeed('GitHub release created');

      console.log(chalk.green('\n✨ Release created successfully!\n'));
      console.log(chalk.bold('Tag:'), chalk.cyan(release.tag));
      console.log(chalk.bold('Name:'), chalk.cyan(release.name));
      console.log(chalk.bold('URL:'), chalk.cyan(release.url));
      console.log();
    } catch (error) {
      spinner.fail('Failed to create release');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Analytics command - Show commit analytics
 */
program
  .command('analytics')
  .description('Show commit analytics and statistics')
  .option('-s, --since <tag>', 'Analyze commits since this tag')
  .option('-u, --until <ref>', 'Analyze commits until this ref', 'HEAD')
  .action(async (options) => {
    const spinner = ora('Analyzing commits...').start();

    try {
      const since = options.since || getLatestTag();
      const changelogData = generateChangelog({ since, until: options.until });

      if (changelogData.commits.length === 0) {
        spinner.warn('No commits found to analyze');
        return;
      }

      const analytics = analyzeCommits(changelogData.commits);

      spinner.succeed('Analysis complete');

      console.log(formatAnalytics(analytics));
    } catch (error) {
      spinner.fail('Failed to analyze commits');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (program.args.length === 0) {
  program.help();
}
