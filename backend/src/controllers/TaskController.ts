import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { TaskService } from '../services/TaskService';
import { notifier } from '../server/socket';
import { TaskRepository } from '../repositories/TaskRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';

const service = new TaskService(new TaskRepository(), new NotificationRepository(), notifier);

export const TaskController = {
  create: async (req: AuthedRequest, res: Response) => {
    try {
      const task = await service.createTask({ ...req.body, creatorId: req.user!.id });
      return res.status(201).json({ task });
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  },
  update: async (req: AuthedRequest, res: Response) => {
    try {
      const task = await service.updateTask(req.params.id, req.user!.id, req.body);
      return res.json({ task });
    } catch (e: any) {
      const code = e.message === 'Task not found' ? 404 : 400;
      return res.status(code).json({ message: e.message });
    }
  },
  remove: async (req: AuthedRequest, res: Response) => {
    try {
      await service.deleteTask(req.params.id);
      return res.status(204).send();
    } catch (e: any) {
      return res.status(404).json({ message: 'Not found' });
    }
  },
  get: async (req: AuthedRequest, res: Response) => {
    const task = await service.getTask(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    return res.json({ task });
  },
  list: async (req: AuthedRequest, res: Response) => {
    const { status, priority, sort } = req.query as any;
    const filters: { status?: string; priority?: string; sort?: 'asc'|'desc' } = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (sort) filters.sort = sort.endsWith(':desc') ? 'desc' : 'asc';
    const tasks = await service.listTasks(filters);
    return res.json({ tasks });
  },
  dashboard: async (req: AuthedRequest, res: Response) => {
    const [assignedToMe, createdByMe, overdue] = await service.listForDashboard(req.user!.id);
    return res.json({ assignedToMe, createdByMe, overdue });
  },
};