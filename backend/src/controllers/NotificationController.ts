import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { NotificationService } from '../services/NotificationService';

const service = new NotificationService();

export const NotificationController = {
  list: async (req: AuthedRequest, res: Response) => {
    const list = await service.list(req.user!.id);
    return res.json({ notifications: list });
  },
  read: async (req: AuthedRequest, res: Response) => {
    const item = await service.markRead(req.params.id);
    return res.json({ notification: item });
  },
};