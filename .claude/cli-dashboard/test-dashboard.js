#!/usr/bin/env node

/**
 * Quick test to verify dashboard components can be loaded
 */

console.log('🧪 Testing dashboard components...\n');

try {
  // Test loading main modules
  console.log('  Loading SystemWatcher...');
  const SystemWatcher = require('./utils/watcher');
  console.log('  ✓ SystemWatcher loaded');

  console.log('  Loading TodoWidget...');
  const TodoWidget = require('./components/todo-widget');
  console.log('  ✓ TodoWidget loaded');

  console.log('  Loading AgentActivityWidget...');
  const AgentActivityWidget = require('./components/agent-activity');
  console.log('  ✓ AgentActivityWidget loaded');

  console.log('  Loading MetricsChartWidget...');
  const MetricsChartWidget = require('./components/metrics-chart');
  console.log('  ✓ MetricsChartWidget loaded');

  console.log('  Loading LogViewerWidget...');
  const LogViewerWidget = require('./components/log-viewer');
  console.log('  ✓ LogViewerWidget loaded');

  console.log('  Loading main dashboard...');
  const AgentDashboard = require('./index');
  console.log('  ✓ AgentDashboard loaded');

  console.log('\n✅ All components loaded successfully!');
  console.log('\n📋 To start the dashboard:');
  console.log('   npm start');
  console.log('   OR');
  console.log('   ./start.sh');
  console.log('   OR');
  console.log('   node index.js');

  process.exit(0);
} catch (error) {
  console.error('\n❌ Error loading components:');
  console.error(error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}
