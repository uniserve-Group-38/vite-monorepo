import { conversationRepository } from "../repositories/conversation.repository";
import { messageRepository } from "../repositories/message.repository";

export const providerService = {
  getConversationsWithUnread: async (providerId: string) => {
    const conversations = await conversationRepository.findByProviderWithMessages(providerId);

    return conversations.map((conv) => ({
      id: conv.id,
      bookingId: conv.bookingId,
      student: conv.booking.student,
      serviceTitle: conv.booking.service.title,
      latestMessage: conv.messages[0] || null,
      unreadCount: conv.messages.filter(
        (m) => m.senderId !== providerId && m.readAt === null
      ).length,
      updatedAt: conv.updatedAt,
    }));
  },

  getUnreadCount: (providerId: string) =>
    messageRepository.countUnreadForProvider(providerId),
};
