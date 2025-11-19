import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface TodoCardProps {
  todo: {
    id: string;
    content: string;
    status: 'pending' | 'in-progress' | 'completed' | 'blocked';
    priority?: 'low' | 'normal' | 'high' | 'critical';
    assignedTo?: string | null;
    createdAt: string;
    completedAt?: string | null;
    tags?: string[];
  };
  onClick?: () => void;
}

export function TodoCard({ todo, onClick }: TodoCardProps) {
  const statusConfig = {
    pending: {
      icon: Circle,
      color: 'text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-800',
      label: 'Pending',
    },
    'in-progress': {
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      label: 'In Progress',
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
      label: 'Completed',
    },
    blocked: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/30',
      label: 'Blocked',
    },
  };

  const priorityConfig = {
    low: { color: 'bg-gray-400', label: 'Low' },
    normal: { color: 'bg-blue-500', label: 'Normal' },
    high: { color: 'bg-orange-500', label: 'High' },
    critical: { color: 'bg-red-500', label: 'Critical' },
  };

  const status = statusConfig[todo.status];
  const StatusIcon = status.icon;
  const priority = todo.priority ? priorityConfig[todo.priority] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={clsx(
        'p-4 rounded-lg border cursor-pointer transition-all',
        'hover:shadow-lg dark:hover:shadow-gray-900/50',
        status.bg,
        'border-gray-200 dark:border-gray-700'
      )}
    >
      <div className="flex items-start gap-3">
        <StatusIcon className={clsx('w-5 h-5 mt-0.5 flex-shrink-0', status.color)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
              {todo.content}
            </h3>
            {priority && (
              <span className={clsx(
                'px-2 py-0.5 text-xs font-medium text-white rounded',
                priority.color
              )}>
                {priority.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className={clsx('font-medium', status.color)}>
              {status.label}
            </span>
            {todo.assignedTo && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Assigned to:</span>
                <span className="text-gray-700 dark:text-gray-300">{todo.assignedTo}</span>
              </span>
            )}
            <span>
              {format(new Date(todo.createdAt), 'MMM d, yyyy HH:mm')}
            </span>
          </div>

          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
