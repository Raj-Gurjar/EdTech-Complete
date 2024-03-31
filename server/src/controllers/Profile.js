const Profile_Model = require("../models/Profile.model");
const User_Model = require("../models/User.model");
const Course_Model = require("../models/Course.model");
const CourseProgress_Model = require("../models/CourseProgress.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//! Since while creating SignUp we have already stored null in Profile's data,
//! so we do not need to create it, we will just to update the null values.

exports.updateProfile = async (req, res) => {
    try {
        //get data
        const {
            gender,
            dateOfBirth = "",
            about = "",
            contactNumber,
        } = req.body;

        // get the user id

        const userId = req.user.id;

        //validate
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Profile not found",
            });
        }
        //TODO; validation on req is not needed bcs it is not mandatory data

        //from user id get the profile id
        const userDetails = await User_Model.findById(userId);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile_Model.findById(profileId);

        //update date in Profile
        (profileDetails.dateOfBirth = dateOfBirth),
            (profileDetails.gender = gender),
            (profileDetails.about = about),
            (profileDetails.contactNumber = contactNumber);

        await profileDetails.save();

        //return
        return res.status(200).json({
            success: true,
            message: "User's Profile Updated Successfully",
            updatedProfile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating User Profile",
        });
    }
};

//! get all user details

exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const userId = req.user.id;

        //validate
        const userDetails = await User_Model.findById(userId)
            .populate(["additionalDetails", "courses", "courseProgress"])
            .exec();

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User not found.",
            });
        }
        //return
        return res.status(200).json({
            success: false,
            message: "User's whole data fetched Successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while getting the whole User data",
        });
    }
};

//TODO : In this we will have to schedule the delete account for 3 days or so not immediately delete account
//TODO : Explore -> cronjob
exports.deleteUserAccount = async (req, res) => {
    try {
        //get the id
        const userId = req.user.id;

        //validate
        const userDetails = await User_Model.findById({ _id: id });
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        //first we will delete the additional details,course,courseProgress then user details
        await Profile_Model.findByIdAndDelete({
            _id: userDetails.additionalDetails,
        });

        //TODO: similarly we have to delete it from other schemas also
        await CourseProgress_Model.findByIdAndDelete({
            _id: userDetails.courseProgress,
        });
        await Course_Model.findByIdAndDelete({
            _id: userDetails.courses,
        });

        await User_Model.findByIdAndDelete({ _id: id });

        //return
        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Deleting account",
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const displayPicture = req.files.displayPicture;
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME_CLOUDINARY,
            1000,
            1000
        );
        console.log("image..", image);

        const updateProfile = await User_Model.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        );

        res.send({
            success:true,
            message:"Image Updates Successfully."
        })
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Error in updating the Image." 
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User_Model.findOne({ _id: userId })
            .populate("courses")
            .exec();

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Enrolled Courses Details fetched successfully",
            userDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in finding Enrolled Courses",
        });
    }
};
