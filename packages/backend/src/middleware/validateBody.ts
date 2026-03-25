import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Request body validation middleware factory using Zod.
 * Replaces req.body with the parsed (coerced + sanitised) data on success.
 * Returns 400 with flattened validation errors on failure.
 *
 * Usage:
 *   router.post("/", validateBody(CreateAnnouncementSchema), controller.create);
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: (result.error as ZodError).flatten(),
      });
      return;
    }
    // Replace body with coerced, validated data
    req.body = result.data;
    next();
  };
}
