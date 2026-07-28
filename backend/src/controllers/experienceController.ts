import type { Request, Response } from "express";
import { experienceService } from "../services/experienceService.js";

export const experienceController = {
  async list(_req: Request, res: Response) {
    const data = await experienceService.list();
    res.json({ data });
  },

  async getById(req: Request, res: Response) {
    const data = await experienceService.getById(req.params.id as string);
    res.json({ data });
  },

  async create(req: Request, res: Response) {
    const data = await experienceService.create(req.body);
    res.status(201).json({ data });
  },

  async update(req: Request, res: Response) {
    const data = await experienceService.update(req.params.id as string, req.body);
    res.json({ data });
  },

  async remove(req: Request, res: Response) {
    await experienceService.remove(req.params.id as string);
    res.status(204).send();
  },
};
