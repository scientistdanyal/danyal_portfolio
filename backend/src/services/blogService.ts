import { prisma } from "../lib/prisma.js";
import { NotFoundError, AppError } from "../lib/errors.js";
import { sanitizeOptionalText, sanitizeText } from "../lib/sanitize.js";
import type { z } from "zod";
import type {
  blogSchema,
  contentBlockSchema,
} from "../validators/schemas.js";
import { Prisma } from "../generated/prisma/client.js";

type BlogInput = z.infer<typeof blogSchema>;
type ContentBlock = z.infer<typeof contentBlockSchema>;

function sanitizeBlogInput<T extends Partial<BlogInput>>(data: T): T {
  return {
    ...data,
    title: data.title === undefined ? undefined : sanitizeText(data.title),
    abstract:
      data.abstract === undefined ? undefined : sanitizeText(data.abstract),
    summary:
      data.summary === undefined ? undefined : sanitizeText(data.summary),
    category: sanitizeOptionalText(data.category) as T["category"],
    readTime: sanitizeOptionalText(data.readTime) as T["readTime"],
    tags: data.tags?.map(sanitizeText),
  };
}

function toCodeSectionInput(
  codeSection: BlogInput["codeSection"] | undefined,
): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (codeSection === undefined) return undefined;
  if (codeSection === null) return Prisma.JsonNull;
  if (codeSection.length === 0) return Prisma.JsonNull;
  return codeSection.map((block) => ({
    language: sanitizeText(block.language),
    code: block.code,
  }));
}

export function normalizeCodeSections(value: unknown): {
  language: string;
  code: string;
}[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is { language: string; code: string } =>
        typeof item === "object" &&
        item !== null &&
        "language" in item &&
        "code" in item &&
        typeof (item as { language: unknown }).language === "string" &&
        typeof (item as { code: unknown }).code === "string",
    );
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "language" in value &&
    "code" in value
  ) {
    const block = value as { language: unknown; code: unknown };
    if (typeof block.language === "string" && typeof block.code === "string") {
      return [{ language: block.language, code: block.code }];
    }
  }
  return [];
}

function isContentBlock(value: unknown): value is ContentBlock {
  if (!value || typeof value !== "object") return false;
  const block = value as { type?: unknown; id?: unknown };
  if (typeof block.id !== "string" || typeof block.type !== "string") {
    return false;
  }
  if (block.type === "paragraph") {
    return typeof (value as { text?: unknown }).text === "string";
  }
  if (block.type === "image") {
    return typeof (value as { url?: unknown }).url === "string";
  }
  if (block.type === "code") {
    return (
      typeof (value as { language?: unknown }).language === "string" &&
      typeof (value as { code?: unknown }).code === "string"
    );
  }
  return false;
}

export function normalizeContent(
  value: unknown,
  fallbackSummary = "",
  legacyImages: string[] = [],
  legacyCode: unknown = null,
): ContentBlock[] {
  if (Array.isArray(value) && value.length > 0) {
    return value.filter(isContentBlock);
  }

  const blocks: ContentBlock[] = [];
  if (fallbackSummary.trim()) {
    blocks.push({
      id: "legacy-summary",
      type: "paragraph",
      text: fallbackSummary,
    });
  }
  for (const [index, url] of legacyImages.entries()) {
    blocks.push({
      id: `legacy-image-${index}`,
      type: "image",
      url,
    });
  }
  for (const [index, code] of normalizeCodeSections(legacyCode).entries()) {
    blocks.push({
      id: `legacy-code-${index}`,
      type: "code",
      language: code.language,
      code: code.code,
    });
  }
  if (blocks.length === 0) {
    blocks.push({ id: "empty-1", type: "paragraph", text: "" });
  }
  return blocks;
}

function sanitizeContent(
  content: ContentBlock[] | undefined,
): Prisma.InputJsonValue | undefined {
  if (content === undefined) return undefined;
  return content.map((block) => {
    if (block.type === "paragraph") {
      return { ...block, text: block.text };
    }
    if (block.type === "image") {
      return {
        ...block,
        url: sanitizeText(block.url),
        alt: block.alt ? sanitizeText(block.alt) : undefined,
      };
    }
    return {
      ...block,
      language: sanitizeText(block.language),
      code: block.code,
    };
  });
}

function summaryFromContent(content: ContentBlock[] | undefined): string {
  if (!content) return "";
  return content
    .filter((b) => b.type === "paragraph")
    .map((b) => (b.type === "paragraph" ? b.text : ""))
    .join("\n\n")
    .trim();
}

function imagesFromContent(content: ContentBlock[] | undefined): string[] {
  if (!content) return [];
  return content
    .filter((b): b is Extract<ContentBlock, { type: "image" }> => b.type === "image")
    .map((b) => b.url);
}

function codeFromContent(content: ContentBlock[] | undefined) {
  if (!content) return null;
  const codes = content
    .filter((b): b is Extract<ContentBlock, { type: "code" }> => b.type === "code")
    .map((b) => ({ language: b.language, code: b.code }));
  return codes.length > 0 ? codes : null;
}

function shapeBlog<T extends {
  content: unknown;
  summary: string;
  images: string[];
  codeSection: unknown;
}>(blog: T) {
  const content = normalizeContent(
    blog.content,
    blog.summary,
    blog.images,
    blog.codeSection,
  );
  return {
    ...blog,
    content,
    codeSection: normalizeCodeSections(blog.codeSection),
  };
}

export const blogService = {
  async listPublic() {
    return prisma.blog.findMany({
      where: { published: true },
      orderBy: { publishedDate: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        abstract: true,
        coverImage: true,
        tags: true,
        publishedDate: true,
        readTime: true,
        category: true,
      },
    });
  },

  async getBySlug(slug: string, publishedOnly = true) {
    const blog = await prisma.blog.findFirst({
      where: publishedOnly ? { slug, published: true } : { slug },
    });
    if (!blog) throw new NotFoundError("Blog");
    return shapeBlog(blog);
  },

  async getById(id: string) {
    const blog = await this.require(id);
    return shapeBlog(blog);
  },

  async listAdmin() {
    const blogs = await prisma.blog.findMany({
      orderBy: { publishedDate: "desc" },
    });
    return blogs.map(shapeBlog);
  },

  async create(data: BlogInput) {
    const cleaned = sanitizeBlogInput(data);
    const content = cleaned.content ?? [
      { id: "p1", type: "paragraph" as const, text: cleaned.summary ?? "" },
    ];
    try {
      const derivedCode = codeFromContent(content);
      const blog = await prisma.blog.create({
        data: {
          ...cleaned,
          content: sanitizeContent(content),
          summary: cleaned.summary || summaryFromContent(content),
          images: cleaned.images ?? imagesFromContent(content),
          codeSection:
            toCodeSectionInput(cleaned.codeSection) ??
            derivedCode ??
            Prisma.JsonNull,
        },
      });
      return shapeBlog(blog);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new AppError(409, "Blog slug already exists");
      }
      throw error;
    }
  },

  async update(id: string, data: Partial<BlogInput>) {
    await this.require(id);
    const cleaned = sanitizeBlogInput(data);
    try {
      let codeSection:
        | Prisma.InputJsonValue
        | typeof Prisma.JsonNull
        | undefined;

      if (cleaned.codeSection !== undefined) {
        codeSection = toCodeSectionInput(cleaned.codeSection);
      } else if (cleaned.content) {
        codeSection = codeFromContent(cleaned.content) ?? Prisma.JsonNull;
      }

      const blog = await prisma.blog.update({
        where: { id },
        data: {
          ...cleaned,
          content: sanitizeContent(cleaned.content),
          summary:
            cleaned.summary !== undefined
              ? cleaned.summary
              : cleaned.content
                ? summaryFromContent(cleaned.content)
                : undefined,
          images:
            cleaned.images ??
            (cleaned.content ? imagesFromContent(cleaned.content) : undefined),
          codeSection,
        },
      });
      return shapeBlog(blog);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new AppError(409, "Blog slug already exists");
      }
      throw error;
    }
  },

  async remove(id: string) {
    await this.require(id);
    await prisma.blog.delete({ where: { id } });
  },

  async require(id: string) {
    const row = await prisma.blog.findUnique({ where: { id } });
    if (!row) throw new NotFoundError("Blog");
    return row;
  },
};
