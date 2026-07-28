import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/errors.js";
import type { z } from "zod";
import type {
  skillCategorySchema,
  skillSchema,
} from "../validators/schemas.js";

type SkillCategoryInput = z.infer<typeof skillCategorySchema>;
type SkillInput = z.infer<typeof skillSchema>;

export const skillService = {
  async listPublic() {
    return prisma.skillCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        skills: { orderBy: { sortOrder: "asc" } },
      },
    });
  },

  async listCategories() {
    return this.listPublic();
  },

  async createCategory(data: SkillCategoryInput) {
    return prisma.skillCategory.create({ data });
  },

  async updateCategory(id: string, data: Partial<SkillCategoryInput>) {
    await this.requireCategory(id);
    return prisma.skillCategory.update({ where: { id }, data });
  },

  async removeCategory(id: string) {
    await this.requireCategory(id);
    await prisma.skillCategory.delete({ where: { id } });
  },

  async createSkill(data: SkillInput) {
    await this.requireCategory(data.categoryId);
    return prisma.skill.create({ data });
  },

  async updateSkill(id: string, data: Partial<SkillInput>) {
    await this.requireSkill(id);
    return prisma.skill.update({ where: { id }, data });
  },

  async removeSkill(id: string) {
    await this.requireSkill(id);
    await prisma.skill.delete({ where: { id } });
  },

  async requireCategory(id: string) {
    const row = await prisma.skillCategory.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Skill category");
    return row;
  },

  async requireSkill(id: string) {
    const row = await prisma.skill.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Skill");
    return row;
  },
};
