import { Router } from "express";
import { applicationController } from "../controllers/application.controller";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validateBody";
import { CreateApplicationSchema, ReviewApplicationSchema } from "../schemas/index";

const router = Router();

// POST /api/apply — authenticated students submit a provider application
router.post(
  "/",
  authenticate,
  validateBody(CreateApplicationSchema),
  applicationController.submit
);

export { router as applyRouter };

// --- Admin sub-router for application review ---
const adminRouter = Router();

// PATCH /api/admin/applications/:id — ADMIN only
adminRouter.patch(
  "/applications/:id",
  authenticate,
  requireRole("ADMIN"),
  validateBody(ReviewApplicationSchema),
  applicationController.review
);

export { adminRouter as adminApplicationRouter };
