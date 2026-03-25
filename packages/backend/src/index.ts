import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "./routes/index";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

// Security headers
app.use(helmet());

// CORS — allow frontend origin with credentials for better-auth cookie sessions
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// HTTP request logging
app.use(morgan("dev"));

// IMPORTANT: Paystack webhook must receive the raw body for HMAC signature validation.
// Register express.raw() for the webhook path BEFORE express.json() is applied globally.
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

// Parse JSON for all other routes
app.use(express.json());

// Mount all API routes under /api
app.use("/api", router);

// Global 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[UNHANDLED_ERROR]", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Uniserve backend running on http://localhost:${PORT}`);
});

export default app;
