import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket(onEvents?: (s: Socket) => void) {
  useEffect(() => {
    if (!socket) {
      const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:4000';
      socket = io(base, { withCredentials: true });
    }
    if (socket && onEvents) onEvents(socket);
    return () => {};
  }, [onEvents]);
  return socket;
}