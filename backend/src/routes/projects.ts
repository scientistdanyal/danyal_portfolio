import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { projectController } from "../controllers/projectController.js";
import { idParamSchema, projectSchema } from "../validators/schemas.js";

export const publicProjectsRouter = Router();
publicProjectsRouter.get("/", asyncHandler(projectController.list));
publicProjectsRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(projectController.getById),
);

export const adminProjectsRouter = Router();
adminProjectsRouter.get("/", asyncHandler(projectController.list));
adminProjectsRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(projectController.getById),
);
adminProjectsRouter.post(
  "/",
  validate(projectSchema),
  asyncHandler(projectController.create),
);
adminProjectsRouter.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(projectSchema.partial()),
  asyncHandler(projectController.update),
);
adminProjectsRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(projectController.remove),
);
