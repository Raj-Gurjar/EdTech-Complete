const Profile_Model = require("../models/Profile.model");
const User_Model = require("../models/User.model");
const Course_Model = require("../models/Course.model");
const CourseProgress_Model = require("../models/CourseProgress.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { populate } = require("../models/ContactUs.model");

//! Since while creating SignUp we have already stored null in Profile's data,
//! so we do not need to create it, we will just to update the null values.

exports.updateProfile = async (req, res) => {
    //TODO : check email exists or not before updating
    console.log("Inside update profile");
    try {
        // Get data from request body
        const {
            gender,
            dateOfBirth,
            about,
            contactNumber,
            firstName,
            lastName,
            email,
        } = req.body;

        // Get the user id
        const userId = req.user.id;

        // Validate user id
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Profile not found",
            });
        }

        // Get user's profile details
        const userDetails = await User_Model.findById(userId);

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User details not found",
            });
        }

        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile_Model.findById(profileId);

        if (!profileDetails) {
            return res.status(400).json({
                success: false,
                message: "Profile details not found",
            });
        }

        // Update profile details
        await Profile_Model.updateOne(
            { _id: profileId },
            {
                $set: {
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    about: about,
                    contactNumber: contactNumber,
                },
            }
        );
        await Profile_Model.updateOne(
            { _id: profileId },
            {
                $set: {
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    about: about,
                    contactNumber: contactNumber,
                },
            }
        );
        await User_Model.updateOne(
            { _id: userId },
            {
                $set: {
                    firstName,
                    lastName,
                    email,
                },
            }
        );

        // Fetch updated profile details
        const updatedProfile = await Profile_Model.findById(profileId);

        userDetails.additionalDetails = updatedProfile._id;
        await userDetails.save();

        // Fetch updated user details with populated additionalDetails
        const updatedUser =
            await User_Model.findById(userId).populate("additionalDetails");
        // Return success response with updated profile details

        return res.status(200).json({
            success: true,
            message: "User's Profile Updated Successfully",
            updatedProfile,
            updatedUser,
        });
    } catch (error) {
        console.error("Error while updating User Profile:", error);
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
        const userDetails = await User_Model.findById({ _id: userId });
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
            success: true,
            message: "Image Updates Successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating the Image.",
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        console.log("Entering get Enrolled C id");
        const userId = req.user.id;
        console.log("userId", userId);
        const userDetails = await User_Model.findOne({ _id: userId }).populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subSections",
                },
            },
        });
        console.log("user details:", userDetails);
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
