import prisma from "@/lib/prisma";

export const UserRepository = {
  getAll: (skip = 0, take = 10) =>
    prisma.user.findMany({
      skip,
      take,
      orderBy: { userCreateAt: "asc" },
      include: {
        createdBy: { select: { userFirstName: true, userLastName: true } },
        updatedBy: { select: { userFirstName: true, userLastName: true } },
      },
    }),

  countAll: () => prisma.user.count(),

  findById: (userId) =>
    prisma.user.findUnique({
      where: { userId },
      include: {
        createdBy: { select: { userFirstName: true, userLastName: true } },
        updatedBy: { select: { userFirstName: true, userLastName: true } },
      },
    }),

  findByName: (userName) =>
    prisma.user.findFirst({
      where: { userName: userName.trim().toLowerCase() },
    }),

  create: (data) => prisma.user.create({ data }),

  update: (userId, data) =>
    prisma.user.update({
      where: { userId },
      data,
    }),
};
