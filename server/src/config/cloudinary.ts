import cloudinary from "cloudinary";
import fs from "fs";
import "dotenv/config";

// Configure cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadOptions {
    folder: string;
    height?: number;
    quality?: number | string;
    resource_type?: "raw" | "auto" | "image" | "video";
}

interface UploadResponse {
    public_id: string;
    secure_url: string;
    url: string;
    [key: string]: any;
}

export const uploadToCloudinary = async (
    localFilePath: string | Buffer,
    folder: string,
    height?: number,
    quality?: number | string
): Promise<UploadResponse | null> => {
    try {
        if (!localFilePath) {
            console.error("Could not find the file's path or buffer");
            return null;
        }

        const options: UploadOptions = {
            folder,
            resource_type: "auto" as const,
        };

        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }

        // Handle both file path (local) and buffer (serverless)
        let uploadResponse: UploadResponse;
        if (Buffer.isBuffer(localFilePath)) {
            // Serverless environment - upload from buffer using data URI
            uploadResponse = await new Promise<UploadResponse>((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    options,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result as UploadResponse);
                        }
                    }
                );
                uploadStream.end(localFilePath);
            });
        } else {
            // Local environment - upload from file path
            uploadResponse = await cloudinary.v2.uploader.upload(
                localFilePath,
                options
            ) as UploadResponse;

            // Delete local file after upload
            if (fs.existsSync(localFilePath)) {
                try {
                    fs.unlinkSync(localFilePath);
                } catch (unlinkError) {
                    // Ignore unlink errors
                }
            }
        }

        return uploadResponse;
    } catch (error) {
        // Clean up file even if upload fails (only for file paths, not buffers)
        if (typeof localFilePath === 'string' && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (unlinkError) {
                // Ignore unlink errors
            }
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Cloudinary upload error:", errorMessage);
        return null;
    }
};

