import { Request, Response } from "express";
import { applicationService } from "../services/application.service";

export const applicationController = {
  submit: async (req: Request, res: Response): Promise<void> => {
    try {
      const { businessName, description, category } = req.body;
      const application = await applicationService.submitApplication(
        req.user!.id,
        { businessName, description, category }
      );
      res.status(201).json(application);
    } catch (error) {
      console.error("[APPLICATION_SUBMIT]", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  review: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const application = await applicationService.reviewApplication(
        req.user!.id,
        id as string,
        status
      );
      res.json(application);
    } catch (error: any) {
      console.error("[APPLICATION_REVIEW]", error);
      if (error.message === "FORBIDDEN") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      if (error.message === "INVALID_STATUS") {
        res.status(400).json({ error: "Invalid status" });
        return;
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
