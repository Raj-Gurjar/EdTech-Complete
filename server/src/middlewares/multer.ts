import multer from "multer";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Use memory storage for serverless environments (Vercel), disk storage for local
// Check for Vercel environment variable first, then fallback to production check
const isServerless = process.env.VERCEL === "1" || (process.env.NODE_ENV === "production" && !process.env.ALLOW_DISK_STORAGE);

const storage = isServerless 
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
            const tempDir = path.join(process.cwd(), "public", "temp");
            // Ensure temp directory exists
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            cb(null, tempDir);
        },
        filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
            const uniqueSuffix = Date.now();
            cb(null, uniqueSuffix + "-" + file.originalname);
        },
    });

// File size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images (thumbnails, profile images)
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB for videos (lecture videos)

// Error handler for file size limits
export const fileSizeErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            const fieldName = err.field || "";
            const isImage = fieldName === "thumbnail" || fieldName === "profileImage";
            res.status(400).json({
                success: false,
                message: `File size exceeds the maximum allowed limit. ${isImage ? "Maximum size for images is 5MB." : "Maximum size for videos is 100MB."}`,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`,
        });
        return;
    }
    
    // Handle file type errors
    if (err.message === "Only image files are allowed" || err.message === "Only video files are allowed") {
        res.status(400).json({
            success: false,
            message: err.message,
        });
        return;
    }
    
    next(err);
};

// Multer configuration for images (thumbnails, profile images)
export const imageUpload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_IMAGE_SIZE,
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // Check if file is an image
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

// Multer configuration for videos (lecture videos)
export const videoUpload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_VIDEO_SIZE,
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // Check if file is a video
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed"));
        }
    },
});

// General file upload (for backward compatibility, defaults to image limits)
export const fileUpload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_IMAGE_SIZE,
    },
});

