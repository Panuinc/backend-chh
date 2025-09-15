import prisma from "@/lib/prisma";

export class UserRepository {
  async findAll() {
    return prisma.user.findMany();
  }

  async findById(userId) {
    return prisma.user.findUnique({ where: { userId } });
  }

  async create(data) {
    return prisma.user.create({ data });
  }

  async update(userId, data) {
    return prisma.user.update({ where: { userId }, data });
  }
}
