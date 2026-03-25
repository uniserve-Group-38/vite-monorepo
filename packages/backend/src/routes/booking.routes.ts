import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { validateBody } from "../middleware/validateBody";
import { CreateBookingSchema } from "../schemas/index";

const router = Router();

// POST /api/bookings — create or reuse an existing pending booking
router.post("/", validateBody(CreateBookingSchema), bookingController.createOrReuse);

export { router as bookingRouter };
