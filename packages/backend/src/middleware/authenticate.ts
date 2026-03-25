import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

// Extend Express Request to include a typed user object populated by this middleware
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        image?: string | null;
      };
    }
  }
}

/**
 * Authentication middleware.
 * Validates the better-auth session cookie and populates req.user.
 * Returns 401 if no valid session exists.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Convert Express headers to a plain object that better-auth can read
    const headersObj: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        headersObj[key] = Array.isArray(value) ? value.join(", ") : value;
      }
    }

    const session = await auth.api.getSession({ headers: headersObj as any });

    if (!session?.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as any).role ?? "STUDENT",
      image: session.user.image,
    };

    next();
  } catch (error) {
    console.error("[AUTHENTICATE_ERROR]", error);
    res.status(401).json({ error: "Unauthorized" });
  }
}
