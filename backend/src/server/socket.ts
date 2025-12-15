import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import cookie from 'cookie';
import { verifyToken } from '../utils/jwt';
import { env } from '../config/env';

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.corsOrigin,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const header = socket.handshake.headers.cookie || '';
      const cookies = cookie.parse(header);
      const token = cookies.token;
      if (!token) return next(new Error('No token'));
      const payload = verifyToken(token);
      (socket as any).userId = payload.userId;
      return next();
    } catch (e) {
      return next(new Error('Auth failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId as string;
    socket.join(`user:${userId}`);
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export const notifier = {
  emitToAll: (event: string, payload: any) => getIO().emit(event, payload),
  emitToUser: (userId: string, event: string, payload: any) => getIO().to(`user:${userId}`).emit(event, payload),
};