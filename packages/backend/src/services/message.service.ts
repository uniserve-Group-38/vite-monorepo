import { messageRepository } from "../repositories/message.repository";
import { conversationRepository } from "../repositories/conversation.repository";
import { pusherServer } from "../lib/pusher";

export const messageService = {
  sendMessage: async (
    senderId: string,
    body: { message: string; conversationId: string; id?: string }
  ) => {
    const { message, conversationId, id } = body;

    // 1. Verify conversation exists and sender is a participant
    const conversation = await conversationRepository.findWithBooking(conversationId);
    if (!conversation?.booking) throw new Error("NOT_FOUND");

    const { studentId, providerId } = conversation.booking;
    const isParticipant = senderId === studentId || senderId === providerId;
    if (!isParticipant) throw new Error("FORBIDDEN");

    // 2. Persist the message
    const messageId = id || crypto.randomUUID();
    const newMessage = await messageRepository.create({
      id: messageId,
      conversationId,
      senderId,
      content: message,
    });

    // 3. Touch conversation so chat list reorders correctly
    await messageRepository.touchConversation(conversationId);

    // 4. Update daily message group for archival
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await messageRepository.findOrCreateMessageGroup(
      conversationId,
      studentId,
      providerId,
      senderId,
      message,
      today
    );

    // 5. Broadcast via Pusher
    const payload = {
      id: newMessage.id,
      senderId: newMessage.senderId,
      message: newMessage.content,
      timestamp: newMessage.createdAt.toISOString(),
    };
    await pusherServer.trigger(conversationId, "new-message", payload);

    return payload;
  },

  markConversationRead: async (userId: string, conversationId: string) => {
    const conversation = await conversationRepository.findWithBooking(conversationId);
    if (!conversation?.booking) throw new Error("NOT_FOUND");

    const { studentId, providerId } = conversation.booking;
    if (userId !== studentId && userId !== providerId) throw new Error("FORBIDDEN");

    await messageRepository.markConversationRead(conversationId, userId);
    const readAt = new Date().toISOString();
    await pusherServer.trigger(conversationId, "messages-read", { readAt });

    return { ok: true };
  },

  markAllRead: async (providerId: string) => {
    const unread = await messageRepository.findUnreadForProvider(providerId);
    const fromStudent = unread.filter(
      (m) => m.conversation.booking.studentId === m.senderId
    );

    if (fromStudent.length === 0) return { ok: true, marked: 0 };

    const conversationIds = [...new Set(fromStudent.map((m) => m.conversationId))];
    const readAt = new Date();

    await messageRepository.markManyRead(
      fromStudent.map((m) => m.id),
      readAt
    );

    for (const cid of conversationIds) {
      await pusherServer.trigger(cid, "messages-read", { readAt: readAt.toISOString() });
    }

    return { ok: true, marked: fromStudent.length };
  },

  getUnreadCountForStudent: async (userId: string) => {
    const messages = await messageRepository.findUnreadCountForStudent(userId);
    const count = messages.filter(
      (m) => m.conversation.booking.studentId === m.senderId
    ).length;
    return { count };
  },
};
