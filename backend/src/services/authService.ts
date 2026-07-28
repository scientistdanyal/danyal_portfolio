import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import type { AuthUser } from "../types/auth.js";

const COOKIE_NAME = "admin_token";
const TOKEN_TTL = "8h";

type TokenPayload = {
  sub: string;
  email: string;
};

export const authService = {
  cookieName: COOKIE_NAME,

  async ensureAdminSeeded() {
    if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
      console.warn(
        "[auth] ADMIN_EMAIL/ADMIN_PASSWORD unset — skipping admin seed",
      );
      return;
    }

    const existing = await prisma.adminUser.findUnique({
      where: { email: env.ADMIN_EMAIL },
    });

    if (existing) return;

    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    await prisma.adminUser.create({
      data: {
        email: env.ADMIN_EMAIL,
        passwordHash,
      },
    });
    console.log(`[auth] Seeded admin user ${env.ADMIN_EMAIL}`);
  },

  async login(email: string, password: string) {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = this.signToken({ id: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email },
    };
  },

  signToken(user: AuthUser) {
    const payload: TokenPayload = { sub: user.id, email: user.email };
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL });
  },

  verifyToken(token: string): AuthUser {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      return { id: decoded.sub, email: decoded.email };
    } catch {
      throw new AppError(401, "Invalid or expired session");
    }
  },

  cookieOptions() {
    return {
      httpOnly: true,
      secure: env.isProd,
      sameSite: "lax" as const,
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    };
  },

  async getUserById(id: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) throw new AppError(401, "Unauthorized");
    return user;
  },
};
