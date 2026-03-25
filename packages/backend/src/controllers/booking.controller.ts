import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";

export const bookingController = {
  createOrReuse: async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId, userId, student_id, user_id, providerId, provider_id, serviceId, service_id } = req.body;
      // Accept all field-name variants from legacy client calls
      const resolvedStudentId = studentId ?? userId ?? student_id ?? user_id;
      const resolvedProviderId = providerId ?? provider_id;
      const resolvedServiceId = serviceId ?? service_id;

      if (!resolvedStudentId || !resolvedProviderId || !resolvedServiceId) {
        res.status(400).json({
          error: "studentId (or userId), providerId, and serviceId are required",
        });
        return;
      }

      const result = await bookingService.createOrReuseBooking(
        resolvedStudentId,
        resolvedProviderId,
        resolvedServiceId
      );

      res.status(result.reused ? 200 : 201).json(result);
    } catch (error) {
      console.error("[BOOKING_CREATE_OR_REUSE]", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  },

  getProviderBookings: async (_req: Request, res: Response): Promise<void> => {
    try {
      const bookings = await bookingService.getProviderBookings(_req.user!.id);
      res.json(bookings);
    } catch (error) {
      console.error("[BOOKING_GET_PROVIDER]", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  },

  attend: async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await bookingService.attendBooking(
        req.params.bookingId as string,
        req.user!.id
      );
      res.json(updated);
    } catch (error: any) {
      console.error("[BOOKING_ATTEND]", error);
      if (error.message === "NOT_FOUND") {
        res.status(404).json({ error: "Booking not found" });
        return;
      }
      if (error.message === "FORBIDDEN") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      res.status(500).json({ error: "Failed to update booking" });
    }
  },
};
