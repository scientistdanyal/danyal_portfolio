import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/errors.js";
import type { z } from "zod";
import type {
  educationInputSchema,
  profileCreateSchema,
  profileUpdateSchema,
  socialLinkCreateSchema,
} from "../validators/schemas.js";

type ProfileCreate = z.infer<typeof profileCreateSchema>;
type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
type EducationInput = z.infer<typeof educationInputSchema>;
type SocialLinkCreate = z.infer<typeof socialLinkCreateSchema>;

export const profileService = {
  async getPublic() {
    const profile = await prisma.profile.findFirst({
      include: {
        education: { orderBy: { sortOrder: "asc" } },
        socialLinks: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    });

    if (!profile) {
      return null;
    }

    const [featuredProjects, recentExperience] = await Promise.all([
      prisma.project.findMany({
        where: { featured: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 3,
        include: { caseStudy: false },
      }),
      prisma.experience.findMany({
        orderBy: [{ startDate: "desc" }],
        take: 3,
      }),
    ]);

    return {
      ...profile,
      projectsSummary: featuredProjects,
      experienceSummary: recentExperience,
    };
  },

  async getAdmin() {
    return prisma.profile.findFirst({
      include: {
        education: { orderBy: { sortOrder: "asc" } },
        socialLinks: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  async create(data: ProfileCreate) {
    const existing = await prisma.profile.findFirst();
    if (existing) {
      return prisma.profile.update({
        where: { id: existing.id },
        data,
        include: {
          education: true,
          socialLinks: true,
        },
      });
    }
    return prisma.profile.create({
      data,
      include: {
        education: true,
        socialLinks: true,
      },
    });
  },

  async update(id: string, data: ProfileUpdate) {
    await this.require(id);
    return prisma.profile.update({
      where: { id },
      data,
      include: {
        education: { orderBy: { sortOrder: "asc" } },
        socialLinks: { orderBy: { sortOrder: "asc" } },
      },
    });
  },

  async require(id: string) {
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundError("Profile");
    return profile;
  },
};

export const educationService = {
  async list(profileId?: string) {
    return prisma.education.findMany({
      where: profileId ? { profileId } : undefined,
      orderBy: { sortOrder: "asc" },
    });
  },

  async create(data: EducationInput) {
    await profileService.require(data.profileId);
    return prisma.education.create({ data });
  },

  async update(id: string, data: Partial<EducationInput>) {
    await this.require(id);
    return prisma.education.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.require(id);
    await prisma.education.delete({ where: { id } });
  },

  async require(id: string) {
    const row = await prisma.education.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Education");
    return row;
  },
};

export const socialLinkService = {
  async list() {
    return prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });
  },

  async create(data: SocialLinkCreate) {
    return prisma.socialLink.create({ data });
  },

  async update(id: string, data: Partial<SocialLinkCreate>) {
    await this.require(id);
    return prisma.socialLink.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.require(id);
    await prisma.socialLink.delete({ where: { id } });
  },

  async require(id: string) {
    const row = await prisma.socialLink.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Social link");
    return row;
  },
};
