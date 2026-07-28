import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { certificationController } from "../controllers/certificationController.js";
import {
  certificationSchema,
  idParamSchema,
} from "../validators/schemas.js";

export const publicCertificationsRouter = Router();
publicCertificationsRouter.get("/", asyncHandler(certificationController.list));
publicCertificationsRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(certificationController.getById),
);

export const adminCertificationsRouter = Router();
adminCertificationsRouter.get("/", asyncHandler(certificationController.list));
adminCertificationsRouter.post(
  "/",
  validate(certificationSchema),
  asyncHandler(certificationController.create),
);
adminCertificationsRouter.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(certificationSchema.partial()),
  asyncHandler(certificationController.update),
);
adminCertificationsRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  asyncHandler(certificationController.remove),
);
