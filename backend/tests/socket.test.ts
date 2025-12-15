import { notifier } from '../src/server/socket';

describe('Notifier', () => {
  it('exposes emitToAll and emitToUser', () => {
    expect(typeof notifier.emitToAll).toBe('function');
    expect(typeof notifier.emitToUser).toBe('function');
  });
});