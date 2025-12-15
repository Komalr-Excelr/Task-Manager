import { api } from './client';

export type User = { id: string; name: string; email: string };

export const UsersAPI = {
  list: () => api.get('/users').then(r => r.data.users as User[]),
};