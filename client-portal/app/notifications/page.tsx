'use client';
import { useNotifications, useMarkNotificationRead } from '@/lib/api/queries';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/utils';
import { Bell, CheckCircle, AlertCircle, FileText, Clock } from 'lucide-react';

export default function NotificationsPage() {
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();

  const unread = notifications?.filter((n) => !n.readAt);
  const read = notifications?.filter((n) => n.readAt);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Notifications</h1>

      {unread && unread.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Unread ({unread.length})</h2>
          <div className="space-y-3">
            {unread.map((notification) => (
              <Card key={notification.id}>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{notification.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{notification.body}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markRead.mutate(notification.id)}
                    >
                      Mark read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {read && read.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Read</h2>
          <div className="space-y-3 opacity-60">
            {read.map((notification) => (
              <Card key={notification.id}>
                <CardContent>
                  <h3 className="font-medium text-white">{notification.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{notification.body}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(!notifications || notifications.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notifications yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
