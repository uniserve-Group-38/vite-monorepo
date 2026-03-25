import { prisma } from "../lib/prisma";
import { BookingStatus } from "../lib/generated/prisma";

export const bookingRepository = {
  findExistingPending: (studentId: string, providerId: string, serviceId: string) =>
    prisma.booking.findFirst({
      where: { studentId, providerId, serviceId, status: "PENDING" },
      include: { conversation: true },
    }),

  createWithConversation: (studentId: string, providerId: string, serviceId: string) =>
    prisma.booking.create({
      data: {
        studentId,
        providerId,
        serviceId,
        conversation: { create: {} },
      },
      include: { conversation: true },
    }),

  findByProvider: (providerId: string) =>
    prisma.booking.findMany({
      where: { providerId, status: BookingStatus.PENDING },
      include: { student: true, service: true },
      orderBy: { bookedAt: "desc" },
    }),

  findById: (id: string) =>
    prisma.booking.findUnique({ where: { id } }),

  findByIdWithDetails: (id: string) =>
    prisma.booking.findUnique({
      where: { id },
      include: { service: true, student: true, provider: true },
    }),

  markAttended: (id: string) =>
    prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.ATTENDED },
    }),
};
