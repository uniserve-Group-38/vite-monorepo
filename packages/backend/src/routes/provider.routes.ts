import { Router } from "express";
import { providerController } from "../controllers/provider.controller";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validateBody";
import { CreateServiceSchema, UpdateServiceSchema } from "../schemas/index";

const router = Router();

// All provider routes require authentication
router.use(authenticate);

// GET /api/provider/bookings — list provider's pending bookings
router.get("/bookings", providerController.getBookings);

// POST /api/provider/bookings/:bookingId/attend — mark a booking as attended
router.post("/bookings/:bookingId/attend", providerController.attendBooking);

// GET /api/provider/messages — list conversations with unread counts
router.get("/messages", providerController.getMessages);

// GET /api/provider/unread-count — total unread message count badge
router.get("/unread-count", providerController.getUnreadCount);

// POST /api/provider/services — create a new service listing
router.post(
  "/services",
  validateBody(CreateServiceSchema),
  providerController.createService
);

// PUT /api/provider/services/:serviceId — update an existing service listing
router.put(
  "/services/:serviceId",
  validateBody(UpdateServiceSchema),
  providerController.updateService
);

// DELETE /api/provider/services/:serviceId — delete a service listing
router.delete("/services/:serviceId", providerController.deleteService);

export { router as providerRouter };
