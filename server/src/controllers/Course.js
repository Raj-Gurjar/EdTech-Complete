const Course_Model = require("../models/Course.model");
const Category_Model = require("../models/Category.model");
const User_Model = require("../models/User.model");
const CourseProgress_Model = require("../models/CourseProgress.model");

const { uploadImageToCloudinary } = require("../utils/imageUploader");

const SubSection_Model = require("../models/SubSection.model");

const Section_Model = require("../models/Section.model");
//! Create Course
exports.createCourse = async (req, res) => {
    try {
        //*get the data
        // console.log("entering createCourse");
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            language,
            category,
            // status,
            instructions,
            // tag
        } = req.body;
        let { status } = req.body;

        // const thumbnail = req.file.thumbnailImage;

        //* validation
        // console.log("course id" , category);
        // console.log("create course data fetched",req.body);
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !language ||
            !category
            // !tag ||
            // !thumbnail
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required!.",
            });
        }
        //get instructor data bcs instructor is in db
        if (!status || status === undefined) {
            status = "Draft";
        }
        // console.log("cp1");
        //TODO: check userID and instructorDetail are equal or not
        const userId = req.user.id;
        // console.log("usedId: ", userId);

        const instructorDetails = await User_Model.findById(userId, {
            accountType: "Instructor",
        });
        // console.log("Instructor details: ", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }
        //* Add course in that Category
        const categoryDetail = await Category_Model.findById(category);
        // console.log("category Details : ", categoryDetail);

        if (!categoryDetail) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        //* Upload thumbnail to cloudinary

        // const thumbnailImage = await uploadImageToCloudinary(
        //     thumbnail,
        //     process.env.FOLDER_NAME_CLOUDINARY
        // );

        //* Create course entry in db

        const newCourse = await Course_Model.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id, //to give reference to instructor obj
            whatYouWillLearn,
            // tag:tag,
            price,
            language,
            category: categoryDetail._id,
            status: status,
            instructions: instructions,
            // thumbnail: thumbnailImage.secure_url,
        });

        //* Add course in user schema of instructor
        await User_Model.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        //TODO: this was h.w.
        //* Add course in Category schema
        await Category_Model.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        //* return res
        console.log("newCourse create : ", newCourse);
        return res.status(200).json({
            success: true,
            message: "New Course Created Successfully.",
            newCourse,
        });
    } catch (error) {
        console.log("Error in creating course", error);
        return res.status(500).json({
            success: false,
            message: "Error in Creating Course.",
            // data:newCourse,
            error: error.message,
        });
    }
};

//! Get all Course
exports.getAllCourses = async (req, res) => {
    try {
        const allCourse = await Course_Model.find(
            { status: "Published" },
            {
                courseName: true,
                price: true,
                courseDescription: true,
                instructor: true,
                thumbnail: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }
        )
            .populate("instructor")
            .exec();

        //* return res
        return res.status(200).json({
            success: true,
            message: "Data of All Courses Fetched Successfully.",
            data: allCourse,
        });
    } catch (error) {
        console.log("Get course Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Error in getting all the Courses",
            error: error.message,
        });
    }
};

//! Get Course by Id
exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course_Model.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections",
                },
            })
            .exec();
        // console.log("course details", courseDetails);
        //valid
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the Course with ${courseId}`,
            });
        }
        // console.log("Course Details:", courseDetails);
        //return
        return res.status(200).json({
            success: true,
            message: "Course Data fetched Successfully.",
            data: courseDetails,
        });
    } catch (error) {
        console.log("Error in fetching course details", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching this course data.",
            error: error.message,
        });
    }
};

//!edit Course  (vid. 26, near 1:00hr)

exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;

        // console.log("entering edit controller", req.body);

        const course = await Course_Model.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not Found" });
        }

        //if thumbnail image is found update it
        if (req.files) {
            console.log("Thumbnail updated");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME_CLOUDINARY
            );
            course.thumbnail = thumbnailImage.secure_url;
        }

        //update only the fields that are present in req body

        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructors") {
                    course[key] = JSON.parse(updates[key]);
                } else {
                    course[key] = updates[key];
                }
            }
        }

        await course.save();

        const updatedCourse = await Course_Model.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: { path: "subSections" },
            })
            .exec();

        //return

        return res.status(200).json({
            success: true,
            message: "Course Updated Successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.log("Error in editing the course", error);

        return res.status(500).json({
            success: false,
            message: "Some error in updating the course",
            error: error.message,
        });
    }
};

//! get full course Details

exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        const courseDetails = await Course_Model.findOne({ _id: courseId })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReview")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections",
                },
            })
            .exec();

        //valid
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the Course with ${courseId}`,
            });
        }
        console.log("Course Details:", courseDetails);

        let courseProgressCount = await CourseProgress_Model.findOne({
            courseID: courseId,
            userID: userId,
        });
        console.log("Course Progress Count :", courseProgressCount);

        let totalDurationInSecond = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(
                    subSection.timeDurationInSeconds
                );
                totalDurationInSecond += timeDurationInSeconds;
            });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSecond);

        //return
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : [],
            },
            message: "All course details fetched",
        });
    } catch (error) {
        console.log("Error in whole course details fetching :", error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching whole course details",
            error: error.message,
        });
    }
};

//! list of course by Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        //find all the courses belonging to instructor
        const instructorCourses = await Course_Model.find({
            instructor: instructorId,
        })
            .sort({ createdAt: -1 })
            .populate("category")
            .exec();

        //return
        return res.status(200).json({
            success: true,
            message: "Instructor's Courses fetched successfully",
            data: instructorCourses,
        });
    } catch (error) {
        console.log("instructor's courses data fetching error", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
};

exports.deleteCourse = async (req, res) => {
    console.log("Entering in delete section controller");
    try {
        //get data
        const { courseId } = req.body;
        console.log("courseId: ", req.body);
        // delete from db

        const course = await Course_Model.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        //unenroll students
        const studentsEnrolled = course.studentsEnrolled;
        for (const studentId of studentsEnrolled) {
            await User_Model.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            });
        }

        //unenroll instructors
        const instructorId = course.instructor;

        await User_Model.findByIdAndUpdate(instructorId, {
            $pull: { courses: courseId },
        });

        // delete course from categoryDB
        const categoryId = course.category;
        console.log("cp1");
        await Category_Model.findByIdAndUpdate(categoryId, {
            $pull: { courses: courseId },
        });
        console.log("Deleted from category");

        //TODO: delete course from ratingAndReview schema

        //delete section and sub-sections
        const courseSections = course.courseContent;

        for (const sectionId of courseSections) {
            //delete subsection of the section
            console.log("cp0", sectionId);
            const section = await Section_Model.findById(sectionId);
            console.log("cp11", section);
            if (section) {
                const subSections = section.subSections;
                for (const subSectionId of subSections) {
                    await SubSection_Model.findByIdAndDelete(subSectionId);
                }
            }

            await Section_Model.findByIdAndDelete(sectionId);
        }
        // console.log("cp1");
        console.log("cp2");
        //Delete the course

        await Course_Model.findByIdAndDelete(courseId);

        //return
        return res.status(200).json({
            success: true,
            message: "Course deleted Successfully.",
        });
    } catch (error) {
        console.log("Error in deleting the course :", error);
        return res.status(500).json({
            success: false,
            message: "Error in Deleting Course",
        });
    }
};
