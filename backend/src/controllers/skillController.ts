import type { Request, Response } from "express";
import { skillService } from "../services/skillService.js";

export const skillController = {
  async listPublic(_req: Request, res: Response) {
    const data = await skillService.listPublic();
    res.json({ data });
  },

  async createCategory(req: Request, res: Response) {
    const data = await skillService.createCategory(req.body);
    res.status(201).json({ data });
  },

  async updateCategory(req: Request, res: Response) {
    const data = await skillService.updateCategory(
      req.params.id as string,
      req.body,
    );
    res.json({ data });
  },

  async removeCategory(req: Request, res: Response) {
    await skillService.removeCategory(req.params.id as string);
    res.status(204).send();
  },

  async createSkill(req: Request, res: Response) {
    const data = await skillService.createSkill(req.body);
    res.status(201).json({ data });
  },

  async updateSkill(req: Request, res: Response) {
    const data = await skillService.updateSkill(req.params.id as string, req.body);
    res.json({ data });
  },

  async removeSkill(req: Request, res: Response) {
    await skillService.removeSkill(req.params.id as string);
    res.status(204).send();
  },
};
