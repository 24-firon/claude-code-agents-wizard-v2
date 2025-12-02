import { prisma } from '../config/database';
import { HTTPException } from 'hono/http-exception';
import { NotificationQueryInput } from '../schemas/notifications.schema';
import { Prisma, NotificationType } from '@prisma/client';

export async function getNotifications(userId: string, query: NotificationQueryInput) {
  const { page, limit, unreadOnly, type } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.NotificationWhereInput = {
    userId,
    ...(unreadOnly && { readAt: null }),
    ...(type && { type }),
  };

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ]);

  return {
    items: notifications.map(n => ({
      ...n,
      read: !!n.readAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    unreadCount,
  };
}

export async function getUnreadCount(userId: string) {
  const count = await prisma.notification.count({
    where: { userId, readAt: null },
  });

  return { unreadCount: count };
}

export async function markAsRead(userId: string, notificationId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new HTTPException(404, { message: 'Notification not found' });
  }

  if (notification.readAt) {
    return notification; // Already read
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

export async function markAllAsRead(userId: string) {
  const result = await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });

  return { markedCount: result.count };
}

export async function markMultipleAsRead(userId: string, notificationIds: string[]) {
  const result = await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return { markedCount: result.count };
}

export async function deleteNotification(userId: string, notificationId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    throw new HTTPException(404, { message: 'Notification not found' });
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      data: (data || {}) as Prisma.InputJsonValue,
    },
  });
}

export async function notifyProjectUsers(
  projectId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  const users = await prisma.user.findMany({
    where: { projectId },
    select: { id: true },
  });

  const notifications = await prisma.notification.createMany({
    data: users.map(user => ({
      userId: user.id,
      type,
      title,
      body,
      data: (data || {}) as Prisma.InputJsonValue,
    })),
  });

  return { notifiedCount: notifications.count };
}
