import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { blogController } from "../controllers/blogController.js";
import {
  blogSchema,
  idParamSchema,
  slugParamSchema,
} from "../validators/schemas.js";

export const publicBlogsRouter = Router();
publicBlogsRouter.get("/", asyncHandler(blogController.listPublic));
publicBlogsRouter.get(
  "/:slug",
  validate(slugParamSchema, "params"),
  asyncHandler(blogController.getBySlug),
);

export const adminBlogsRouter = Router();
adminBlogsRouter.get("/", asyncHandler(blogController.listAdmin));
adminBlogsRouter.get(
  "/by-id/:id",
  validate(idParamSchema, "params"),
  asyncHandler(blogController.getById),
);
adminBlogsRouter.post(
  "/",
  validate(blogSchema),
  asyncHandler(blogController.create),
);
adminBlogsRouter.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(blogSchema.partial()),
  asyncHandler(blogController.update),
);
adminBlogsRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(blogController.remove),
);
