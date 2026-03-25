import { Request, Response } from "express";
import { announcementService } from "../services/announcement.service";

export const announcementController = {
  getActive: async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await announcementService.getActiveAnnouncements();
      res.json(data);
    } catch (error) {
      console.error("[ANNOUNCEMENT_GET_ACTIVE]", error);
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  },

  getAll: async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await announcementService.getAllAnnouncements();
      res.json(data);
    } catch (error) {
      console.error("[ANNOUNCEMENT_GET_ALL]", error);
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await announcementService.createAnnouncement(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error("[ANNOUNCEMENT_CREATE]", error);
      res.status(500).json({ error: "Failed to create announcement" });
    }
  },

  remove: async (req: Request, res: Response): Promise<void> => {
    try {
      await announcementService.deleteAnnouncement(req.params.id as string);
      res.json({ success: true });
    } catch (error) {
      console.error("[ANNOUNCEMENT_DELETE]", error);
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  },
};
