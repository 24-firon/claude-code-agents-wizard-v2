# Claude Code Agent Benchmarking Suite

A production-grade performance benchmarking suite for comparing and analyzing agent performance with statistical rigor, beautiful reporting, and CI/CD integration.

## Features

- **High-Precision Timing**: Microsecond-level performance measurement
- **Statistical Analysis**: Mean, median, stddev, P95, P99, coefficient of variation
- **System Metrics**: CPU usage, memory consumption, system information
- **Warmup Rounds**: Eliminate JIT compiler effects
- **Multiple Iterations**: Statistical validity through repeated measurements
- **Beautiful Reports**: Console, HTML, and JSON output formats
- **Baseline Management**: Save and compare against historical baselines
- **Regression Detection**: Automatic detection of performance regressions
- **CI/CD Ready**: Exit codes and thresholds for continuous integration
- **Comprehensive Coverage**: Benchmarks for all agent types and system components

## Installation

```bash
cd .claude/benchmarks
npm install
```

## Quick Start

### Run All Benchmarks

```bash
npm run bench:all
```

### Run Specific Agent Benchmarks

```bash
# Coder agent
npm run bench:coder

# Tester agent
npm run bench:tester

# All benchmarks with custom iterations
node cli.js run --all --iterations 20
```

### Compare Results

```bash
# Compare two benchmark runs
node compare.js results/baseline.json results/current.json

# Compare with saved baseline
npm run bench -- --compare-baseline
```

### Manage Baselines

```bash
# Save current results as baseline
node baseline.js save results/benchmark-results.json

# Show baseline info
node baseline.js show

# View baseline history
node baseline.js history
```

## CLI Usage

### Run Benchmarks

```bash
node cli.js run [files...] [options]

Options:
  -a, --all                    Run all benchmarks
  -i, --iterations <number>    Number of iterations
  -w, --warmup <number>        Number of warmup rounds
  --no-console                 Disable console reporter
  --no-json                    Disable JSON reporter
  --no-html                    Disable HTML reporter
  --output <path>              Output directory for results
  --compare-baseline           Compare results with baseline
  --ci                         CI mode (fail on regression)

Examples:
  node cli.js run --all
  node cli.js run benchmarks/coder-agent.bench.js --iterations 50
  node cli.js run --all --ci --compare-baseline
```

### List Available Benchmarks

```bash
node cli.js list
```

### Generate Reports

```bash
node cli.js report [file] [options]

Options:
  --format <type>    Report format (console, html, json)
  --output <path>    Output path for report

Examples:
  node cli.js report
  node cli.js report results/benchmark-results.json --format html
```

### Baseline Management

```bash
node baseline.js <command> [options]

Commands:
  save <file>         Save benchmark results as baseline
  update <file>       Update existing baseline
  show                Show current baseline info
  history [limit]     Show baseline history
  delete --confirm    Delete current baseline

Options:
  --description <text>  Baseline description
  --branch <name>       Git branch name
  --commit <hash>       Git commit hash
  --tags <tag1,tag2>    Comma-separated tags

Examples:
  node baseline.js save results/benchmark-results.json --description "Release v1.0"
  node baseline.js show
  node baseline.js history 20
```

### Comparison

```bash
node compare.js <baseline> <current> [options]

Options:
  --threshold <number>  Regression threshold percentage (default: 10)
  --output <file>       Save comparison results to file

Examples:
  node compare.js baseline/baseline.json results/current.json
  node compare.js old.json new.json --threshold 5 --output comparison.json
```

## Benchmark Suites

### Agent Benchmarks

#### Coder Agent (`benchmarks/coder-agent.bench.js`)
- Simple component creation
- Complex refactoring
- Multi-file changes
- Large codebase navigation
- Error recovery
- Code analysis

#### Tester Agent (`benchmarks/tester-agent.bench.js`)
- Playwright startup time
- Screenshot capture speed
- Multiple viewport testing
- Form interaction speed
- Visual regression testing
- Navigation timing
- Element detection
- Accessibility testing

#### Researcher Agent (`benchmarks/researcher-agent.bench.js`)
- Documentation fetching speed
- Web search performance
- Information extraction accuracy
- Multi-source aggregation
- API documentation parsing
- Code example extraction
- Semantic search

#### Security Auditor (`benchmarks/security-auditor.bench.js`)
- Codebase scanning speed
- Vulnerability detection
- Dependency vulnerability scanning
- False positive rate
- Large file handling
- Security policy enforcement
- Static analysis (SAST)

#### Performance Optimizer (`benchmarks/performance-optimizer.bench.js`)
- Lighthouse audit speed
- Bundle analysis time
- Image optimization
- Code splitting analysis
- Cache strategy optimization
- CSS optimization
- Database query optimization
- Performance budget validation

### System Benchmarks

#### Orchestration (`benchmarks/orchestration.bench.js`)
- Todo delegation speed
- Context switching overhead
- Multi-agent coordination
- Workspace switching performance
- Agent queue management
- Error propagation
- State synchronization

#### Persistence (`benchmarks/persistence.bench.js`)
- Todo read/write speed
- Metrics aggregation performance
- Large dataset handling
- Concurrent access
- Index query performance
- Backup and restore

#### Metrics (`benchmarks/metrics.bench.js`)
- Metric collection overhead
- Aggregation speed
- Query performance
- Time-series data handling
- Real-time metrics update
- Metric retention policy
- Custom metric calculation
- Metric export

## Creating Custom Benchmarks

### Basic Benchmark

```javascript
const { createSuite } = require('../suite');

const suite = createSuite('My Benchmark Suite');

suite.add(
  'My Benchmark',
  async () => {
    // Your code to benchmark
    const result = await myFunction();
    return result;
  },
  { iterations: 50 }
);

module.exports = suite.build();
```

### Benchmark with Setup/Teardown

```javascript
const { createSuite } = require('../suite');

const suite = createSuite('Complex Benchmark');

suite.setup(async () => {
  // Runs once before all benchmarks
  global.testData = await loadTestData();
});

suite.teardown(async () => {
  // Runs once after all benchmarks
  await cleanupTestData();
});

suite.add(
  'Benchmark with hooks',
  async () => {
    // Use global.testData
    return processData(global.testData);
  },
  {
    iterations: 30,
    before: async () => {
      // Runs before each benchmark
    },
    after: async () => {
      // Runs after each benchmark
    }
  }
);

module.exports = suite.build();
```

### Parameterized Benchmarks

```javascript
suite.addParameterized(
  'Process data',
  async ({ param }) => {
    return processData(param);
  },
  [10, 100, 1000, 10000], // Different data sizes
  { iterations: 20 }
);
```

## Configuration

Edit `config.json` to customize benchmark behavior:

```json
{
  "iterations": 10,
  "warmupRounds": 3,
  "timeout": 300000,
  "performanceBudgets": {
    "coder": {
      "simpleComponent": 5000
    }
  },
  "reporters": {
    "console": { "enabled": true },
    "json": { "enabled": true },
    "html": { "enabled": true }
  },
  "ci": {
    "failOnRegression": true,
    "regressionThreshold": 0.1
  }
}
```

## Output Files

### Console Report
Beautiful terminal output with tables and colors showing:
- System information
- Benchmark results
- Statistical analysis
- Summary

### JSON Report (`results/benchmark-results.json`)
Machine-readable format containing:
- Complete benchmark results
- System information
- Statistical metrics
- Raw duration data
- Timestamps

### HTML Report (`results/benchmark-report.html`)
Interactive web report with:
- Beautiful charts and graphs
- System information
- Detailed statistics
- Responsive design
- Exportable

### Comparison Report
Side-by-side comparison showing:
- Performance changes
- Regression detection
- Improvement highlighting
- Statistical significance

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Performance Benchmarks

on: [pull_request]

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd .claude/benchmarks
          npm install

      - name: Run benchmarks
        run: |
          cd .claude/benchmarks
          npm run bench:all -- --ci --compare-baseline

      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: benchmark-results
          path: .claude/benchmarks/results/
```

### Performance Budgets

Set thresholds in `config.json`:

```json
{
  "performanceBudgets": {
    "coder": {
      "simpleComponent": 5000,
      "complexRefactor": 30000
    }
  }
}
```

Benchmarks will fail if they exceed their budget.

## Statistics Explained

- **Mean**: Average duration across all iterations
- **Median**: Middle value when sorted (less affected by outliers)
- **Min/Max**: Fastest and slowest iterations
- **StdDev**: Standard deviation (variability measure)
- **P95/P99**: 95th and 99th percentile (worst-case scenarios)
- **CV**: Coefficient of variation (relative variability)

## Best Practices

1. **Run Warmup Rounds**: Eliminate JIT compiler effects
2. **Multiple Iterations**: At least 10 for statistical validity
3. **Consistent Environment**: Same hardware for comparisons
4. **Baseline Management**: Save baselines regularly
5. **CI Integration**: Catch regressions early
6. **Performance Budgets**: Set and enforce limits
7. **Historical Tracking**: Monitor trends over time

## Troubleshooting

### High Variance

If you see high coefficient of variation (>20%):
- Increase warmup rounds
- Increase iterations
- Close other applications
- Check for background processes

### Memory Issues

For benchmarks that use lots of memory:
- Enable garbage collection: `node --expose-gc cli.js run`
- Reduce concurrent benchmarks
- Increase Node.js memory limit: `--max-old-space-size=4096`

### Slow Benchmarks

To speed up benchmark runs:
- Reduce iterations (but maintain statistical validity)
- Run specific suites instead of all
- Use `--no-html` to skip HTML generation

## Architecture

```
benchmarks/
├── runner.js              # Core benchmark runner
├── suite.js               # Suite definition helpers
├── cli.js                 # Command-line interface
├── compare.js             # Comparison tool
├── baseline.js            # Baseline management
├── config.json            # Configuration
├── reporters/             # Output formatters
│   ├── console-reporter.js
│   ├── json-reporter.js
│   └── html-reporter.js
├── benchmarks/            # Benchmark suites
│   ├── coder-agent.bench.js
│   ├── tester-agent.bench.js
│   ├── researcher-agent.bench.js
│   ├── security-auditor.bench.js
│   ├── performance-optimizer.bench.js
│   ├── orchestration.bench.js
│   ├── persistence.bench.js
│   └── metrics.bench.js
├── fixtures/              # Test data
└── results/               # Output directory
```

## Contributing

To add new benchmarks:

1. Create a new file in `benchmarks/`
2. Use the naming convention: `*.bench.js`
3. Export a built suite
4. Add to package.json scripts if needed
5. Document in this README

## Performance Tips

- Use `performanceNow()` for high-resolution timing
- Avoid I/O in tight loops
- Mock external dependencies
- Use realistic test data
- Profile with Node.js `--prof` flag for deep analysis

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with precision for the Claude Code Agent System** 🚀
