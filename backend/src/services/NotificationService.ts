import { NotificationRepository } from '../repositories/NotificationRepository';

export class NotificationService {
  constructor(private repo = new NotificationRepository()) {}

  list(userId: string) {
    return this.repo.listForUser(userId);
  }

  markRead(id: string) {
    return this.repo.markRead(id);
  }
}