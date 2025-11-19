# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0](https://github.com/owner/repo/compare/v2.0.0...v2.1.0) (2025-01-15)

### ✨ Features

* **cli**: add interactive mode for release creation ([#123](https://github.com/owner/repo/issues/123)) ([abc1234](https://github.com/owner/repo/commit/abc1234)) - John Doe
* **parser**: support custom commit type configurations ([def5678](https://github.com/owner/repo/commit/def5678)) - Jane Smith
* **analytics**: add commit frequency heat map visualization ([PR #125](https://github.com/owner/repo/pull/125)) ([ghi9012](https://github.com/owner/repo/commit/ghi9012)) - Bob Johnson

### 🐛 Bug Fixes

* **generator**: fix incorrect date formatting in changelog ([#124](https://github.com/owner/repo/issues/124)) ([jkl3456](https://github.com/owner/repo/commit/jkl3456)) - Alice Williams
* **github**: handle rate limiting gracefully ([mno7890](https://github.com/owner/repo/commit/mno7890)) - Charlie Brown

### 📚 Documentation

* **readme**: add troubleshooting section ([pqr1234](https://github.com/owner/repo/commit/pqr1234)) - John Doe
* add migration guide for v2.0 breaking changes ([stu5678](https://github.com/owner/repo/commit/stu5678)) - Jane Smith

### 📦 Code Refactoring

* **parser**: optimize regex patterns for better performance ([vwx9012](https://github.com/owner/repo/commit/vwx9012)) - Bob Johnson

---

### 📊 Statistics

* **Total Commits**: 8
* **Contributors**: 5
* **Quality Score**: 92/100

#### Top Contributors

0. **John Doe** - 2 commits
1. **Jane Smith** - 2 commits
2. **Bob Johnson** - 2 commits
3. **Alice Williams** - 1 commits
4. **Charlie Brown** - 1 commits

#### Commit Type Distribution

* ✨ Features: 3 (37%)
* 🐛 Bug Fixes: 2 (25%)
* 📚 Documentation: 2 (25%)
* 📦 Code Refactoring: 1 (13%)

## [2.0.0](https://github.com/owner/repo/compare/v1.5.0...v2.0.0) (2025-01-01)

### ⚠️ BREAKING CHANGES

* **api**: Configuration file structure has been changed. Migrate your `changelog.config.js` to the new JSON format.
* **cli**: The `--format` flag has been removed. Use `--output` instead.

### ✨ Features

* **api**: redesign configuration system with JSON schema validation ([#100](https://github.com/owner/repo/issues/100)) ([aaa1111](https://github.com/owner/repo/commit/aaa1111))
* **github**: add support for GitHub Enterprise ([bbb2222](https://github.com/owner/repo/commit/bbb2222))
* **templates**: add Handlebars template engine support ([#105](https://github.com/owner/repo/issues/105)) ([ccc3333](https://github.com/owner/repo/commit/ccc3333))

### 🐛 Bug Fixes

* **parser**: handle multi-line commit bodies correctly ([ddd4444](https://github.com/owner/repo/commit/ddd4444))
* **generator**: prevent duplicate entries in changelog ([eee5555](https://github.com/owner/repo/commit/eee5555))

### 📚 Documentation

* complete rewrite of documentation with examples ([fff6666](https://github.com/owner/repo/commit/fff6666))
* add video tutorials and guides ([ggg7777](https://github.com/owner/repo/commit/ggg7777))

### 🚀 Performance Improvements

* **generator**: cache git operations for faster generation ([hhh8888](https://github.com/owner/repo/commit/hhh8888))

---

### 📊 Statistics

* **Total Commits**: 15
* **Contributors**: 8
* **Breaking Changes**: 2
* **Quality Score**: 88/100

## [1.5.0](https://github.com/owner/repo/compare/v1.4.0...v1.5.0) (2024-12-15)

### ✨ Features

* **analytics**: add contributor statistics ([iii9999](https://github.com/owner/repo/commit/iii9999))
* **cli**: add `validate` command for commit message validation ([jjj0000](https://github.com/owner/repo/commit/jjj0000))
* **github**: fetch PR descriptions and labels ([kkk1111](https://github.com/owner/repo/commit/kkk1111))

### 🐛 Bug Fixes

* **parser**: fix scope extraction for nested scopes ([lll2222](https://github.com/owner/repo/commit/lll2222))
* **cli**: improve error messages ([mmm3333](https://github.com/owner/repo/commit/mmm3333))

### 📚 Documentation

* add API documentation ([nnn4444](https://github.com/owner/repo/commit/nnn4444))

---

### 📊 Statistics

* **Total Commits**: 6
* **Contributors**: 4
* **Quality Score**: 85/100

## [1.4.0](https://github.com/owner/repo/compare/v1.3.0...v1.4.0) (2024-12-01)

### ✨ Features

* **generator**: add support for custom commit types ([ooo5555](https://github.com/owner/repo/commit/ooo5555))
* **release**: add draft release support ([ppp6666](https://github.com/owner/repo/commit/ppp6666))

### 🐛 Bug Fixes

* **github**: fix authentication with personal access tokens ([qqq7777](https://github.com/owner/repo/commit/qqq7777))

## [1.3.0](https://github.com/owner/repo/compare/v1.2.0...v1.3.0) (2024-11-15)

### ✨ Features

* **analytics**: calculate commit quality score ([rrr8888](https://github.com/owner/repo/commit/rrr8888))
* **cli**: add `preview` command ([sss9999](https://github.com/owner/repo/commit/sss9999))

### 🐛 Bug Fixes

* **parser**: handle revert commits correctly ([ttt0000](https://github.com/owner/repo/commit/ttt0000))

## [1.2.0](https://github.com/owner/repo/compare/v1.1.0...v1.2.0) (2024-11-01)

### ✨ Features

* **github**: integrate with GitHub API for PR/issue info ([uuu1111](https://github.com/owner/repo/commit/uuu1111))

### 🐛 Bug Fixes

* **generator**: fix version bump calculation ([vvv2222](https://github.com/owner/repo/commit/vvv2222))

## [1.1.0](https://github.com/owner/repo/compare/v1.0.0...v1.1.0) (2024-10-15)

### ✨ Features

* **parser**: add co-author extraction ([www3333](https://github.com/owner/repo/commit/www3333))
* **cli**: add `bump` command ([xxx4444](https://github.com/owner/repo/commit/xxx4444))

### 🐛 Bug Fixes

* **generator**: fix empty changelog generation ([yyy5555](https://github.com/owner/repo/commit/yyy5555))

## [1.0.0](https://github.com/owner/repo/releases/tag/v1.0.0) (2024-10-01)

### ✨ Features

* **initial**: complete changelog generator implementation ([zzz6666](https://github.com/owner/repo/commit/zzz6666))
* **cli**: add command-line interface ([aaa7777](https://github.com/owner/repo/commit/aaa7777))
* **parser**: implement conventional commits parser ([bbb8888](https://github.com/owner/repo/commit/bbb8888))
* **generator**: add main changelog generator ([ccc9999](https://github.com/owner/repo/commit/ccc9999))
* **analytics**: add commit analytics ([ddd0000](https://github.com/owner/repo/commit/ddd0000))
* **github**: add GitHub integration ([eee1111](https://github.com/owner/repo/commit/eee1111))

### 📚 Documentation

* add comprehensive README ([fff2222](https://github.com/owner/repo/commit/fff2222))
* add examples and usage guide ([ggg3333](https://github.com/owner/repo/commit/ggg3333))

---

### 📊 Statistics

* **Total Commits**: 8
* **Contributors**: 3
* **Quality Score**: 95/100

#### Top Contributors

0. **John Doe** - 5 commits
1. **Jane Smith** - 2 commits
2. **Bob Johnson** - 1 commits
