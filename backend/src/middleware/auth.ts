import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/authService.js";
import { AppError } from "../lib/errors.js";

function extractToken(req: Request): string | undefined {
  const header = req.header("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  const cookieToken = req.cookies?.[authService.cookieName];
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }
  return undefined;
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const token = extractToken(req);
    if (!token) {
      next(new AppError(401, "Unauthorized"));
      return;
    }
    req.user = authService.verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
}
