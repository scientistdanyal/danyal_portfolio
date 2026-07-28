import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/errors.js";
import type { z } from "zod";
import type { certificationSchema } from "../validators/schemas.js";

type CertificationInput = z.infer<typeof certificationSchema>;

export const certificationService = {
  async list() {
    return prisma.certification.findMany({
      orderBy: [{ sortOrder: "asc" }, { dateCompleted: "desc" }],
    });
  },

  async getById(id: string) {
    return this.require(id);
  },

  async create(data: CertificationInput) {
    return prisma.certification.create({ data });
  },

  async update(id: string, data: Partial<CertificationInput>) {
    await this.require(id);
    return prisma.certification.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.require(id);
    await prisma.certification.delete({ where: { id } });
  },

  async require(id: string) {
    const row = await prisma.certification.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Certification");
    return row;
  },
};
