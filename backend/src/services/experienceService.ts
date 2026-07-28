import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/errors.js";
import type { z } from "zod";
import type { experienceSchema } from "../validators/schemas.js";

type ExperienceInput = z.infer<typeof experienceSchema>;

export const experienceService = {
  async list() {
    return prisma.experience.findMany({
      orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
    });
  },

  async getById(id: string) {
    return this.require(id);
  },

  async create(data: ExperienceInput) {
    return prisma.experience.create({ data });
  },

  async update(id: string, data: Partial<ExperienceInput>) {
    await this.require(id);
    return prisma.experience.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.require(id);
    await prisma.experience.delete({ where: { id } });
  },

  async require(id: string) {
    const row = await prisma.experience.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Experience");
    return row;
  },
};
