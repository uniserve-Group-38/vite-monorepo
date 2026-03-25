import { Request, Response, NextFunction } from "express";

/**
 * Role-based authorization guard factory.
 * Must be used AFTER the `authenticate` middleware.
 *
 * Usage:
 *   router.delete("/:id", authenticate, requireRole("ADMIN"), controller.remove);
 *   router.get("/", authenticate, requireRole("PROVIDER", "ADMIN"), controller.list);
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}
