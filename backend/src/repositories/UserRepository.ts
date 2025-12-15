import { prisma } from '../db/prisma';

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  create(data: { email: string; name: string; password: string }) {
    return prisma.user.create({ data });
  }
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
  updateName(id: string, name: string) {
    return prisma.user.update({ where: { id }, data: { name } });
  }
  listAll() {
    return prisma.user.findMany({ select: { id: true, name: true, email: true } });
  }
}