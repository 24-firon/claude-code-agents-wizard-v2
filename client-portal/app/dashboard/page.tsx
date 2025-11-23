'use client';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardHealth, useDashboardMetrics } from '@/lib/api/queries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { getHealthScoreColor, formatRelativeTime } from '@/lib/utils';
import { TrendingUp, FileText, AlertCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const projectId = user?.projectId || '';
  
  const { data: health, isLoading: healthLoading } = useDashboardHealth(projectId);
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(projectId);

  if (healthLoading || metricsLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {user?.firstName}</p>
      </div>

      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Project Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className={`text-6xl font-bold ${getHealthScoreColor(health?.healthScore || 0)}`}>
                {health?.healthScore}
              </div>
              <div className="text-sm text-gray-400 mt-1">out of 100</div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-white font-medium">{health?.successRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Workflows</span>
                <span className="text-white font-medium">{health?.totalWorkflows}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Failed</span>
                <span className="text-error font-medium">{health?.failedWorkflows}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gold/10 rounded-lg">
                <FileText className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Documents</p>
                <p className="text-2xl font-bold text-white">{metrics?.totalDocuments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">On Track</p>
                <p className="text-2xl font-bold text-success">
                  {health?.status === 'ON_TRACK' ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-info/10 rounded-lg">
                <Clock className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Updated</p>
                <p className="text-sm font-medium text-white">
                  {formatRelativeTime(health?.lastUpdated || new Date().toISOString())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics?.recentActivity?.length ? (
              metrics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-success/10' :
                    activity.status === 'error' ? 'bg-error/10' : 'bg-info/10'
                  }`}>
                    {activity.status === 'error' && <AlertCircle className="w-4 h-4 text-error" />}
                    {activity.status === 'success' && <TrendingUp className="w-4 h-4 text-success" />}
                    {!activity.status && <FileText className="w-4 h-4 text-info" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
