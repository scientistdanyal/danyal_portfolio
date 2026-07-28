import type { Request, Response } from "express";
import { blogService } from "../services/blogService.js";

export const blogController = {
  async listPublic(_req: Request, res: Response) {
    const data = await blogService.listPublic();
    res.json({ data });
  },

  async listAdmin(_req: Request, res: Response) {
    const data = await blogService.listAdmin();
    res.json({ data });
  },

  async getBySlug(req: Request, res: Response) {
    const data = await blogService.getBySlug(req.params.slug as string, true);
    res.json({ data });
  },

  async getById(req: Request, res: Response) {
    const data = await blogService.getById(req.params.id as string);
    res.json({ data });
  },

  async create(req: Request, res: Response) {
    const data = await blogService.create(req.body);
    res.status(201).json({ data });
  },

  async update(req: Request, res: Response) {
    const data = await blogService.update(req.params.id as string, req.body);
    res.json({ data });
  },

  async remove(req: Request, res: Response) {
    await blogService.remove(req.params.id as string);
    res.status(204).send();
  },
};
