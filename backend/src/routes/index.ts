import { Router } from "express";
import { healthRouter } from "./health.js";
import {
  adminEducationRouter,
  adminProfileRouter,
  adminSocialLinkRouter,
  publicProfileRouter,
} from "./profile.js";
import { adminSkillsRouter, publicSkillsRouter } from "./skills.js";
import {
  adminCertificationsRouter,
  publicCertificationsRouter,
} from "./certifications.js";
import { adminProjectsRouter, publicProjectsRouter } from "./projects.js";
import {
  adminExperienceRouter,
  publicExperienceRouter,
} from "./experience.js";
import { adminBlogsRouter, publicBlogsRouter } from "./blogs.js";
import { adminContactRouter, publicContactRouter } from "./contact.js";
import { authRouter } from "./auth.js";
import { adminUploadRouter } from "./uploads.js";

export const publicApiRouter = Router();
publicApiRouter.use("/health", healthRouter);
publicApiRouter.use("/auth", authRouter);
publicApiRouter.use("/profile", publicProfileRouter);
publicApiRouter.use("/skills", publicSkillsRouter);
publicApiRouter.use("/certifications", publicCertificationsRouter);
publicApiRouter.use("/projects", publicProjectsRouter);
publicApiRouter.use("/experience", publicExperienceRouter);
publicApiRouter.use("/blogs", publicBlogsRouter);
publicApiRouter.use("/contact", publicContactRouter);

/** Admin CRUD — auth middleware added in Step 5 */
export const adminApiRouter = Router();
adminApiRouter.use("/profile", adminProfileRouter);
adminApiRouter.use("/education", adminEducationRouter);
adminApiRouter.use("/social-links", adminSocialLinkRouter);
adminApiRouter.use("/skills", adminSkillsRouter);
adminApiRouter.use("/certifications", adminCertificationsRouter);
adminApiRouter.use("/projects", adminProjectsRouter);
adminApiRouter.use("/experience", adminExperienceRouter);
adminApiRouter.use("/blogs", adminBlogsRouter);
adminApiRouter.use("/contact", adminContactRouter);
adminApiRouter.use("/uploads", adminUploadRouter);
