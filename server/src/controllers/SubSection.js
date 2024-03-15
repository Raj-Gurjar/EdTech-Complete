const SubSection_Model = require("../models/SubSection.model");
const Section_Model = require("../models/Section.model");
require("dotenv").config();

const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubsection = async (req, res) => {
    try {
        //get data
        const { sectionId, title, timeDuration, description, additionalUrl } =
            req.body;
        //get video file
        const { video } = req.files.videoFile;

        //validate
        if (
            !sectionId ||
            !title ||
            !timeDuration ||
            !description ||
            !additionalUrl ||
            !video
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the Fields.",
            });
        }

        //upload video to cloudinary
        const uploadVideo = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        );

        //insert in subsection db
        const subSectionDetails = await SubSection_Model.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadVideo.secure_url,
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
            updatedSection,
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
            subSectionId,
            title,
            timeDuration,
            description,
            additionalUrl,
        } = req.body;
        //get video file
        const { video } = req.files.videoFile;

        //validate
        if (
            !subSectionId ||
            !title ||
            !timeDuration ||
            !description ||
            !additionalUrl ||
            !video
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the Fields.",
            });
        }

        //update subsection
        const updateSubSection = await SubSection_Model.findByIdAndUpdate(
            subSectionId,
            {
                title: title,
                timeDuration: timeDuration,
                description: description,
                additionalUrl: additionalUrl,
                videoUrl: uploadVideo.secure_url,
            },
            { new: true }
        );

        //return
        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully.",
            updateSubSection,
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
        const { subSectionId } = req.params;

        //delete it
        const deletedSubSection =
            await SubSection_Model.findByIdAndDelete(subSectionId);

        //return
        return res.status(200).json({
            success: true,
            message: "Subsection Deleted Successfully",
            deletedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in deleting Subsection",
        });
    }
};
