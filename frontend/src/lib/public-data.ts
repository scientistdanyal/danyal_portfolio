import { api } from "./api";

export type Education = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type Project = {
  id: string;
  projectName: string;
  url?: string | null;
  tagline: string;
  client?: string | null;
  coverImage: string;
  techStack: string[];
  featured: boolean;
  caseStudy?: {
    overview: string;
    problemStatement?: string | null;
    solution?: string | null;
    role?: string | null;
    duration?: string | null;
    screenshots: string[];
    resultsImpact?: string | null;
  } | null;
};

export type Experience = {
  id: string;
  organizationName: string;
  roleTitle: string;
  contractType: string;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  techStack: string[];
  problem: string;
  solution: string;
  impact?: string | null;
  logo?: string | null;
};

export type Profile = {
  id: string;
  name: string;
  title: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  location: string;
  resumeUrl?: string | null;
  education: Education[];
  socialLinks: SocialLink[];
  projectsSummary: Project[];
  experienceSummary: Experience[];
};

export type Skill = {
  id: string;
  name: string;
  type: string;
  proficiency: number;
  icon?: string | null;
};

export type SkillCategory = {
  id: string;
  name: string;
  skills: Skill[];
};

export type Certification = {
  id: string;
  certificationName: string;
  organization: string;
  dateCompleted: string;
  credentialUrl?: string | null;
  image?: string | null;
};

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  coverImage?: string | null;
  tags: string[];
  publishedDate: string;
  readTime?: string | null;
  category?: string | null;
};

export type CodeBlock = {
  language: string;
  code: string;
};

export type ContentBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; alt?: string }
  | { id: string; type: "code"; language: string; code: string };

export type BlogPost = BlogListItem & {
  summary: string;
  content: ContentBlock[];
  images: string[];
  codeSection?: CodeBlock[] | null;
};

export type ContactSettings = {
  id: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  contactFormEnabled: boolean;
  formFields: string[];
  availabilityStatus?: string | null;
  socialLinks: SocialLink[];
};

async function safePublic<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const publicApi = {
  profile: () =>
    safePublic(() => api<Profile | null>("/api/profile", { public: true }), null),
  skills: () =>
    safePublic(
      () => api<SkillCategory[]>("/api/skills", { public: true }),
      [],
    ),
  certifications: () =>
    safePublic(
      () => api<Certification[]>("/api/certifications", { public: true }),
      [],
    ),
  projects: (featured?: boolean) =>
    safePublic(
      () =>
        api<Project[]>(
          featured === undefined
            ? "/api/projects"
            : `/api/projects?featured=${featured}`,
          { public: true },
        ),
      [],
    ),
  project: (id: string) =>
    api<Project>(`/api/projects/${id}`, { public: true }),
  experience: () =>
    safePublic(
      () => api<Experience[]>("/api/experience", { public: true }),
      [],
    ),
  blogs: () =>
    safePublic(
      () => api<BlogListItem[]>("/api/blogs", { public: true }),
      [],
    ),
  blog: (slug: string) =>
    api<BlogPost>(`/api/blogs/${slug}`, { public: true }),
  contact: () =>
    safePublic(
      () => api<ContactSettings | null>("/api/contact", { public: true }),
      null,
    ),
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function formatContract(type: string) {
  return type.replaceAll("_", "-");
}
