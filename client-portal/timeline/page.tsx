'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Circle, Clock } from 'lucide-react';

export default function TimelinePage() {
  const milestones = [
    { name: 'Project Kickoff', date: '2025-01-15', status: 'completed' },
    { name: 'Requirements Phase', date: '2025-02-01', status: 'completed' },
    { name: 'Design Phase', date: '2025-03-01', status: 'in_progress' },
    { name: 'Development Phase', date: '2025-04-01', status: 'pending' },
    { name: 'Testing & QA', date: '2025-05-01', status: 'pending' },
    { name: 'Deployment', date: '2025-06-01', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Project Timeline</h1>

      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.name} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {milestone.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : milestone.status === 'in_progress' ? (
                    <Clock className="w-6 h-6 text-gold animate-pulse" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-600" />
                  )}
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-800 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{milestone.name}</h3>
                    <Badge
                      variant={
                        milestone.status === 'completed' ? 'success' :
                        milestone.status === 'in_progress' ? 'warning' : 'default'
                      }
                    >
                      {milestone.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Due: {milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
