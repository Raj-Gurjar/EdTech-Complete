const SubSection_Model = require("../models/SubSection.model");
const Section_Model = require("../models/Section.model");
require("dotenv").config();

const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
    try {
        //get data
        const { sectionId, title, description, additionalUrl } = req.body;
        //get video file
        // const { video } = req.files.videoFile;

        //validate
        if (
            !sectionId ||
            !title ||
            // !timeDuration ||
            !description
            // !additionalUrl
            // !video
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the Fields.",
            });
        }

        //upload video to cloudinary
        // const uploadVideo = await uploadImageToCloudinary(
        //     video,
        //     process.env.FOLDER_NAME
        // );

        //insert in subsection db
        const subSectionDetails = await SubSection_Model.create({
            title: title,
            // timeDuration: timeDuration,
            description: description,
            // videoUrl: uploadVideo.secure_url,
        });

        //insert subsection id in section db
        const updatedSection = await Section_Model.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSections: subSectionDetails._id,
                },
            },
            {
                new: true,
            }
        )
            .populate("subSections")
            .exec();
        //TODO: H.W> populate section here ⬆️

        //return
        return res.status(200).json({
            success: true,
            message: "Subsection created Successfully.",
            data:updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in creating the Subsection",
        });
    }
};

//TODO these 2 controllers are H.W. 👇
exports.updateSubSection = async (req, res) => {
    try {
        //get data
        const {
            sectionId,
            title,
            description,
            // additionalUrl,
        } = req.body;
        //get video file
        // const { video } = req.files.videoFile;

        //update subsection
        const subSection = await SubSection_Model.findById(sectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }
        if (title !== undefined) {
            subSection.title = title;
        }
        if (description !== undefined) {
            subSection.description = description;
        }

        // if (req.files && req.files.video !== undefined) {
        //     const video = req.files.video;
        //     const uploadDetails = await uploadImageToCloudinary(
        //         video,
        //         process.env.FOLDER_NAME_CLOUDINARY
        //     );
        //     subSection.videoUrl = uploadDetails.secure_url;
        //     subSection.timeDuration = uploadDetails.duration;
        // }
        await subSection.save();

        const updatedSubSection =
            await Section_Model.findById(sectionId).populate("subSection");

        //return
        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully.",
            data: updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating subsection",
        });
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        //get the id
        const { subSectionId, sectionId } = req.body;

        //delete it from section
        await Section_Model.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        );

        const deletedSubSection = await SubSection_Model.findByIdAndDelete({
            _id: subSectionId,
        });

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        const updatedSubSection =
            await Section_Model.findById(sectionId).populate("subSection");
        //return
        return res.status(200).json({
            success: true,
            message: "Subsection Deleted Successfully",
            data: updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in deleting Subsection",
        });
    }
};
