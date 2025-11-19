# Claude Code Agents - Metrics Tracking System

## Overview

This metrics tracking system provides comprehensive analytics for the Claude Code Agents orchestration workflow. It tracks session-level and aggregated metrics to help understand agent performance, task completion rates, and workflow efficiency.

## What Metrics Are Tracked

### Session Metrics
Each orchestration session is tracked individually with:
- **Session Metadata**: Unique ID, start/end timestamps, duration, workspace name
- **Todo Metrics**: Created, completed, blocked, and in-progress counts
- **Agent Invocations**: Count and success/failure rate per agent type (coder, tester, stuck)
- **Token Usage**: Estimated token consumption across all agents
- **Error Tracking**: Stuck agent invocations with categorized reasons
- **Performance**: Average task completion time, throughput metrics

### Aggregated Metrics
Metrics are aggregated at multiple time scales:
- **Daily**: All sessions within a 24-hour period
- **Weekly**: All sessions within a calendar week (ISO week format)
- **All-Time**: Cumulative statistics since first use

## Directory Structure

```
.claude/metrics/
├── README.md                           # This file
├── schema.json                         # JSON schema definitions
├── sessions/                           # Individual session metrics
│   ├── session-2025-11-18-001.json
│   ├── session-2025-11-18-002.json
│   └── ...
└── aggregated/                         # Time-aggregated metrics
    ├── daily-2025-11-18.json
    ├── weekly-2025-W47.json
    └── all-time.json
```

## How Metrics Are Collected

### Automatic Collection
Metrics are automatically collected during orchestration:
1. **Session Start**: Creates new session metrics file with unique ID
2. **During Execution**: Updates metrics as agents are invoked and todos progress
3. **Session End**: Finalizes session metrics with completion timestamp
4. **Aggregation**: Periodically updates daily, weekly, and all-time aggregates

### Collection Points
- **TodoWrite invocation**: Increments `todos.created`
- **Coder agent completion**: Updates `agents.coder` metrics
- **Tester agent completion**: Updates `agents.tester` metrics
- **Stuck agent invocation**: Records reason and context
- **Todo completion**: Increments `todos.completed` and calculates duration
- **Session end**: Calculates totals and success rates

## Session vs Aggregated Metrics

### Session Metrics (`sessions/session-*.json`)
- **Granularity**: Individual orchestration session
- **Purpose**: Detailed tracking of specific workflow execution
- **Use Cases**:
  - Debugging specific session issues
  - Understanding workflow for particular project
  - Identifying bottlenecks in individual runs

### Aggregated Metrics (`aggregated/*.json`)
- **Granularity**: Daily, weekly, or all-time
- **Purpose**: Trend analysis and performance insights
- **Use Cases**:
  - Tracking improvement over time
  - Identifying recurring issues
  - Measuring overall system effectiveness
  - Resource planning and optimization

## How to Analyze Metrics

### View Individual Session
```bash
cat .claude/metrics/sessions/session-2025-11-18-001.json | jq
```

### Calculate Success Rate
```bash
cat .claude/metrics/sessions/session-*.json | \
  jq -s 'map(.todos.completed / .todos.created) | add / length'
```

### Find Most Common Stuck Reasons
```bash
cat .claude/metrics/sessions/session-*.json | \
  jq -s '[.[] | .stuck_invocations[].reason] | group_by(.) |
  map({reason: .[0], count: length}) | sort_by(.count) | reverse'
```

### Agent Performance Summary
```bash
cat .claude/metrics/aggregated/all-time.json | \
  jq '.agents'
```

### Daily Comparison
```bash
ls .claude/metrics/aggregated/daily-*.json | \
  xargs -I {} sh -c 'echo {} && cat {} | jq .summary'
```

## Key Performance Indicators (KPIs)

### Effectiveness KPIs
- **Todo Completion Rate**: `todos.completed / todos.created`
- **Agent Success Rate**: `agents.{type}.successful / agents.{type}.total_invocations`
- **First-Time Success Rate**: `1 - (stuck_invocations.length / (agents.coder.total_invocations + agents.tester.total_invocations))`

### Efficiency KPIs
- **Average Task Duration**: `todos.average_completion_time_seconds`
- **Session Duration**: `end_timestamp - start_timestamp`
- **Throughput**: `todos.completed / session_duration_hours`

### Quality KPIs
- **Stuck Rate**: `stuck_invocations.length / todos.created`
- **Rework Rate**: `(agents.coder.failed + agents.tester.failed) / todos.completed`
- **Test Pass Rate**: `agents.tester.successful / agents.tester.total_invocations`

## Privacy Considerations

### What Is Tracked
- Session timestamps and durations
- Count-based metrics (todos, invocations, successes, failures)
- Generic error categories and patterns
- Agent type and invocation counts
- Estimated token usage

### What Is NOT Tracked
- User input content or prompts
- Code content or implementation details
- File paths or sensitive workspace information
- API keys or credentials
- Personal identifiable information (PII)
- Actual error messages with sensitive data

### Data Retention
- **Session metrics**: Retained indefinitely for analysis
- **Aggregated metrics**: Updated incrementally
- **Recommendation**: Periodically archive old session files to separate storage

### Compliance
This metrics system is designed to be:
- **Privacy-first**: No sensitive data collection
- **Transparent**: All metrics are human-readable JSON
- **Auditable**: Clear schema and collection points
- **Deletable**: Easy to remove or archive old data

## Extending the Metrics System

### Adding New Metrics
1. Update `schema.json` with new metric definition
2. Modify collection points in orchestrator code
3. Update aggregation logic if needed
4. Document new metric in this README

### Custom Analytics
Create custom analysis scripts in `.claude/metrics/analytics/`:
```bash
mkdir -p .claude/metrics/analytics
```

Example custom script:
```javascript
// analytics/weekly-report.js
const fs = require('fs');
const sessions = fs.readdirSync('.claude/metrics/sessions')
  .filter(f => f.startsWith('session-'))
  .map(f => JSON.parse(fs.readFileSync(`.claude/metrics/sessions/${f}`)));

// Your custom analysis here
```

## Troubleshooting

### Metrics Not Being Collected
- Check that session is initialized properly
- Verify write permissions to `.claude/metrics/` directory
- Ensure orchestrator has metrics collection enabled

### Aggregation Issues
- Manually trigger aggregation: `node .claude/metrics/aggregate.js`
- Check for malformed session JSON files
- Verify date/time parsing logic

### Performance Impact
- Metrics collection is lightweight (<1% overhead)
- Aggregation runs asynchronously
- If needed, reduce collection frequency in config

## Resources

- **Schema Documentation**: See `schema.json` for complete metric definitions
- **Example Sessions**: See `sessions/` directory for real-world examples
- **Aggregated Reports**: See `aggregated/` directory for trend analysis

## Changelog

- **2025-11-18**: Initial metrics system creation
  - Session metrics schema v1.0
  - Daily, weekly, all-time aggregation
  - Privacy-conscious design
