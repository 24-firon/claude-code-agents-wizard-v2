import { motion } from 'framer-motion';
import { Activity, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { TodoCard } from '../components/TodoCard';
import { AgentCard } from '../components/AgentCard';
import { useTodos, useAgents } from '../hooks/useMetrics';
import { useStore } from '../store/useStore';

export function Dashboard() {
  const { currentWorkspace } = useStore();
  const { data: todosData, isLoading: todosLoading } = useTodos(currentWorkspace);
  const { data: agentsData, isLoading: agentsLoading } = useAgents();

  const todos = todosData?.todos || [];
  const agents = agentsData?.agents || [];

  // Calculate stats
  const stats = {
    total: todos.length,
    pending: todos.filter((t: any) => t.status === 'pending').length,
    inProgress: todos.filter((t: any) => t.status === 'in-progress').length,
    completed: todos.filter((t: any) => t.status === 'completed').length,
    blocked: todos.filter((t: any) => t.status === 'blocked').length,
  };

  const completionRate = stats.total > 0
    ? ((stats.completed / stats.total) * 100).toFixed(1)
    : '0.0';

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor your agent tasks and performance in real-time
        </p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Todos List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Active Tasks
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {stats.total} total
            </span>
          </div>

          {todosLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No tasks yet. Create your first task to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos
                .filter((todo: any) => todo.status !== 'completed')
                .slice(0, 10)
                .map((todo: any) => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
            </div>
          )}
        </div>

        {/* Agents Sidebar */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Agents
          </h2>

          {agentsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {agents.slice(0, 5).map((agent: any) => (
                <AgentCard key={agent.name} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
