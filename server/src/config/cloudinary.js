const cloudinary = require("cloudinary").v2;
const { response } = require("express");
const fs = require("fs");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (localFilePath, folder, height, quality) => {
    try {
        console.log("inside cloudinary config");
        console.log("file", localFilePath);
        if (!localFilePath) {
            return res.status(404).json({
                success: false,
                message: "Could not find the file's path",
            });
        }
        console.log("c1");
        const options = { folder };

        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }
        options.resource_type = "auto";

        const uploadResponse = await cloudinary.uploader.upload(
            localFilePath,
            options
        );

        console.log("file is uploaded on cloudinary");
        fs.unlinkSync(localFilePath); //delete from local path

        // console.log("response :", uploadResponse);

        return uploadResponse;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("cloudinary error :", error);
        return null;
    }
};
