import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from './api/client';
import { NotificationBell } from './components/NotificationBell';

export function App() {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => navigate('/login'));
  }, [navigate]);

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="container-page flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-brand-700 font-semibold">TaskManager</Link>
            {user && (
              <nav className="hidden sm:flex items-center gap-4 text-sm">
                <NavLink to="/" className={({isActive})=> isActive? 'text-brand-700 font-medium':'text-gray-600 hover:text-gray-900'}>Dashboard</NavLink>
                <NavLink to="/tasks" className={({isActive})=> isActive? 'text-brand-700 font-medium':'text-gray-600 hover:text-gray-900'}>Tasks</NavLink>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user && <NotificationBell />}
            {user && <Link to="/profile" className="text-sm text-gray-700 hover:text-gray-900">{user.name}</Link>}
            {user && <Link to="/tasks#create-task" className="btn btn-primary">Create Task</Link>}
            {user ? (
              <button onClick={logout} className="btn btn-ghost">Logout</button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-ghost">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="container-page py-6">
        <Outlet />
      </main>
    </div>
  );
}