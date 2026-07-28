import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  ALLOWED_ORIGINS: z.string().optional(),
  JWT_SECRET: z.string().min(16).default("change-me-in-production-min-16"),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  /** Temporary admin gate until JWT auth (Step 5) */
  ADMIN_API_KEY: z.string().min(16).optional(),
  TRUST_PROXY: z
    .enum(["true", "false", "1", "0"])
    .optional()
    .transform((v) => v === "true" || v === "1"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten());
  throw new Error("Invalid environment configuration");
}

const data = parsed.data;

function buildAllowedOrigins(): string[] {
  const fromList = (data.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaults = [
    data.FRONTEND_ORIGIN,
    "http://localhost:3000",
    "https://engineerdanyal.com",
    "https://www.engineerdanyal.com",
  ];

  return [...new Set([...defaults, ...fromList])];
}

export const env = {
  ...data,
  isProd: data.NODE_ENV === "production",
  isDev: data.NODE_ENV === "development",
  allowedOrigins: buildAllowedOrigins(),
};
