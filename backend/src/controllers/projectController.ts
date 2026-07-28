import type { Request, Response } from "express";
import { projectService } from "../services/projectService.js";

export const projectController = {
  async list(req: Request, res: Response) {
    const featured =
      req.query.featured === "true"
        ? true
        : req.query.featured === "false"
          ? false
          : undefined;
    const data = await projectService.list({ featured });
    res.json({ data });
  },

  async getById(req: Request, res: Response) {
    const data = await projectService.getById(req.params.id as string, true);
    res.json({ data });
  },

  async create(req: Request, res: Response) {
    const data = await projectService.create(req.body);
    res.status(201).json({ data });
  },

  async update(req: Request, res: Response) {
    const data = await projectService.update(req.params.id as string, req.body);
    res.json({ data });
  },

  async remove(req: Request, res: Response) {
    await projectService.remove(req.params.id as string);
    res.status(204).send();
  },
};
