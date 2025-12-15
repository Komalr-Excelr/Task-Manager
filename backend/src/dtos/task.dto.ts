import { z } from 'zod';

export const createTaskDto = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.string().min(1),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  status: z.enum(['ToDo', 'InProgress', 'Review', 'Completed']).optional(),
  assignedToId: z.string().cuid().optional().nullable(),
});

export const updateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  dueDate: z.string().min(1).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  status: z.enum(['ToDo', 'InProgress', 'Review', 'Completed']).optional(),
  assignedToId: z.string().cuid().nullable().optional(),
});

export const listTaskQueryDto = z.object({
  status: z.enum(['ToDo', 'InProgress', 'Review', 'Completed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  sort: z
    .string()
    .regex(/^dueDate:(asc|desc)$/)
    .optional(),
});