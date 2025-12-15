import { z } from 'zod';

export const registerDto = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
});

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const updateProfileDto = z.object({
  name: z.string().min(1).max(100),
});