import { prisma } from "../lib/prisma";

export const announcementRepository = {
  findAllActive: () =>
    prisma.announcement.findMany({
      where: { isActive: true, isVerified: true },
      orderBy: { createdAt: "desc" },
    }),

  findAll: () =>
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    }),

  create: (data: {
    title: string;
    content: string;
    summary?: string | null;
    category: string;
    imageUrl?: string | null;
    externalLink?: string | null;
    contactInfo?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
  }) =>
    prisma.announcement.create({
      data: {
        ...data,
        isVerified: data.isVerified ?? true,
        isActive: data.isActive ?? true,
      },
    }),

  deleteById: (id: string) =>
    prisma.announcement.delete({ where: { id } }),
};
