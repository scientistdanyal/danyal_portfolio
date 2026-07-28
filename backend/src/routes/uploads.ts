import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { AppError } from "../lib/errors.js";
import { profileService } from "../services/profileService.js";
import { prisma } from "../lib/prisma.js";

const uploadsRoot = path.resolve(process.cwd(), "uploads");
const resumeDir = path.join(uploadsRoot, "resume");
const imageDir = path.join(uploadsRoot, "images");

fs.mkdirSync(resumeDir, { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });

function handleMulter(
  upload: ReturnType<typeof multer>,
  field: string,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    upload.single(field)(req, res, (err: unknown) => {
      if (err instanceof AppError) {
        next(err);
        return;
      }
      if (err) {
        next(
          new AppError(
            400,
            err instanceof Error ? err.message : "Upload failed",
          ),
        );
        return;
      }
      next();
    });
  };
}

const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, resumeDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".pdf";
      cb(null, `resume${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.mimetype)) {
      cb(new AppError(400, "Resume must be PDF or Word document"));
      return;
    }
    cb(null, true);
  },
});

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, imageDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      cb(null, safe);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowed.includes(file.mimetype)) {
      cb(new AppError(400, "Image must be JPEG, PNG, WebP, or GIF"));
      return;
    }
    cb(null, true);
  },
});

export const uploadController = {
  async uploadResume(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError(400, "Resume file is required");
    }

    const resumeUrl = `/uploads/resume/${req.file.filename}`;
    const profile = await profileService.getAdmin();

    if (!profile) {
      throw new AppError(400, "Create a profile before uploading a resume");
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: { resumeUrl },
    });

    res.json({ data: { resumeUrl: updated.resumeUrl, profile: updated } });
  },

  async uploadImage(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError(400, "Image file is required");
    }
    const url = `/uploads/images/${req.file.filename}`;
    res.status(201).json({ data: { url } });
  },

  async uploadProfileImage(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError(400, "Profile image is required");
    }

    const image = `/uploads/images/${req.file.filename}`;
    const profile = await profileService.getAdmin();
    if (!profile) {
      throw new AppError(400, "Create a profile before uploading a photo");
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: { image },
    });

    res.json({ data: { image: updated.image, profile: updated } });
  },
};

export const adminUploadRouter = Router();
adminUploadRouter.post(
  "/resume",
  handleMulter(resumeUpload, "resume"),
  asyncHandler(uploadController.uploadResume),
);
adminUploadRouter.post(
  "/image",
  handleMulter(imageUpload, "image"),
  asyncHandler(uploadController.uploadImage),
);
adminUploadRouter.post(
  "/profile-image",
  handleMulter(imageUpload, "image"),
  asyncHandler(uploadController.uploadProfileImage),
);
