import { Request, Response } from "express";
const CourseProgress_Model = require("../models/CourseProgress.model");
const SubSection_Model = require("../models/SubSection.model");

interface AuthRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

export const updateCourseProgress = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user?.id;

    try {
        const subSection = await SubSection_Model.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "Invalid Sub-Section",
            });
        }

        //check for old entry

        let courseProgress = await CourseProgress_Model.findOne({
            courseID: courseId,
            userId: userId,
        });
        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course Progress Does not exist",
            });
        } else {
            //check for re-completing video/subsection
            if (courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(400).json({
                    success: false,
                    message: "SubSection already completed",
                });
            }

            //push into completed video

            courseProgress.completedVideos.push(subSectionId);
        }

        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Lecture Marked as Completed Successfully.",
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error in updateCourse Progress",
        });
    }
};

