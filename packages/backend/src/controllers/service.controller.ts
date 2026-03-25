import { Request, Response } from "express";
import { serviceService } from "../services/service.service";

export const serviceController = {
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const service = await serviceService.getServiceById(req.params.id as string);
      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }
      res.json(service);
    } catch (error) {
      console.error("[SERVICE_GET_BY_ID]", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  },
};
