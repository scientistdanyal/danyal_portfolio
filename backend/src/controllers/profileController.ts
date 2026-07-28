import type { Request, Response } from "express";
import {
  educationService,
  profileService,
  socialLinkService,
} from "../services/profileService.js";

export const profileController = {
  async getPublic(_req: Request, res: Response) {
    const profile = await profileService.getPublic();
    res.json({ data: profile });
  },

  async getAdmin(_req: Request, res: Response) {
    const profile = await profileService.getAdmin();
    res.json({ data: profile });
  },

  async create(req: Request, res: Response) {
    const profile = await profileService.create(req.body);
    res.status(201).json({ data: profile });
  },

  async update(req: Request, res: Response) {
    const profile = await profileService.update(req.params.id as string, req.body);
    res.json({ data: profile });
  },
};

export const educationController = {
  async list(req: Request, res: Response) {
    const profileId =
      typeof req.query.profileId === "string" ? req.query.profileId : undefined;
    const data = await educationService.list(profileId);
    res.json({ data });
  },

  async create(req: Request, res: Response) {
    const data = await educationService.create(req.body);
    res.status(201).json({ data });
  },

  async update(req: Request, res: Response) {
    const data = await educationService.update(req.params.id as string, req.body);
    res.json({ data });
  },

  async remove(req: Request, res: Response) {
    await educationService.remove(req.params.id as string);
    res.status(204).send();
  },
};

export const socialLinkController = {
  async list(_req: Request, res: Response) {
    const data = await socialLinkService.list();
    res.json({ data });
  },

  async create(req: Request, res: Response) {
    const data = await socialLinkService.create(req.body);
    res.status(201).json({ data });
  },

  async update(req: Request, res: Response) {
    const data = await socialLinkService.update(req.params.id as string, req.body);
    res.json({ data });
  },

  async remove(req: Request, res: Response) {
    await socialLinkService.remove(req.params.id as string);
    res.status(204).send();
  },
};
