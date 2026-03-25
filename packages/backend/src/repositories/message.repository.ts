import { prisma } from "../lib/prisma";

export const messageRepository = {
  create: (data: {
    id?: string;
    conversationId: string;
    senderId: string;
    content: string;
  }) => prisma.message.create({ data }),

  touchConversation: (conversationId: string) =>
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),

  countUnreadForProvider: (providerId: string) =>
    prisma.message.count({
      where: {
        readAt: null,
        senderId: { not: providerId },
        conversation: { booking: { providerId } },
      },
    }),

  findUnreadForProvider: (providerId: string) =>
    prisma.message.findMany({
      where: {
        readAt: null,
        conversation: { booking: { providerId } },
      },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        conversation: {
          select: { booking: { select: { studentId: true } } },
        },
      },
    }),

  markManyRead: (ids: string[], readAt: Date) =>
    prisma.message.updateMany({
      where: { id: { in: ids } },
      data: { readAt },
    }),

  markConversationRead: (conversationId: string, exceptSenderId: string) =>
    prisma.message.updateMany({
      where: {
        conversationId,
        NOT: { senderId: exceptSenderId },
        readAt: null,
      },
      data: { readAt: new Date() },
    }),

  findUnreadCountForStudent: (userId: string) =>
    prisma.message.findMany({
      where: {
        readAt: null,
        conversation: { booking: { providerId: userId } },
      },
      select: {
        senderId: true,
        conversation: {
          select: { booking: { select: { studentId: true } } },
        },
      },
    }),

  findOrCreateMessageGroup: async (
    conversationId: string,
    user1Id: string,
    user2Id: string,
    senderId: string,
    content: string,
    today: Date
  ) => {
    type GroupData = Record<string, string[] | string>;

    const existing = await prisma.messageGroup.findFirst({
      where: { conversationId, date: today },
    });

    if (!existing) {
      const data: GroupData = {
        [user1Id]: user1Id === senderId ? [content] : [],
        [user2Id]: user2Id === senderId ? [content] : [],
        date: today.toISOString(),
      };
      return prisma.messageGroup.create({
        data: { conversationId, date: today, data: data as object },
      });
    }

    const cur = (existing.data || {}) as GroupData;
    const u1 = (cur[user1Id] ?? []) as string[];
    const u2 = (cur[user2Id] ?? []) as string[];
    const data: GroupData = {
      [user1Id]: user1Id === senderId ? [...u1, content] : u1,
      [user2Id]: user2Id === senderId ? [...u2, content] : u2,
      date: today.toISOString(),
    };
    return prisma.messageGroup.update({
      where: { id: existing.id },
      data: { data: data as object },
    });
  },
};
