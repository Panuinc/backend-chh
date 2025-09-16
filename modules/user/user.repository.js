import prisma from "@/lib/prisma";

export const UserRepository = {
  getAll: (skip = 0, take = 10) =>
    prisma.user.findMany({
      skip,
      take,
      orderBy: { userCreateAt: "asc" },
      include: {
        createdBy: { select: { userFirstName: true, userFirstName: true } },
        updatedBy: { select: { userFirstName: true, userFirstName: true } },
      },
    }),

  countAll: () => prisma.user.count(),

  findById: (userId) =>
    prisma.user.findUnique({
      where: { userId },
      include: {
        createdBy: { select: { userFirstName: true, userFirstName: true } },
        updatedBy: { select: { userFirstName: true, userFirstName: true } },
      },
    }),

  findByName: (userFirstName) =>
    prisma.user.findFirst({
      where: { userFirstName: userFirstName.trim().toLowerCase() },
    }),

  create: (data) => prisma.user.create({ data }),

  update: (userId, data) =>
    prisma.user.update({
      where: { userId },
      data,
    }),
};
