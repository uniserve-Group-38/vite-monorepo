import { Request, Response } from "express";
import { messageService } from "../services/message.service";

export const messageController = {
  send: async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = await messageService.sendMessage(req.user!.id, req.body);
      res.json(payload);
    } catch (error: any) {
      console.error("[MESSAGE_SEND]", error);
      if (error.message === "NOT_FOUND") {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }
      if (error.message === "FORBIDDEN") {
        res.status(403).json({ error: "You are not part of this conversation" });
        return;
      }
      res.status(500).json({ error: "Internal Error" });
    }
  },

  markRead: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await messageService.markConversationRead(
        req.user!.id,
        req.body.conversationId
      );
      res.json(result);
    } catch (error: any) {
      console.error("[MESSAGE_MARK_READ]", error);
      if (error.message === "NOT_FOUND") {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }
      if (error.message === "FORBIDDEN") {
        res.status(403).json({ error: "Not a participant" });
        return;
      }
      res.status(500).json({ error: "Internal error" });
    }
  },

  markAllRead: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await messageService.markAllRead(req.user!.id);
      res.json(result);
    } catch (error) {
      console.error("[MESSAGE_MARK_ALL_READ]", error);
      res.status(500).json({ error: "Internal error" });
    }
  },

  unreadCount: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await messageService.getUnreadCountForStudent(req.user!.id);
      res.json(result);
    } catch (error) {
      console.error("[MESSAGE_UNREAD_COUNT]", error);
      res.json({ count: 0 }); // graceful degradation — never break the UI badge
    }
  },
};
