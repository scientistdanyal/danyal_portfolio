import { prisma } from "../lib/prisma.js";

export const healthService = {
  async check() {
    let database: "up" | "down" = "down";

    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "up";
    } catch {
      database = "down";
    }

    return {
      status: database === "up" ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      service: "engineerdanyal-api",
      database,
    };
  },
};
