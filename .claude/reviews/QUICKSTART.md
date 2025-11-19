# Code Reviewer Quick Start Guide

Get started with the AI-powered code review agent in minutes!

## What is the Code Reviewer?

The `code-reviewer` agent is an AI-powered code quality specialist that performs comprehensive code analysis using Claude Opus. It detects code smells, security vulnerabilities, performance issues, and provides actionable improvement suggestions with detailed explanations.

## Quick Examples

### Example 1: Review a Single File

**Request:**
```
Review the code in src/components/UserDashboard.tsx
```

**What happens:**
- Analyzes code quality and complexity
- Checks TypeScript best practices
- Identifies code smells
- Suggests improvements with examples
- Generates detailed report

---

### Example 2: Review Authentication Module

**Request:**
```
Perform a security-focused review of the authentication module in src/auth/
```

**What happens:**
- Deep security analysis
- Checks for vulnerabilities (SQL injection, XSS, etc.)
- Reviews password handling
- Analyzes input validation
- Checks error handling
- Provides security recommendations

---

### Example 3: PR Review

**Request:**
```
Review the changes in my feature branch compared to main
```

**What happens:**
- Analyzes git diff
- Reviews only changed code
- Checks for introduced issues
- Compares with previous review if available
- Focuses on new/modified code

---

### Example 4: Full Codebase Review

**Request:**
```
Perform a comprehensive code review of the entire project
```

**What happens:**
- Reviews all files (excluding ignored patterns)
- Generates comprehensive metrics
- Identifies hotspots and problem areas
- Provides architecture-level insights
- Creates detailed quality report

---

### Example 5: Performance Review

**Request:**
```
Analyze the performance of the data processing pipeline in src/processors/
```

**What happens:**
- Focuses on performance patterns
- Identifies inefficient algorithms
- Checks for N+1 problems
- Analyzes complexity
- Suggests optimizations with impact estimates

---

## How to Use (Orchestrator Workflow)

As the orchestrator, here's how to integrate code review into your workflow:

```
1. User requests feature: "Build a user authentication system"

2. YOU create todo list:
   [ ] Implement authentication logic
   [ ] Review authentication code
   [ ] Test authentication flow

3. Delegate to coder:
   invoke coder: "Implement user authentication"

4. Review the code:
   invoke code-reviewer: "Review the authentication implementation"

5. Handle review results:
   - If critical issues → invoke stuck agent
   - If clean → proceed to testing

6. Test the feature:
   invoke tester: "Test authentication flow"

7. Mark complete and move to next todo
```

---

## Understanding Review Reports

### Report Sections

1. **Executive Summary** - Quick overview
   - Overall assessment (Excellent/Good/Fair/Needs Improvement/Poor)
   - Statistics (files, issues, quality score)
   - Key findings

2. **Critical Issues** - Must fix immediately
   - Security vulnerabilities
   - Data loss risks
   - Crash-causing bugs

3. **High Priority** - Should fix before merge
   - Major code smells
   - Missing error handling
   - Best practice violations

4. **Medium Priority** - Should fix soon
   - Readability issues
   - Documentation gaps
   - Minor code smells

5. **Low Priority** - Nice to fix
   - Naming improvements
   - Code organization
   - Style consistency

6. **Informational** - Learning opportunities
   - Alternative approaches
   - Best practice tips
   - Resources

### Issue Format

Each issue includes:
- **Location**: File path and line numbers
- **Problem**: What's wrong (with code example)
- **Impact**: Why it matters
- **Recommendation**: How to fix (with code example)
- **References**: Learning resources

---

## Configuration

Customize review behavior in `.claude/agents/reviews-config.json`:

### Change Severity Thresholds

```json
{
  "complexityThresholds": {
    "functionLength": {
      "good": 50,     // Change to 30 for stricter reviews
      "poor": 100     // Change to 70 for stricter reviews
    }
  }
}
```

### Enable/Disable Rules

```json
{
  "languageRules": {
    "javascript": {
      "enabled": true,
      "rules": {
        "no-console": "warn",  // Change to "off" to ignore console.log
        "complexity": ["warn", 10]  // Change 10 to 15 for more lenient
      }
    }
  }
}
```

### Add Custom Patterns

```json
{
  "customRules": {
    "no-lodash": {
      "enabled": true,
      "name": "Avoid Lodash",
      "pattern": "import.*from ['\"](lodash|underscore)",
      "severity": "MEDIUM",
      "message": "Prefer native JavaScript over utility libraries",
      "category": "best-practice"
    }
  }
}
```

### Ignore Files/Patterns

```json
{
  "ignorePatterns": {
    "files": [
      "**/*.test.js",      // Ignore test files
      "**/legacy/**"       // Ignore legacy code
    ]
  }
}
```

---

## Integration Patterns

### Pattern 1: Review After Implementation

```
coder → code-reviewer → tester
```

Best for: Ensuring quality before testing

### Pattern 2: Review on Issues

```
coder → tester → (if fails) → code-reviewer
```

Best for: Diagnosing test failures

### Pattern 3: Periodic Reviews

```
Weekly: code-reviewer reviews entire codebase
```

Best for: Tracking quality trends

### Pattern 4: Pre-Merge Reviews

```
Before merge: code-reviewer reviews PR changes
```

Best for: Maintaining quality standards

---

## Common Use Cases

### Use Case 1: New Feature Development

```
1. Implement feature
2. Review code quality
3. Fix critical/high issues
4. Test functionality
5. Merge
```

### Use Case 2: Bug Fix

```
1. Fix bug
2. Review for side effects
3. Review error handling
4. Test fix
5. Merge
```

### Use Case 3: Refactoring

```
1. Refactor code
2. Review for improvements
3. Compare with before
4. Test unchanged behavior
5. Merge
```

### Use Case 4: Security Audit

```
1. Run security-focused review
2. Address critical vulnerabilities
3. Plan remediation for high issues
4. Re-review after fixes
5. Document security posture
```

---

## Tips for Best Results

### For Developers

1. **Review Early** - Don't wait until the end
2. **Learn from Reviews** - Read explanations and references
3. **Fix Critical First** - Prioritize by severity
4. **Ask Questions** - Use stuck agent if unclear
5. **Track Progress** - Monitor quality score over time

### For Orchestrator

1. **Review Before Testing** - Catch issues early
2. **Don't Skip Reviews** - Quality matters
3. **Escalate Critical** - Use stuck agent for security issues
4. **Track Trends** - Use metrics to measure improvement
5. **Configure Wisely** - Adjust thresholds to project needs

---

## Severity Guide

**When to invoke stuck agent:**

- **CRITICAL issues found** → Always escalate
  - Security vulnerabilities
  - Data loss risks
  - Crash-causing bugs

- **Many HIGH issues** → Consider escalating
  - If refactoring is extensive
  - If architecture needs redesign

- **MEDIUM/LOW issues** → Proceed normally
  - Address in code
  - Document for future

---

## Example Orchestrator Code

```javascript
// After coder completes work
const coderResult = await invoke('coder', {
  task: 'Implement user authentication with JWT'
});

console.log('Coder completed:', coderResult.summary);

// Review the code
const reviewResult = await invoke('code-reviewer', {
  task: 'Review the authentication implementation in src/auth/',
  focus: 'security'  // Optional: focus area
});

console.log('Review completed:', reviewResult.summary);
console.log('Issues found:', reviewResult.issuesBySeverity);

// Handle critical issues
if (reviewResult.critical > 0) {
  const decision = await invoke('stuck', {
    problem: `Found ${reviewResult.critical} critical security issues`,
    context: reviewResult.criticalIssues,
    question: 'Should we fix these before testing, or is there a reason to proceed?'
  });

  if (decision.action === 'fix') {
    // Re-invoke coder to fix issues
    await invoke('coder', {
      task: 'Fix critical security issues: ' + reviewResult.criticalIssues.join(', ')
    });

    // Review again
    await invoke('code-reviewer', {
      task: 'Re-review authentication after security fixes'
    });
  }
}

// If clean or approved, proceed to testing
const testResult = await invoke('tester', {
  task: 'Test authentication flow with valid and invalid credentials'
});
```

---

## Metrics & Tracking

Review metrics are tracked in `.claude/reviews/metrics.json`:

- **Code quality score** - Overall quality (0-100)
- **Issues by severity** - Breakdown of findings
- **Complexity metrics** - Average complexity trends
- **Security score** - Security posture
- **Performance score** - Performance health

Use these metrics to:
- Track improvement over time
- Identify problem areas
- Set quality goals
- Measure refactoring impact

---

## FAQ

**Q: How long does a review take?**
A: Varies by scope. Single file: ~1min. Full codebase: ~5-10min.

**Q: Does it replace manual code review?**
A: No, it complements human review. Best used for automated quality checks.

**Q: Can I customize the rules?**
A: Yes! Edit `reviews-config.json` to adjust thresholds and rules.

**Q: What if I disagree with a finding?**
A: Reviews are suggestions, not requirements. Use judgment and invoke stuck agent if unsure.

**Q: Does it support my language?**
A: JavaScript, TypeScript, Python, Go, Rust, Java are specifically supported. Other languages get general analysis.

**Q: How do I improve my quality score?**
A: Fix critical/high issues first, then address medium priority items. Track trends over time.

---

## Next Steps

1. **Try it!** - Run your first review
2. **Read a report** - Check `example-review-report.md`
3. **Customize** - Edit `reviews-config.json` for your needs
4. **Integrate** - Add to your workflow
5. **Track** - Monitor metrics over time

---

Happy reviewing! 🚀

*For detailed documentation, see README.md*
*For configuration options, see reviews-config.json*
*For example output, see example-review-report.md*
