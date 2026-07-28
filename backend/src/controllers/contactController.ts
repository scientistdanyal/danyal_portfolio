import type { Request, Response } from "express";
import { contactService } from "../services/contactService.js";

export const contactController = {
  async getSettings(_req: Request, res: Response) {
    const data = await contactService.getSettings();
    res.json({ data });
  },

  async upsertSettings(req: Request, res: Response) {
    const data = await contactService.upsertSettings(req.body);
    res.json({ data });
  },

  async submit(req: Request, res: Response) {
    const data = await contactService.submit(req.body);
    res.status(201).json({ data });
  },

  async listSubmissions(_req: Request, res: Response) {
    const data = await contactService.listSubmissions();
    res.json({ data });
  },

  async markRead(req: Request, res: Response) {
    const read = req.body?.read !== false;
    const data = await contactService.markSubmissionRead(
      req.params.id as string,
      read,
    );
    res.json({ data });
  },

  async removeSubmission(req: Request, res: Response) {
    await contactService.removeSubmission(req.params.id as string);
    res.status(204).send();
  },
};
