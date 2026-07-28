import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "../config/env.js";

export function securityHeaders() {
  return helmet({
    contentSecurityPolicy: env.isProd
      ? {
          useDefaults: true,
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", ...env.allowedOrigins],
            frameAncestors: ["'none'"],
          },
        }
      : false,
    // Allow frontend (different origin in local/prod CDN setups) to load /uploads images
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    hsts: env.isProd
      ? {
          maxAge: 63_072_000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  });
}

export function corsMiddleware() {
  return cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, server-to-server) with no Origin
      if (!origin) {
        callback(null, true);
        return;
      }
      if (env.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}

/** In production behind TLS-terminating proxy, redirect plain HTTP */
export function enforceHttps(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!env.isProd) {
    next();
    return;
  }

  const proto = req.header("x-forwarded-proto");
  if (proto && proto !== "https") {
    res.redirect(301, `https://${req.header("host")}${req.originalUrl}`);
    return;
  }
  next();
}
