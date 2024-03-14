const Course_Model = require("../models/Course.model");
const Tag_Model = require("../models/Tag.model");
const User_Model = require("../models/User.model");

const { uploadImageToCloudinary } = require("../utils/imageUploader");

//! Create Course
exports.createCourse = async (req, res) => {
    try {
        //*get the data
        const { courseName, courseDescription, whatYouWillLearn, price, tag } =
            req.body;

        const thumbnail = req.file.thumbnailImage;

        //* validation

        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag ||
            !thumbnail
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required.",
            });
        }
        //get instructor data bcs instructor is in db
        const userId = req.user.id;

        const instructorDetails = await User_Model.findById(userId);
        console.log("Instructor details :", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }
        //* Add course in that tag
        const tagDetail = await Tag_Model.findById(tag);

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        //* Upload thumbnail to cloudinary

        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME_CLOUDINARY
        );

        //* Create course entry in db

        const newCourse = await Course_Model.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id, //to give reference to instructor obj
            whatYouWillLearn,
            price,
            tag: tagDetail._id,
            thumbnail: thumbnailImage.secure_url,
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
        //* Add course in tag schema
        await Tag_Model.findByIdAndUpdate(
            { _id: tagDetail._id },
            {
                $push: {
                    course: newCourse._id,
                },
            },
            { new: true }
        );

        //* return res

        return res.status(200).json({
            success: true,
            message: "New Course Created Succesfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Creating Course.",
            newCourse,
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
