import { prisma } from "../lib/prisma";
import { ApplicationStatus } from "../lib/generated/prisma";

export const applicationRepository = {
  create: (data: {
    userId: string;
    businessName: string;
    description: string;
    category: string;
  }) =>
    prisma.service_provider_application.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        status: "PENDING",
        ...data,
      },
    }),

  findById: (id: string) =>
    prisma.service_provider_application.findUnique({
      where: { id },
      include: { user: true },
    }),

  updateStatus: (id: string, status: ApplicationStatus) =>
    prisma.service_provider_application.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { user: true },
    }),
};
