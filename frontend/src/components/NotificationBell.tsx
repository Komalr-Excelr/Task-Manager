import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { api } from '../api/client';

type Notification = { id: string; message: string; read: boolean; taskId: string; createdAt: string };

export function NotificationBell() {
  const [items, setItems] = useState<Notification[]>([]);

  const load = async () => {
    const res = await api.get('/notifications');
    setItems(res.data.notifications);
  };

  useSocket((s) => {
    s.on('notification.assigned', () => load());
  });

  useEffect(() => { load(); }, []);

  const unread = items.filter(i => !i.read).length;

  const markRead = async (id: string) => {
    await api.post(`/notifications/${id}/read`);
    await load();
  };

  return (
    <div className="relative">
      <button className="relative text-xl">
        <span>🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unread}</span>
        )}
      </button>
      {items.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow rounded p-2 z-10 max-h-80 overflow-auto">
          {items.map(n => (
            <div key={n.id} className="p-2 border-b flex justify-between items-center">
              <div className="text-sm">{n.message}</div>
              {!n.read && <button onClick={() => markRead(n.id)} className="text-xs text-blue-600">Mark read</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}