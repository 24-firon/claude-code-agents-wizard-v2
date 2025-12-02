import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { notificationQuerySchema, markReadSchema } from '../schemas/notifications.schema';
import * as notificationsService from '../services/notifications.service';

const notifications = new Hono();

// All notification routes require authentication
notifications.use('/*', authMiddleware);

// GET /notifications - List notifications
notifications.get('/', zValidator('query', notificationQuerySchema), async (c) => {
  const user = c.get('user');
  const query = c.req.valid('query');

  const result = await notificationsService.getNotifications(user.sub, query);

  return c.json({
    success: true,
    data: result.items,
    pagination: result.pagination,
    unreadCount: result.unreadCount,
  });
});

// GET /notifications/unread-count - Get unread count
notifications.get('/unread-count', async (c) => {
  const user = c.get('user');

  const result = await notificationsService.getUnreadCount(user.sub);

  return c.json({
    success: true,
    data: result,
  });
});

// PATCH /notifications/:id/read - Mark single notification as read
notifications.patch('/:id/read', async (c) => {
  const user = c.get('user');
  const notificationId = c.req.param('id');

  const notification = await notificationsService.markAsRead(user.sub, notificationId);

  return c.json({
    success: true,
    data: notification,
  });
});

// PATCH /notifications/read-all - Mark all as read
notifications.patch('/read-all', async (c) => {
  const user = c.get('user');

  const result = await notificationsService.markAllAsRead(user.sub);

  return c.json({
    success: true,
    data: result,
  });
});

// POST /notifications/mark-read - Mark multiple as read
notifications.post('/mark-read', zValidator('json', markReadSchema), async (c) => {
  const user = c.get('user');
  const { notificationIds } = c.req.valid('json');

  if (notificationIds && notificationIds.length > 0) {
    const result = await notificationsService.markMultipleAsRead(user.sub, notificationIds);
    return c.json({ success: true, data: result });
  }

  const result = await notificationsService.markAllAsRead(user.sub);
  return c.json({ success: true, data: result });
});

// DELETE /notifications/:id - Delete notification
notifications.delete('/:id', async (c) => {
  const user = c.get('user');
  const notificationId = c.req.param('id');

  await notificationsService.deleteNotification(user.sub, notificationId);

  return c.json({
    success: true,
    message: 'Notification deleted',
  });
});

export { notifications };
