const CourseProgress_Model = require("../models/CourseProgress.model");
const SubSection_Model = require("../models/SubSection.model");

exports.updateCourseProgress = async (req, res) => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    try {
        console.log("c1");
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
        console.log("c2");
        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course Progress Does not exist",
            });
        } else {
            //check for re-completing video/subsection
            console.log("c3");
            if (courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(400).json({
                    success: false,
                    message: "SubSection already completed",
                });
            }
            console.log("c4");

            //push into completed video

            courseProgress.completedVideos.push(subSectionId);
            console.log("c5");
        }

        await courseProgress.save();
        console.log("c6");

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
