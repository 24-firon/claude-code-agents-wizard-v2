import { useState } from 'motion/react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, Clock } from 'lucide-react';
import { MetricsChart } from '../components/MetricsChart';
import { useDailyMetrics, useAgents } from '../hooks/useMetrics';
import { format, subDays } from 'date-fns';

export function Metrics() {
  const { data: dailyData, isLoading: dailyLoading } = useDailyMetrics();
  const { data: agentsData, isLoading: agentsLoading } = useAgents();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const dailyMetrics = dailyData?.metrics || [];
  const agents = agentsData?.agents || [];

  // Filter metrics by time range
  const filteredMetrics = dailyMetrics.filter((metric: any) => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = subDays(new Date(), days);
    return new Date(metric.date) >= cutoff;
  });

  // Prepare chart data
  const performanceData = filteredMetrics.map((m: any) => ({
    date: format(new Date(m.date), 'MMM dd'),
    tasks: m.totalTasks || 0,
    completed: m.completedTasks || 0,
    failed: m.failedTasks || 0,
  }));

  const agentPerformanceData = agents.map((agent: any) => ({
    name: agent.name,
    invocations: agent.stats?.invocations || 0,
    successes: agent.stats?.successes || 0,
    failures: agent.stats?.failures || 0,
    successRate: agent.stats?.invocations > 0
      ? ((agent.stats.successes / agent.stats.invocations) * 100)
      : 0,
  }));

  const totalStats = {
    totalTasks: performanceData.reduce((sum, d) => sum + d.tasks, 0),
    totalCompleted: performanceData.reduce((sum, d) => sum + d.completed, 0),
    totalFailed: performanceData.reduce((sum, d) => sum + d.failed, 0),
    avgCompletionTime: agents.reduce(
      (sum, a) => sum + (a.stats?.averageDuration || 0),
      0
    ) / agents.length || 0,
  };

  const statCards = [
    {
      label: 'Total Tasks',
      value: totalStats.totalTasks,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Completed',
      value: totalStats.totalCompleted,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Failed',
      value: totalStats.totalFailed,
      icon: BarChart3,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      label: 'Avg. Duration',
      value: `${(totalStats.avgCompletionTime / 1000).toFixed(2)}s`,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Metrics & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track performance and analyze trends over time
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg border ${stat.bg} border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-12 h-12 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {dailyLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Task Performance Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <MetricsChart
              title="Task Performance Over Time"
              data={performanceData}
              type="area"
              xAxisKey="date"
              dataKeys={[
                { key: 'tasks', name: 'Total Tasks', color: '#3b82f6' },
                { key: 'completed', name: 'Completed', color: '#10b981' },
                { key: 'failed', name: 'Failed', color: '#ef4444' },
              ]}
              height={350}
            />
          </motion.div>

          {/* Agent Performance Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <MetricsChart
              title="Agent Performance Comparison"
              data={agentPerformanceData}
              type="bar"
              xAxisKey="name"
              dataKeys={[
                { key: 'successes', name: 'Successes', color: '#10b981' },
                { key: 'failures', name: 'Failures', color: '#ef4444' },
              ]}
              height={350}
            />
          </motion.div>

          {/* Success Rate by Agent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <MetricsChart
              title="Success Rate by Agent"
              data={agentPerformanceData}
              type="line"
              xAxisKey="name"
              dataKeys={[
                { key: 'successRate', name: 'Success Rate (%)', color: '#8b5cf6' },
              ]}
              height={300}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
