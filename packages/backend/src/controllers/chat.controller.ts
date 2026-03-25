import { Request, Response } from "express";
import { chatService } from "../services/chat.service";

export const chatController = {
  send: async (req: Request, res: Response): Promise<void> => {
    try {
      const { message } = req.body;
      const reply = await chatService.getAiReply(message);
      res.json({ reply });
    } catch (error: any) {
      console.error("[CHAT_SEND]", error);
      res.status(500).json({ error: error?.message || "Failed to process the request" });
    }
  },
};
