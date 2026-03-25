

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { headers } from "next/headers";

export async function sendMessage(bookingId: string, content: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const senderId = session.user.id;

    // 1. Find the conversation for this booking
    let conversation = await prisma.conversation.findUnique({
      where: { bookingId },
      include: { 
        booking: { 
          select: { studentId: true, providerId: true } 
        } 
      },
    });

    // Create conversation if it doesn't exist (though it should usually exist)
    if (!conversation) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });
        
        if (!booking) return { error: "Booking not found" };

        conversation = await prisma.conversation.create({
            data: { bookingId },
            include: { 
                booking: { 
                    select: { studentId: true, providerId: true } 
                } 
            },
        });
    }

    const { studentId, providerId } = conversation.booking;
    const isParticipant = senderId === studentId || senderId === providerId;
    
    if (!isParticipant) {
      return { error: "You are not part of this conversation" };
    }

    const conversationId = conversation.id;

    // 2. Create the message
    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
    });

    // 3. Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // 4. Trigger Pusher event
    const pusherPayload = {
      id: newMessage.id,
      senderId: newMessage.senderId,
      message: newMessage.content,
      timestamp: newMessage.createdAt.toISOString(),
    };

    await pusherServer.trigger(conversationId, "new-message", pusherPayload);

    return { success: true, message: newMessage };
  } catch (error) {
    console.error("SEND_MESSAGE_ERROR:", error);
    return { error: "Failed to send message" };
  }
}
