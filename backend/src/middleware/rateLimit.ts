import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const skipInTest = (): boolean => env.NODE_ENV === "test";

/** General public API limit — per IP */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProd ? 300 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    error: "Too many requests, please try again later.",
  },
});

/** Stricter limit for contact form spam */
export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.isProd ? 5 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    error: "Too many contact submissions from this IP. Try again later.",
  },
});

/** Stricter limit for admin login / auth attempts (Step 5) */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProd ? 10 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    error: "Too many authentication attempts. Try again later.",
  },
});

/** Admin mutating routes — moderate abuse protection */
export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProd ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTest,
  message: {
    error: "Too many admin requests. Try again later.",
  },
});
