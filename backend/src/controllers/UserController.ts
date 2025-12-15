import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';

const users = new UserRepository();

export const UserController = {
  list: async (_req: Request, res: Response) => {
    const list = await users.listAll();
    res.json({ users: list });
  },
};