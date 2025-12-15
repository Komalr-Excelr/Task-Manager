import { prisma } from '../db/prisma';
import { NotificationType } from '@prisma/client';

export class NotificationRepository {
  createAssignment(userId: string, taskId: string, message: string) {
    return prisma.notification.create({ data: { userId, taskId, type: NotificationType.ASSIGNED, message } });
  }
  listForUser(userId: string) {
    return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }
  markRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { read: true } });
  }
}