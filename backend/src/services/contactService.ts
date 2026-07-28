import { prisma } from "../lib/prisma.js";
import { AppError, NotFoundError } from "../lib/errors.js";
import { sanitizeOptionalText, sanitizeText } from "../lib/sanitize.js";
import type { z } from "zod";
import type {
  contactSettingsSchema,
  contactSubmissionSchema,
} from "../validators/schemas.js";

type ContactSettingsInput = z.infer<typeof contactSettingsSchema>;
type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

export const contactService = {
  async getSettings() {
    return prisma.contactSettings.findFirst({
      include: {
        socialLinks: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  async upsertSettings(data: ContactSettingsInput) {
    const cleaned: ContactSettingsInput = {
      ...data,
      email: sanitizeText(data.email),
      phone: sanitizeOptionalText(data.phone) ?? null,
      location: sanitizeOptionalText(data.location) ?? null,
      availabilityStatus:
        sanitizeOptionalText(data.availabilityStatus) ?? null,
    };

    const existing = await prisma.contactSettings.findFirst();
    if (existing) {
      return prisma.contactSettings.update({
        where: { id: existing.id },
        data: cleaned,
        include: { socialLinks: true },
      });
    }
    return prisma.contactSettings.create({
      data: cleaned,
      include: { socialLinks: true },
    });
  },

  async submit(data: ContactSubmissionInput) {
    const settings = await prisma.contactSettings.findFirst();
    if (settings && !settings.contactFormEnabled) {
      throw new AppError(403, "Contact form is currently disabled");
    }

    return prisma.contactSubmission.create({
      data: {
        name: sanitizeText(data.name),
        email: sanitizeText(data.email),
        message: sanitizeText(data.message),
      },
    });
  },

  async listSubmissions() {
    return prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async markSubmissionRead(id: string, read = true) {
    await this.requireSubmission(id);
    return prisma.contactSubmission.update({
      where: { id },
      data: { read },
    });
  },

  async removeSubmission(id: string) {
    await this.requireSubmission(id);
    await prisma.contactSubmission.delete({ where: { id } });
  },

  async requireSubmission(id: string) {
    const row = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Contact submission");
    return row;
  },
};
