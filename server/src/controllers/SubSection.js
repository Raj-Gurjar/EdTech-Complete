const SubSection_Model = require("../models/SubSection.model");
const Section_Model = require("../models/Section.model");
require("dotenv").config();

const { uploadToCloudinary } = require("../config/cloudinary");

exports.createSubSection = async (req, res) => {
    try {
        console.log("inside subSec");
        //get data
        const { sectionId, title, description } = req.body;
        //get video file

        console.log("req.body :", req.body);
        console.log("req.file :", req.file);
        const lectureVideoPath = req.file?.path;

        console.log("lec path ", lectureVideoPath);

        //validate
        if (
            !sectionId ||
            !title ||
            // !timeDuration ||
            !description ||
            // !additionalUrl
            !lectureVideoPath
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the Fields.",
            });
        }

        //upload video to cloudinary
        const uploadVideo = await uploadToCloudinary(
            lectureVideoPath,
            process.env.CLD_LECTURES_FOLDER
        );

        //insert in subsection db
        const subSectionDetails = await SubSection_Model.create({
            title: title,
            // timeDuration: timeDuration,
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
            data: updatedSection,
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
        console.log("entering update sub sec controller");
        const {
            sectionId,
            subSectionId,
            title,
            description,
            // additionalUrl,
        } = req.body;
        //get video file
        // const { video } = req.files.videoFile;
        console.log("sub sec controller body:", req.body);
        //update subsection
        const subSection = await SubSection_Model.findById(subSectionId);

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

        const updatedSubSection = await Section_Model.findById(sectionId)
            .populate("subSections")
            .exec();

        //return
        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully.",
            data: updatedSubSection,
        });
    } catch (error) {
        console.log("Error in updating sub-sec: ", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating subsection",
        });
    }
};

exports.deleteSubSection = async (req, res) => {
    console.log("inside delete sub sec controller");
    try {
        //get the id
        const { subSectionId, sectionId } = req.body;
        console.log(req.body);

        console.log("dcp1");
        //delete it from section
        await Section_Model.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSections: subSectionId,
                },
            }
        );
        console.log("dcp1");
        await SubSection_Model.findByIdAndDelete({
            _id: subSectionId,
        });
        console.log("dcp3");

        const updatedSection = await Section_Model.findById(sectionId)
            .populate("subSections")
            .exec();

        console.log("dcp4", updatedSection);
        //return
        return res.status(200).json({
            success: true,
            message: "Subsection Deleted Successfully",
            data: updatedSection,
        });
    } catch (error) {
        console.log("Error in delete sub-sec: ", error);
        return res.status(500).json({
            success: false,
            message: "Error in deleting Subsection",
        });
    }
};
