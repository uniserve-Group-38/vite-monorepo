import { prisma } from "../lib/prisma";

export const transactionRepository = {
  create: (data: {
    bookingId: string;
    studentId: string;
    providerId: string;
    paystackReference: string;
    totalAmount: number;
    platformCommission: number;
    providerEarnings: number;
  }) =>
    prisma.transaction.create({
      data: { ...data, commissionRate: 0.15, status: "pending" },
    }),

  findByReference: (reference: string) =>
    prisma.transaction.findUnique({
      where: { paystackReference: reference },
    }),

  findByReferenceWithBooking: (reference: string) =>
    prisma.transaction.findUnique({
      where: { paystackReference: reference },
      include: { booking: true },
    }),

  markSuccess: (id: string, paymentMethod: string) =>
    prisma.transaction.update({
      where: { id },
      data: { status: "success", paidAt: new Date(), paymentMethod },
    }),
};
