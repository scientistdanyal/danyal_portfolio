import type { Request, Response } from "express";
import { healthService } from "../services/healthService.js";

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const payload = await healthService.check();
  const statusCode = payload.database === "up" ? 200 : 503;
  res.status(statusCode).json(payload);
}
