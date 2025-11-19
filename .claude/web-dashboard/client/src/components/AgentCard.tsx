import { motion } from 'framer-motion';
import { Activity, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

interface AgentCardProps {
  agent: {
    name: string;
    description: string;
    status: 'available' | 'busy' | 'offline';
    stats?: {
      invocations: number;
      successes: number;
      failures: number;
      averageDuration: number;
    };
  };
  onClick?: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const stats = agent.stats || {
    invocations: 0,
    successes: 0,
    failures: 0,
    averageDuration: 0,
  };

  const successRate = stats.invocations > 0
    ? ((stats.successes / stats.invocations) * 100).toFixed(1)
    : '0.0';

  const statusConfig = {
    available: {
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
      label: 'Available',
      dot: 'bg-green-500',
    },
    busy: {
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      label: 'Busy',
      dot: 'bg-yellow-500',
    },
    offline: {
      color: 'text-gray-500',
      bg: 'bg-gray-100 dark:bg-gray-800',
      label: 'Offline',
      dot: 'bg-gray-500',
    },
  };

  const status = statusConfig[agent.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={clsx(
        'p-6 rounded-lg border cursor-pointer transition-all',
        'hover:shadow-lg dark:hover:shadow-gray-900/50',
        'bg-white dark:bg-dark-800',
        'border-gray-200 dark:border-gray-700'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {agent.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {agent.description}
          </p>
        </div>
        <div className={clsx('flex items-center gap-2 px-3 py-1 rounded-full', status.bg)}>
          <div className={clsx('w-2 h-2 rounded-full', status.dot, 'animate-pulse')} />
          <span className={clsx('text-xs font-medium', status.color)}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-medium">Invocations</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.invocations}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {successRate}%
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Successes</span>
          </div>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400">
            {stats.successes}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Failures</span>
          </div>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">
            {stats.failures}
          </p>
        </div>
      </div>

      {/* Average Duration */}
      {stats.averageDuration > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Avg. Duration</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {(stats.averageDuration / 1000).toFixed(2)}s
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
