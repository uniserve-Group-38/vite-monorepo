import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

export const paymentController = {
  initialize: async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId, studentId } = req.body;
      const result = await paymentService.initializePayment(bookingId, studentId);
      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error("[PAYMENT_INITIALIZE]", error);
      if (error.message === "NOT_FOUND") {
        res.status(404).json({ error: "Booking not found" });
        return;
      }
      if (error.message === "INVALID_PRICE") {
        res.status(400).json({ error: "Invalid service price" });
        return;
      }
      if (error.message === "PAYSTACK_ERROR") {
        res.status(500).json({ error: "Failed to initialize payment" });
        return;
      }
      res.status(500).json({ error: "Failed to initialize payment" });
    }
  },

  verify: async (req: Request, res: Response): Promise<void> => {
    try {
      const reference = req.query.reference as string;
      if (!reference) {
        res.status(400).json({ error: "Reference required" });
        return;
      }
      const result = await paymentService.verifyPayment(reference);
      res.json(result);
    } catch (error: any) {
      console.error("[PAYMENT_VERIFY]", error);
      if (error.message === "VERIFY_FAILED") {
        res.status(400).json({ success: false, error: "Verification failed" });
        return;
      }
      if (error.message === "NOT_FOUND") {
        res.status(404).json({ success: false, error: "Transaction not found" });
        return;
      }
      res.status(500).json({ error: "Verification failed" });
    }
  },

  // NOTE: req.body here is a raw Buffer (set by express.raw() in index.ts)
  webhook: async (req: Request, res: Response): Promise<void> => {
    try {
      const rawBody = req.body as Buffer;
      const signature = req.headers["x-paystack-signature"] as string;
      const result = await paymentService.handleWebhook(rawBody, signature);
      res.json(result);
    } catch (error: any) {
      console.error("[PAYMENT_WEBHOOK]", error);
      if (error.message === "INVALID_SIGNATURE") {
        res.status(401).json({ error: "Invalid signature" });
        return;
      }
      if (error.message === "NOT_FOUND") {
        res.status(404).json({ error: "Transaction not found" });
        return;
      }
      res.status(500).json({ error: "Webhook processing failed" });
    }
  },
};
