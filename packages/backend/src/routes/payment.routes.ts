import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { validateBody } from "../middleware/validateBody";
import { InitializePaymentSchema } from "../schemas/index";

const router = Router();

// POST /api/payments/initialize — create Paystack transaction and pending DB record
router.post(
  "/initialize",
  validateBody(InitializePaymentSchema),
  paymentController.initialize
);

// GET /api/payments/verify?reference=... — verify payment with Paystack
router.get("/verify", paymentController.verify);

// POST /api/payments/webhook — Paystack signs the raw body; express.raw() is set in index.ts
// NO validateBody here — body is a raw Buffer, not JSON
router.post("/webhook", paymentController.webhook);

export { router as paymentRouter };
