import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { validateBody } from "../middleware/validateBody";
import { ChatMessageSchema } from "../schemas/index";

const router = Router();

// POST /api/chat — RAG-powered AI assistant reply
router.post("/", validateBody(ChatMessageSchema), chatController.send);

export { router as chatRouter };
