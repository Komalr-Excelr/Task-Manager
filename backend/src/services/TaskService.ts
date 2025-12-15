import { TaskRepository } from '../repositories/TaskRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';

export interface Notifier {
  emitToAll: (event: string, payload: any) => void;
  emitToUser: (userId: string, event: string, payload: any) => void;
}

export class TaskService {
  constructor(
    private tasks = new TaskRepository(),
    private notifications = new NotificationRepository(),
    private notifier: Notifier
  ) {}

  async createTask(input: {
    title: string;
    description: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status?: 'ToDo' | 'InProgress' | 'Review' | 'Completed';
    assignedToId?: string | null;
    creatorId: string;
  }) {
    if (input.title.length > 100) {
      throw new Error('Title too long');
    }
    const created = await this.tasks.create({
      title: input.title,
      description: input.description,
      dueDate: new Date(input.dueDate),
      priority: input.priority,
      status: input.status || 'ToDo',
      creatorId: input.creatorId,
      assignedToId: input.assignedToId || null,
    });
    if (created.assignedToId) {
      const message = `A task has been assigned to you: ${created.title}`;
      await this.notifications.createAssignment(created.assignedToId, created.id, message);
      this.notifier.emitToUser(created.assignedToId, 'notification.assigned', { taskId: created.id, message });
    }
    this.notifier.emitToAll('task.updated', { id: created.id });
    return created;
  }

  async updateTask(id: string, actorId: string, patch: Partial<{ title: string; description: string; dueDate: string; priority: 'Low'|'Medium'|'High'|'Urgent'; status: 'ToDo'|'InProgress'|'Review'|'Completed'; assignedToId: string|null }>) {
    const before = await this.tasks.findById(id);
    if (!before) throw new Error('Task not found');
    const data: any = {};
    if (patch.title !== undefined) {
      if (patch.title.length > 100) throw new Error('Title too long');
      data.title = patch.title;
    }
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.dueDate !== undefined) data.dueDate = new Date(patch.dueDate);
    if (patch.priority !== undefined) data.priority = patch.priority;
    if (patch.status !== undefined) data.status = patch.status;
    if (patch.assignedToId !== undefined) data.assignedToId = patch.assignedToId;

    const updated = await this.tasks.update(id, data);

    if (before.assignedToId !== updated.assignedToId && updated.assignedToId) {
      const message = `You were assigned: ${updated.title}`;
      await this.notifications.createAssignment(updated.assignedToId, updated.id, message);
      this.notifier.emitToUser(updated.assignedToId, 'notification.assigned', { taskId: updated.id, message });
    }

    if (before.status !== updated.status || before.priority !== updated.priority || before.assignedToId !== updated.assignedToId) {
      this.notifier.emitToAll('task.updated', { id: updated.id });
    }

    return updated;
  }

  getTask(id: string) {
    return this.tasks.findById(id);
  }

  deleteTask(id: string) {
    return this.tasks.delete(id);
  }

  listTasks(filters: { status?: Status; priority?: Priority; sort?: 'asc'|'desc' }) {
    return this.tasks.list(filters);
  }

  listForDashboard(userId: string) {
    return Promise.all([
      this.tasks.listAssignedTo(userId),
      this.tasks.listCreatedBy(userId),
      this.tasks.listOverdue(new Date()),
    ]);
  }
}