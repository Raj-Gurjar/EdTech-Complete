const Course_Model = require("../models/Course.model");
const Category_Model = require("../models/Category.model");
const User_Model = require("../models/User.model");

const { uploadImageToCloudinary } = require("../utils/imageUploader");

//! Create Course
exports.createCourse = async (req, res) => {
    try {
        //*get the data
        console.log("entering createCourse");
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
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
                    course: newCourse._id,
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
exports.getAllCourse = async (req, res) => {
    try {
        const allCourse = await Course_Model.find(
            {}, //need clarity in this 👇
            {
                courseName: true,
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
            success: false,
            message: "Data of All Courses Fetched Successfully.",
            allCourse,
        });
    } catch (error) {
        console.log("Get course Error : ", error);
        return res.status(500).json({
            success: false,
            message: "Error in getting all the Courses",
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
            .populate("ratingAndReview")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
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
        //return
        return res.status(200).json({
            success: true,
            message: "Course Data fetched Successfully.",
            courseDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in fetching this course data.",
        });
    }
};
