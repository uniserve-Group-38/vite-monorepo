import { Router } from "express";
import { serviceController } from "../controllers/service.controller";

const router = Router();

// GET /api/services/:id — public endpoint to fetch a single service with provider info
router.get("/:id", serviceController.getById);

export { router as serviceRouter };
