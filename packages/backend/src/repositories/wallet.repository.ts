import { prisma } from "../lib/prisma";

export const walletRepository = {
  upsert: (providerId: string, earnings: number) =>
    prisma.providerWallet.upsert({
      where: { providerId },
      create: {
        providerId,
        availableBalance: earnings,
        totalEarnings: earnings,
      },
      update: {
        availableBalance: { increment: earnings },
        totalEarnings: { increment: earnings },
      },
    }),
};
