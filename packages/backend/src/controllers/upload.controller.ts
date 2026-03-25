import { Request, Response } from "express";
import { uploadService } from "../services/upload.service";

export const uploadController = {
  upload: async (req: Request, res: Response): Promise<void> => {
    try {
      // multer attaches file to req.file
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      const fileName = (req.body.fileName as string) || file.originalname;
      const folder = (req.body.folder as string) || "/uploads";

      const result = await uploadService.uploadToImageKit(
        file.buffer,
        fileName,
        folder,
        file.mimetype
      );

      res.json(result);
    } catch (error: any) {
      console.error("[UPLOAD]", error);
      if (error.message === "IMAGEKIT_ERROR") {
        res.status(500).json({ error: "Upload failed" });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
