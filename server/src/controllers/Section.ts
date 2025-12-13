import { Request, Response } from "express";
const Section_Model = require("../models/Section.model");
const Course_Model = require("../models/Course.model");
const SubSection_Model = require("../models/SubSection.model");

export const createSection = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        //get the data
        const {
            sectionName,
            courseId,
        } = req.body;

        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Some Input Data is Missing",
            });
        }

        //create section
        const newSection = await Section_Model.create({ sectionName });

        //update course with section obj

        const updatedCourseDetails = await Course_Model.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true }
        )
            .populate("courseContent")
            .exec();

        //TODO: use populate to replace section as well as subsection in updatedCourseDetails

        //return res
        return res.status(200).json({
            success: true,
            message: "New Section Created Successfully",
            data: updatedCourseDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in creating section",
        });
    }
};

export const updateSection = async (req: Request, res: Response): Promise<Response | void> => {
    console.log("Going inside update section");
    try {
        //*get data

        const { sectionName, sectionId, courseId } = req.body;

        console.log("sec update ", req.body);

        //section db update
        const updateSectionData = await Section_Model.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        const updatedCourse = await Course_Model.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections",
                },
            })
            .exec();

        //return

        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully.",
            data: updatedCourse,
        });
    } catch (error) {
        console.log("Error in updating section controller", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating Section Data",
        });
    }
};

export const deleteSection = async (req: Request, res: Response): Promise<Response | void> => {
    console.log("Entering in delete section controller");
    try {
        //get data
        const { sectionId, courseId } = req.body;
        console.log("section ID:", sectionId, ", courseId: ", courseId);
        // delete from db

        //remove section form course and update it
        await Course_Model.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            },
        });

        const section = await Section_Model.findById(sectionId);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        //delete all first subsections
        await SubSection_Model.deleteMany({
            _id: { $in: section.subSections },
        });

        await Section_Model.findByIdAndDelete(sectionId);

        //find the updated course and return
        const updatedCourse = await Course_Model.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections",
                },
            })
            .exec();

        console.log(" Sec controller deleted Successfully");
        //return
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully.",
            data: updatedCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Deleting Section",
        });
    }
};

export const sectionById = async (req: Request, res: Response): Promise<Response | void> => {
    console.log("Section Details");
    try {
        const sectionId = req.body.id;

        const sectionDetails = await Section_Model.findById(sectionId)
            .populate("subSections")
            .exec();
        // console.log("course details", courseDetails);
        //valid
        if (!sectionDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the Section with ${sectionId}`,
            });
        }
        // console.log("Course Details:", courseDetails);
        //return
        return res.status(200).json({
            success: true,
            message: "Section Data fetched Successfully.",
            data: sectionDetails,
        });
    } catch (error) {
        console.log("Error in fetching section details", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching this section data.",
        });
    }
};

