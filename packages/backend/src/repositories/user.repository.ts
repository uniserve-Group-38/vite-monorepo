import { prisma } from "../lib/prisma";

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  updateRole: (id: string, role: string) =>
    prisma.user.update({ where: { id }, data: { role: role as any } }),
};
