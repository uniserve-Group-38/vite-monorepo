import { Router } from "express";
import { messageController } from "../controllers/message.controller";
import { authenticate } from "../middleware/authenticate";
import { validateBody } from "../middleware/validateBody";
import { SendMessageSchema, MarkReadSchema } from "../schemas/index";

const router = Router();

// POST /api/messages — send a message to a conversation
router.post(
  "/",
  authenticate,
  validateBody(SendMessageSchema),
  messageController.send
);

// POST /api/messages/mark-read — mark all messages in a conversation as read
router.post(
  "/mark-read",
  authenticate,
  validateBody(MarkReadSchema),
  messageController.markRead
);

// POST /api/messages/mark-all-read — mark all provider unread messages as read
router.post("/mark-all-read", authenticate, messageController.markAllRead);

// GET /api/messages/unread-count — student-facing unread count badge
router.get("/unread-count", authenticate, messageController.unreadCount);

export { router as messageRouter };
