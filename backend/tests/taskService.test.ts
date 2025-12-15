import { TaskService, Notifier } from '../src/services/TaskService';

const mockTasks = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
  list: jest.fn(),
  listAssignedTo: jest.fn(),
  listCreatedBy: jest.fn(),
  listOverdue: jest.fn(),
};

const mockNotifications = {
  createAssignment: jest.fn(),
  listForUser: jest.fn(),
  markRead: jest.fn(),
};

const notifier: Notifier = {
  emitToAll: jest.fn(),
  emitToUser: jest.fn(),
};

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects title longer than 100', async () => {
    const service = new TaskService(mockTasks as any, mockNotifications as any, notifier);
    await expect(
      service.createTask({ title: 'x'.repeat(101), description: 'd', dueDate: new Date().toISOString(), priority: 'Low', creatorId: 'u1' })
    ).rejects.toThrow('Title too long');
  });

  it('emits assignment notification when assignee changes', async () => {
    const service = new TaskService(mockTasks as any, mockNotifications as any, notifier);
    mockTasks.findById.mockResolvedValue({ id: 't1', title: 'T', assignedToId: null, status: 'ToDo', priority: 'Low' });
    mockTasks.update.mockResolvedValue({ id: 't1', title: 'T', assignedToId: 'u2', status: 'ToDo', priority: 'Low' });

    await service.updateTask('t1', 'actor', { assignedToId: 'u2' });
    expect(mockNotifications.createAssignment).toHaveBeenCalled();
    expect(notifier.emitToUser).toHaveBeenCalledWith('u2', 'notification.assigned', expect.any(Object));
  });

  it('broadcasts task.updated when status changes', async () => {
    const service = new TaskService(mockTasks as any, mockNotifications as any, notifier);
    mockTasks.findById.mockResolvedValue({ id: 't1', title: 'T', assignedToId: null, status: 'ToDo', priority: 'Low' });
    mockTasks.update.mockResolvedValue({ id: 't1', title: 'T', assignedToId: null, status: 'Completed', priority: 'Low' });

    await service.updateTask('t1', 'actor', { status: 'Completed' });
    expect(notifier.emitToAll).toHaveBeenCalledWith('task.updated', { id: 't1' });
  });
});