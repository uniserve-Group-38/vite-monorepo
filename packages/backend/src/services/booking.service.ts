import { bookingRepository } from "../repositories/booking.repository";

export const bookingService = {
  createOrReuseBooking: async (
    studentId: string,
    providerId: string,
    serviceId: string
  ) => {
    const existing = await bookingRepository.findExistingPending(
      studentId,
      providerId,
      serviceId
    );

    if (existing) {
      return {
        booking: existing,
        conversationId: existing.conversation?.id,
        reused: true,
      };
    }

    const booking = await bookingRepository.createWithConversation(
      studentId,
      providerId,
      serviceId
    );

    return {
      booking,
      conversationId: booking.conversation?.id,
      reused: false,
    };
  },

  getProviderBookings: (providerId: string) =>
    bookingRepository.findByProvider(providerId),

  attendBooking: async (bookingId: string, providerId: string) => {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new Error("NOT_FOUND");
    if (booking.providerId !== providerId) throw new Error("FORBIDDEN");
    return bookingRepository.markAttended(bookingId);
  },
};
