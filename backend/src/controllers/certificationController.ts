import type { Request, Response } from "express";
import { certificationService } from "../services/certificationService.js";

export const certificationController = {
  async list(_req: Request, res: Response) {
    const data = await certificationService.list();
    res.json({ data });
  },

  async getById(req: Request, res: Response) {
    const data = await certificationService.getById(req.params.id as string);
    res.json({ data });
  },

  async create(req: Request, res: Response) {
    const data = await certificationService.create(req.body);
    res.status(201).json({ data });
  },

  async update(req: Request, res: Response) {
    const data = await certificationService.update(
      req.params.id as string,
      req.body,
    );
    res.json({ data });
  },

  async remove(req: Request, res: Response) {
    await certificationService.remove(req.params.id as string);
    res.status(204).send();
  },
};
