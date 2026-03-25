import { Router } from "express";
import { announcementRouter } from "./announcement.routes";
import { applyRouter, adminApplicationRouter } from "./application.routes";
import { authRouter } from "./auth.routes";
import { bookingRouter } from "./booking.routes";
import { chatRouter } from "./chat.routes";
import { messageRouter } from "./message.routes";
import { paymentRouter } from "./payment.routes";
import { providerRouter } from "./provider.routes";
import { serviceRouter } from "./service.routes";
import { uploadRouter } from "./upload.routes";

export const router = Router();

// Auth — better-auth + custom get-session
router.use("/", authRouter);

// Announcements — GET (public), POST/DELETE (admin)
router.use("/announcements", announcementRouter);

// Applications — POST /apply (student), PATCH /admin/applications/:id (admin)
router.use("/apply", applyRouter);
router.use("/admin", adminApplicationRouter);

// Bookings — POST (create/reuse)
router.use("/bookings", bookingRouter);

// Chat — POST (AI reply)
router.use("/chat", chatRouter);

// Messages — POST send, POST mark-read, POST mark-all-read, GET unread-count
router.use("/messages", messageRouter);

// Payments — POST initialize, GET verify, POST webhook
router.use("/payments", paymentRouter);

// Provider — authenticated routes for bookings, messages, services
router.use("/provider", providerRouter);

// Services — GET /:id (public)
router.use("/services", serviceRouter);

// Upload — POST (multipart/form-data)
router.use("/upload-image", uploadRouter);
