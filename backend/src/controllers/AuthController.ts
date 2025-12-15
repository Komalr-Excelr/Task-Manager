import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { env } from '../config/env';
import { AuthedRequest } from '../middleware/auth';

const service = new AuthService();

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { user, token } = await service.register(req.body.email, req.body.name, req.body.password);
      res.cookie('token', token, { httpOnly: true, secure: env.cookieSecure, sameSite: env.cookieSecure ? 'none' : 'lax' });
      return res.status(201).json({ user });
    } catch (e: any) {
      const code = e.message?.includes('in use') ? 409 : 400;
      return res.status(code).json({ message: e.message || 'Registration failed' });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { user, token } = await service.login(req.body.email, req.body.password);
      res.cookie('token', token, { httpOnly: true, secure: env.cookieSecure, sameSite: env.cookieSecure ? 'none' : 'lax' });
      return res.json({ user });
    } catch (e: any) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  },
  logout: async (_req: Request, res: Response) => {
    res.clearCookie('token');
    return res.status(204).send();
  },
  me: async (req: AuthedRequest, res: Response) => {
    try {
      const user = await service.me(req.user!.id);
      return res.json({ user });
    } catch {
      return res.status(404).json({ message: 'Not found' });
    }
  },
  updateProfile: async (req: AuthedRequest, res: Response) => {
    const user = await service.updateProfile(req.user!.id, req.body.name);
    return res.json({ user });
  },
};