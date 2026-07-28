import "dotenv/config";
import path from "node:path";
import express from "express";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { adminApiRouter, publicApiRouter } from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";
import {
  corsMiddleware,
  enforceHttps,
  securityHeaders,
} from "./middleware/security.js";
import { requireAuth } from "./middleware/auth.js";
import {
  adminRateLimiter,
  apiRateLimiter,
} from "./middleware/rateLimit.js";
import { authService } from "./services/authService.js";

const app = express();

if (env.TRUST_PROXY || env.isProd) {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");
app.use(enforceHttps);
app.use(securityHeaders());
app.use(corsMiddleware());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"), {
    fallthrough: true,
    maxAge: env.isProd ? "1d" : 0,
  }),
);

app.get("/", (_req, res) => {
  res.json({
    name: "engineerdanyal-api",
    status: "ok",
    public: "/api",
    admin: "/api/admin",
  });
});

app.use("/api", apiRateLimiter, publicApiRouter);
app.use("/api/admin", adminRateLimiter, requireAuth, adminApiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await authService.ensureAdminSeeded();
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
