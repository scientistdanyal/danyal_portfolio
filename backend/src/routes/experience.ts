import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { experienceController } from "../controllers/experienceController.js";
import { experienceSchema, idParamSchema } from "../validators/schemas.js";

export const publicExperienceRouter = Router();
publicExperienceRouter.get("/", asyncHandler(experienceController.list));
publicExperienceRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(experienceController.getById),
);

export const adminExperienceRouter = Router();
adminExperienceRouter.get("/", asyncHandler(experienceController.list));
adminExperienceRouter.post(
  "/",
  validate(experienceSchema),
  asyncHandler(experienceController.create),
);
adminExperienceRouter.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(experienceSchema.partial()),
  asyncHandler(experienceController.update),
);
adminExperienceRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(experienceController.remove),
);
