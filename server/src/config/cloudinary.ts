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
    localFilePath: string,
    folder: string,
    height?: number,
    quality?: number | string
): Promise<UploadResponse | null> => {
    try {
        console.log("inside cloudinary config");
        console.log("file", localFilePath);
        
        if (!localFilePath) {
            console.error("Could not find the file's path");
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

        const uploadResponse = await cloudinary.v2.uploader.upload(
            localFilePath,
            options
        ) as UploadResponse;

        console.log("file is uploaded on cloudinary");
        fs.unlinkSync(localFilePath); // delete from local path

        return uploadResponse;
    } catch (error) {
        // Clean up file even if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.log("cloudinary error :", errorMessage);
        return null;
    }
};

