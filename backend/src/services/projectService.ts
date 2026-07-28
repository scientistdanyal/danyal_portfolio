import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/errors.js";
import type { z } from "zod";
import type { projectSchema } from "../validators/schemas.js";

type ProjectInput = z.infer<typeof projectSchema>;

export const projectService = {
  async list(options?: { featured?: boolean; includeCaseStudy?: boolean }) {
    return prisma.project.findMany({
      where:
        options?.featured === undefined
          ? undefined
          : { featured: options.featured },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        caseStudy: options?.includeCaseStudy ?? false,
      },
    });
  },

  async getById(id: string, includeCaseStudy = true) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { caseStudy: includeCaseStudy },
    });
    if (!project) throw new NotFoundError("Project");
    return project;
  },

  async create(data: ProjectInput) {
    const { caseStudy, ...projectData } = data;
    return prisma.project.create({
      data: {
        ...projectData,
        caseStudy: caseStudy
          ? {
              create: caseStudy,
            }
          : undefined,
      },
      include: { caseStudy: true },
    });
  },

  async update(id: string, data: Partial<ProjectInput>) {
    await this.require(id);
    const { caseStudy, ...projectData } = data;

    return prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id },
        data: projectData,
      });

      if (caseStudy === null) {
        await tx.caseStudyDetails.deleteMany({ where: { projectId: id } });
      } else if (caseStudy) {
        await tx.caseStudyDetails.upsert({
          where: { projectId: id },
          create: { ...caseStudy, projectId: id },
          update: caseStudy,
        });
      }

      return tx.project.findUniqueOrThrow({
        where: { id: project.id },
        include: { caseStudy: true },
      });
    });
  },

  async remove(id: string) {
    await this.require(id);
    await prisma.project.delete({ where: { id } });
  },

  async require(id: string) {
    const row = await prisma.project.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Project");
    return row;
  },
};
