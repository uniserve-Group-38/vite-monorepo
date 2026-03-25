import { prisma } from "../lib/prisma";

export const serviceRepository = {
  create: (data: {
    title: string;
    description: string;
    category: string;
    price?: string;
    operatingHours?: string;
    imageUrl?: string;
    providerId: string;
  }) =>
    prisma.service.create({
      data: { ...data, status: "Available" },
    }),

  findByIdWithProvider: (id: string) =>
    prisma.service.findUnique({
      where: { id },
      include: {
        provider: { select: { id: true, name: true, email: true } },
      },
    }),

  update: (
    serviceId: string,
    providerId: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      price?: string;
      operatingHours?: string;
      imageUrl?: string;
    }
  ) =>
    prisma.service.update({
      where: { id: serviceId, providerId },
      data,
    }),

  delete: (serviceId: string, providerId: string) =>
    prisma.service.delete({
      where: { id: serviceId, providerId },
    }),
};
