import { Request, Response } from "express";
import { providerService } from "../services/provider.service";
import { bookingService } from "../services/booking.service";
import { serviceService } from "../services/service.service";

export const providerController = {
  getBookings: async (req: Request, res: Response): Promise<void> => {
    try {
      const bookings = await bookingService.getProviderBookings(req.user!.id);
      res.json(bookings);
    } catch (error) {
      console.error("[PROVIDER_GET_BOOKINGS]", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  },

  attendBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await bookingService.attendBooking(
        req.params.bookingId as string,
        req.user!.id
      );
      res.json(updated);
    } catch (error: any) {
      console.error("[PROVIDER_ATTEND_BOOKING]", error);
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

  getMessages: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await providerService.getConversationsWithUnread(req.user!.id);
      res.json(result);
    } catch (error) {
      console.error("[PROVIDER_GET_MESSAGES]", error);
      res.status(500).json({ error: "Internal Error" });
    }
  },

  getUnreadCount: async (req: Request, res: Response): Promise<void> => {
    try {
      const unreadCount = await providerService.getUnreadCount(req.user!.id);
      res.json({ unreadCount });
    } catch (error) {
      console.error("[PROVIDER_UNREAD_COUNT]", error);
      res.status(500).json({ error: "Internal Error" });
    }
  },

  createService: async (req: Request, res: Response): Promise<void> => {
    try {
      const service = await serviceService.createService(req.user!.id, req.body);
      res.json(service);
    } catch (error) {
      console.error("[PROVIDER_CREATE_SERVICE]", error);
      res.status(500).json({ error: "Internal Error" });
    }
  },

  updateService: async (req: Request, res: Response): Promise<void> => {
    try {
      const service = await serviceService.updateService(
        req.params.serviceId as string,
        req.user!.id,
        req.body
      );
      res.json(service);
    } catch (error) {
      console.error("[PROVIDER_UPDATE_SERVICE]", error);
      res.status(500).json({ error: "Internal Error" });
    }
  },

  deleteService: async (req: Request, res: Response): Promise<void> => {
    try {
      const service = await serviceService.deleteService(
        req.params.serviceId as string,
        req.user!.id
      );
      res.json(service);
    } catch (error) {
      console.error("[PROVIDER_DELETE_SERVICE]", error);
      res.status(500).json({ error: "Internal Error" });
    }
  },
};
