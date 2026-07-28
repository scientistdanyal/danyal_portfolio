import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { contactRateLimiter } from "../middleware/rateLimit.js";
import { contactController } from "../controllers/contactController.js";
import {
  contactSettingsSchema,
  contactSubmissionSchema,
  idParamSchema,
} from "../validators/schemas.js";

export const publicContactRouter = Router();
publicContactRouter.get("/", asyncHandler(contactController.getSettings));
publicContactRouter.post(
  "/",
  contactRateLimiter,
  validate(contactSubmissionSchema),
  asyncHandler(contactController.submit),
);

export const adminContactRouter = Router();
adminContactRouter.get("/settings", asyncHandler(contactController.getSettings));
adminContactRouter.put(
  "/settings",
  validate(contactSettingsSchema),
  asyncHandler(contactController.upsertSettings),
);
adminContactRouter.get(
  "/submissions",
  asyncHandler(contactController.listSubmissions),
);
adminContactRouter.patch(
  "/submissions/:id",
  validate(idParamSchema, "params"),
  validate(z.object({ read: z.boolean().optional() })),
  asyncHandler(contactController.markRead),
);
adminContactRouter.delete(
  "/submissions/:id",
  validate(idParamSchema, "params"),
  asyncHandler(contactController.removeSubmission),
);
