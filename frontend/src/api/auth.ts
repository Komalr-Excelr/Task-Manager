import { api } from './client';

export const AuthAPI = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data).then(r => r.data.user),
  register: (data: { email: string; name: string; password: string }) => api.post('/auth/register', data).then(r => r.data.user),
  me: () => api.get('/auth/me').then(r => r.data.user),
  updateProfile: (data: { name: string }) => api.patch('/auth/users/me', data).then(r => r.data.user),
};