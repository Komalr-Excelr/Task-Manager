import { UserRepository } from '../repositories/UserRepository';
import { comparePassword, hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';

export class AuthService {
  constructor(private users = new UserRepository()) {}

  async register(email: string, name: string, password: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new Error('Email already in use');
    const hashed = await hashPassword(password);
    const user = await this.users.create({ email, name, password: hashed });
    const token = signToken({ userId: user.id });
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const ok = await comparePassword(password, user.password);
    if (!ok) throw new Error('Invalid credentials');
    const token = signToken({ userId: user.id });
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new Error('Not found');
    return { id: user.id, email: user.email, name: user.name };
  }

  async updateProfile(userId: string, name: string) {
    const updated = await this.users.updateName(userId, name);
    return { id: updated.id, email: updated.email, name: updated.name };
  }
}