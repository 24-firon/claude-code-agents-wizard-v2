'use client';
import { useAuthStore } from '@/stores/authStore';
import { useWorkflows } from '@/lib/api/queries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';
import { Terminal, Check, X, Clock, Loader } from 'lucide-react';

export default function TechnicalPage() {
  const { user } = useAuthStore();
  const projectId = user?.projectId || '';
  const { data: workflows, isLoading } = useWorkflows(projectId);

  const statusIcons = {
    SUCCESS: <Check className="w-4 h-4 text-success" />,
    FAILED: <X className="w-4 h-4 text-error" />,
    IN_PROGRESS: <Loader className="w-4 h-4 text-info animate-spin" />,
    TIMEOUT: <Clock className="w-4 h-4 text-warning" />,
    ERROR: <X className="w-4 h-4 text-error" />,
  };

  const statusVariants = {
    SUCCESS: 'success' as const,
    FAILED: 'error' as const,
    IN_PROGRESS: 'info' as const,
    TIMEOUT: 'warning' as const,
    ERROR: 'error' as const,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Technical Logs</h1>
        <p className="text-gray-400 mt-1">n8n workflow execution history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Workflow Executions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-800">
            {workflows?.length ? (
              workflows.map((workflow) => (
                <div key={workflow.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-gray-800 rounded-lg flex-shrink-0">
                        {statusIcons[workflow.status]}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{workflow.n8nWorkflowName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={statusVariants[workflow.status]}>
                            {workflow.status}
                          </Badge>
                          {workflow.executionTimeMs && (
                            <span className="text-sm text-gray-400">
                              {workflow.executionTimeMs}ms
                            </span>
                          )}
                        </div>
                        {workflow.errorMessage && (
                          <p className="text-sm text-error mt-2">{workflow.errorMessage}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {formatRelativeTime(workflow.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400">
                <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p>No workflow executions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
