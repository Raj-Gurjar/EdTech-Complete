const cloudinary = require("cloudinary").v2;
const { response } = require("express");
const fs = require("fs");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (file, folder, height, quality) => {
    try {
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "Could not find the file's path",
            });
        }

        const options = { folder };

        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }
        options.resource_type = "auto";

        const uploadResponse = await cloudinary.uploader.upload(file, options);

        console.log("response :", response);

        return response;
    } catch (error) {
        fs.unlinkSync(file);
        console.log("cloudinary error :", error);
        return null;
    }
};
