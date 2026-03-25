import { prisma } from "../lib/prisma";

export const conversationRepository = {
  findWithBooking: (id: string) =>
    prisma.conversation.findUnique({
      where: { id },
      include: {
        booking: { select: { studentId: true, providerId: true } },
      },
    }),

  findByProviderWithMessages: (providerId: string) =>
    prisma.conversation.findMany({
      where: { booking: { providerId } },
      include: {
        booking: {
          include: {
            student: { select: { id: true, name: true, image: true } },
            service: { select: { title: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
};
