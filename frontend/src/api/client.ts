import axios from 'axios';

export const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL ? `${(import.meta as any).env.VITE_API_URL}/api/v1` : 'http://localhost:4000/api/v1',
  withCredentials: true,
});