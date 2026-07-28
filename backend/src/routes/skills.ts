import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { skillController } from "../controllers/skillController.js";
import {
  idParamSchema,
  skillCategorySchema,
  skillSchema,
} from "../validators/schemas.js";

export const publicSkillsRouter = Router();
publicSkillsRouter.get("/", asyncHandler(skillController.listPublic));

export const adminSkillsRouter = Router();
adminSkillsRouter.get("/", asyncHandler(skillController.listPublic));
adminSkillsRouter.post(
  "/categories",
  validate(skillCategorySchema),
  asyncHandler(skillController.createCategory),
);
adminSkillsRouter.patch(
  "/categories/:id",
  validate(idParamSchema, "params"),
  validate(skillCategorySchema.partial()),
  asyncHandler(skillController.updateCategory),
);
adminSkillsRouter.delete(
  "/categories/:id",
  validate(idParamSchema, "params"),
  asyncHandler(skillController.removeCategory),
);
adminSkillsRouter.post(
  "/",
  validate(skillSchema),
  asyncHandler(skillController.createSkill),
);
adminSkillsRouter.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(skillSchema.partial()),
  asyncHandler(skillController.updateSkill),
);
adminSkillsRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(skillController.removeSkill),
);
