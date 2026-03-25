import { Router } from "express";
import { announcementController } from "../controllers/announcement.controller";
import { authenticate } from "../middleware/authenticate";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validateBody";
import { CreateAnnouncementSchema } from "../schemas/index";

const router = Router();

// GET /api/announcements — public, returns only active + verified
router.get("/", announcementController.getActive);

// GET /api/announcements/all — public, returns all (for admin panel)
router.get("/all", announcementController.getAll);

// POST /api/announcements — ADMIN only
router.post(
  "/",
  authenticate,
  requireRole("ADMIN"),
  validateBody(CreateAnnouncementSchema),
  announcementController.create
);

// DELETE /api/announcements/:id — ADMIN only
router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  announcementController.remove
);

export { router as announcementRouter };
