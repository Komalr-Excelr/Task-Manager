import { AuthService } from '../src/services/AuthService';
import * as password from '../src/utils/password';

describe('AuthService', () => {
  it('hash/compare works for login flow', async () => {
    const svc = new AuthService({
      findByEmail: jest.fn().mockResolvedValue({ id: 'u1', email: 'e', name: 'n', password: await password.hashPassword('secret') }),
      create: jest.fn(), findById: jest.fn(), updateName: jest.fn(), listAll: jest.fn(),
    } as any);
    const res = await svc.login('e', 'secret');
    expect(res.user.id).toBe('u1');
    expect(typeof res.token).toBe('string');
  });
});