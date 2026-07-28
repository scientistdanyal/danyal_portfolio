import type { Request, Response } from "express";
import { authService } from "../services/authService.js";

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const result = await authService.login(email, password);
    res.cookie(
      authService.cookieName,
      result.token,
      authService.cookieOptions(),
    );
    res.json({ data: { user: result.user } });
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie(authService.cookieName, {
      httpOnly: true,
      secure: authService.cookieOptions().secure,
      sameSite: "lax",
      path: "/",
    });
    res.status(204).send();
  },

  async me(req: Request, res: Response) {
    const user = await authService.getUserById(req.user!.id);
    res.json({ data: { user } });
  },
};
