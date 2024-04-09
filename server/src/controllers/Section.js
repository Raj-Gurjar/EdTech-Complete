const Section_Model = require("../models/Section.model");
const Course_Model = require("../models/Course.model");

exports.createSection = async (req, res) => {
    try {
        //get the data
        const { sectionName, courseId } = req.body;

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
            updatedCourseDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in creating section",
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        //*get data

        const { sectionName, sectionId } = req.body;

        //validation
        if (!sectionName || !sectionId) {
            return res.status(401).json({
                success: false,
                message: "Data not found.",
            });
        }
        //section db update
        const updateSectionData = await Section_Model.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        //return

        return res.status(200).json({
            success: false,
            message: "Section Updated Successfully.",
            updateSectionData,
        });
    } catch (error) {
        console.log("Error in updating course controller", error);
        return res.status(500).json({
            success: false,
            message: "Error in updating Section Data",
        });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        //get data
        const { sectionId } = req.params;

        // delete from db
        const deletedSection = await Section_Model.findByIdAndDelete(sectionId);
        //TODO:Do we need to delete the section from course data also?
        //return
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully.",
            deletedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Deleting Section",
        });
    }
};
