import { Router, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// better-auth handles all /auth/* paths automatically:
//  - POST /api/auth/sign-in/email
//  - POST /api/auth/sign-up/email
//  - GET  /api/auth/session
//  - GET  /api/auth/callback/google
//  - POST /api/auth/sign-out
//  - POST /api/auth/verify-email
//  etc.
router.all("/auth/*", (req: Request, res: Response) => {
  toNodeHandler(auth)(req, res);
});

// Custom lightweight GET /api/auth/get-session endpoint
// Returns the current session user as { user } — kept for frontend compatibility
router.get("/auth/get-session", authenticate, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

export { router as authRouter };
