import { prisma } from '../db/prisma';

export class TaskRepository {
  create(data: {
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    status: string;
    creatorId: string;
    assignedToId?: string | null;
  }) {
    return prisma.task.create({ data });
  }

  update(id: string, data: Partial<{ title: string; description: string; dueDate: Date; priority: string; status: string; assignedToId: string | null; }>) {
    return prisma.task.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }

  findById(id: string) {
    return prisma.task.findUnique({ where: { id }, include: { creator: true, assignedTo: true } });
  }

  list(filters: { status?: string; priority?: string; sort?: 'asc'|'desc' }) {
    return prisma.task.findMany({
      where: {
        status: filters.status,
        priority: filters.priority,
      },
      orderBy: filters.sort ? { dueDate: filters.sort } : undefined,
      include: { creator: true, assignedTo: true },
    });
  }

  listAssignedTo(userId: string) {
    return prisma.task.findMany({ where: { assignedToId: userId }, include: { creator: true, assignedTo: true } });
  }

  listCreatedBy(userId: string) {
    return prisma.task.findMany({ where: { creatorId: userId }, include: { creator: true, assignedTo: true } });
  }

  listOverdue(now: Date) {
    return prisma.task.findMany({ where: { dueDate: { lt: now }, NOT: { status: 'Completed' } }, include: { creator: true, assignedTo: true } });
  }
}