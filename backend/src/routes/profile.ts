import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  educationController,
  profileController,
  socialLinkController,
} from "../controllers/profileController.js";
import {
  educationInputSchema,
  idParamSchema,
  profileCreateSchema,
  profileUpdateSchema,
  socialLinkCreateSchema,
} from "../validators/schemas.js";

export const publicProfileRouter = Router();
publicProfileRouter.get("/", asyncHandler(profileController.getPublic));

export const adminProfileRouter = Router();
adminProfileRouter.get("/", asyncHandler(profileController.getAdmin));
adminProfileRouter.post(
  "/",
  validate(profileCreateSchema),
  asyncHandler(profileController.create),
);
adminProfileRouter.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(profileUpdateSchema),
  asyncHandler(profileController.update),
);

export const adminEducationRouter = Router();
adminEducationRouter.get("/", asyncHandler(educationController.list));
adminEducationRouter.post(
  "/",
  validate(educationInputSchema),
  asyncHandler(educationController.create),
);
adminEducationRouter.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(educationInputSchema.partial()),
  asyncHandler(educationController.update),
);
adminEducationRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(educationController.remove),
);

export const adminSocialLinkRouter = Router();
adminSocialLinkRouter.get("/", asyncHandler(socialLinkController.list));
adminSocialLinkRouter.post(
  "/",
  validate(socialLinkCreateSchema),
  asyncHandler(socialLinkController.create),
);
adminSocialLinkRouter.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(socialLinkCreateSchema.partial()),
  asyncHandler(socialLinkController.update),
);
adminSocialLinkRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(socialLinkController.remove),
);
