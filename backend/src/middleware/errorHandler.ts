import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof Error && err.message.startsWith("CORS blocked")) {
    res.status(403).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: env.isProd ? "Internal server error" : "Internal server error",
    ...(env.isDev && err instanceof Error ? { debug: err.message } : {}),
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route not found" });
}
