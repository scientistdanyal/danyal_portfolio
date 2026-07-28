import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected ISO date YYYY-MM-DD")
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

const optionalDateString = dateString.optional().nullable();

/** Absolute http(s) URL or local upload path like /uploads/... */
const urlOrPath = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    { message: "Expected a URL or /uploads/... path" },
  );

/** Treat "" as null so optional path fields don't fail min(1) */
const optionalUrlOrPath = z.preprocess(
  (value) => (value === "" ? null : value),
  urlOrPath.optional().nullable(),
);

export const socialLinkInputSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  sortOrder: z.number().int().optional(),
});

export const educationInputSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  fieldOfStudy: z.string().optional().nullable(),
  startDate: dateString,
  endDate: optionalDateString,
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  profileId: z.string().min(1),
});

export const profileCreateSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  image: urlOrPath,
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  location: z.string().min(1),
  resumeUrl: optionalUrlOrPath,
});

export const profileUpdateSchema = profileCreateSchema.partial();

export const skillCategorySchema = z.object({
  name: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["language", "framework", "tool"]),
  proficiency: z.number().int().min(1).max(100),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  categoryId: z.string().min(1),
});

export const certificationSchema = z.object({
  certificationName: z.string().min(1),
  organization: z.string().min(1),
  dateCompleted: dateString,
  credentialUrl: optionalUrlOrPath,
  image: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export const caseStudySchema = z.object({
  overview: z.string().min(1),
  problemStatement: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  screenshots: z.array(z.string()).optional(),
  resultsImpact: z.string().optional().nullable(),
});

export const projectSchema = z.object({
  projectName: z.string().min(1),
  url: optionalUrlOrPath,
  tagline: z.string().min(1),
  client: z.string().optional().nullable(),
  coverImage: z.string().min(1),
  techStack: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  caseStudy: caseStudySchema.optional().nullable(),
});

export const experienceSchema = z.object({
  organizationName: z.string().min(1),
  roleTitle: z.string().min(1),
  contractType: z.enum([
    "full_time",
    "part_time",
    "contract",
    "freelance",
    "internship",
  ]),
  startDate: dateString,
  endDate: optionalDateString,
  location: z.string().optional().nullable(),
  techStack: z.array(z.string()).min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  impact: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export const codeBlockSchema = z.object({
  language: z.string().min(1),
  code: z.string().min(1),
});

/** Legacy field — prefer content blocks */
export const codeSectionSchema = z
  .array(codeBlockSchema)
  .optional()
  .nullable();

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().min(1),
    type: z.literal("paragraph"),
    text: z.string(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("image"),
    url: z.string().min(1),
    alt: z.string().optional(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("code"),
    language: z.string().min(1),
    code: z.string(),
  }),
]);

export const blogSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be URL-friendly"),
  abstract: z.string().min(1),
  summary: z.string().optional().default(""),
  content: z.array(contentBlockSchema).optional(),
  coverImage: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  codeSection: codeSectionSchema,
  tags: z.array(z.string()).optional(),
  publishedDate: dateString,
  readTime: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

export const contactSettingsSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  contactFormEnabled: z.boolean().optional(),
  formFields: z.array(z.string()).optional(),
  availabilityStatus: z.string().optional().nullable(),
});

export const contactSubmissionSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export const socialLinkCreateSchema = socialLinkInputSchema.extend({
  profileId: z.string().optional().nullable(),
  contactSettingsId: z.string().optional().nullable(),
});
