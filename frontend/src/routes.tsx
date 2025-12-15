import { createRoutesFromElements, Route } from 'react-router-dom';
import { App } from './App';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { TaskDetail } from './pages/TaskDetail';
import { Profile } from './pages/Profile';

export const routes = createRoutesFromElements(
  <Route path="/" element={<App /> }>
    <Route index element={<Dashboard />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="tasks" element={<Tasks />} />
    <Route path="tasks/:id" element={<TaskDetail />} />
    <Route path="profile" element={<Profile />} />
  </Route>
);