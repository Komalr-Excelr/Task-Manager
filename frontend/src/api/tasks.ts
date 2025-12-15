import { api } from './client';

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low'|'Medium'|'High'|'Urgent';
  status: 'ToDo'|'InProgress'|'Review'|'Completed';
  creatorId: string;
  assignedToId?: string | null;
};

export const TasksAPI = {
  list: (params?: any) => api.get('/tasks', { params }).then(r => r.data.tasks as Task[]),
  get: (id: string) => api.get(`/tasks/${id}`).then(r => r.data.task as Task),
  create: (data: Partial<Task>) => api.post('/tasks', data).then(r => r.data.task as Task),
  update: (id: string, data: Partial<Task>) => api.patch(`/tasks/${id}`, data).then(r => r.data.task as Task),
  remove: (id: string) => api.delete(`/tasks/${id}`),
  dashboard: () => api.get('/tasks/dashboard').then(r => r.data as { assignedToMe: Task[]; createdByMe: Task[]; overdue: Task[] }),
};