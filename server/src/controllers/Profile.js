const Profile_Model = require("../models/Profile.model");
const User_Model = require("../models/User.model");
const Course_Model = require("../models/Course.model");
const CourseProgress_Model = require("../models/CourseProgress.model");
const { populate } = require("../models/ContactUs.model");
const { uploadToCloudinary } = require("../config/cloudinary");

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
    console.log("in dele");
    try {
        //get the id
        const userId = req.user.id;
        console.log("userId", userId);
        //validate

        const userDetails = await User_Model.findById({ _id: userId });
        console.log("user de", userDetails);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }
        console.log("user de", userDetails);

        //first we will delete the additional details,course,courseProgress then user details
        await Profile_Model.findByIdAndDelete({
            _id: userDetails.additionalDetails._id,
        });

        console.log("c1");

        //TODO: similarly we have to delete it from other schemas also
        // await CourseProgress_Model?.findByIdAndDelete({
        //     _id: userDetails.courseProgress._id,
        // });

        // const coursesProgress = userDetails.courseProgress;

        // for (const courseId of coursesProgress) {
        //     await CourseProgress_Model.findByIdAndUpdate(courseId, {
        //         $pull: { studentsEnrolled: userId },
        //     });
        // }
        console.log("c2");

        const coursesEnrolled = userDetails.courses;
        for (const courseId of coursesEnrolled) {
            await Course_Model.findByIdAndUpdate(courseId, {
                $pull: { studentsEnrolled: userId },
            });
        }

        console.log("c3");

        await User_Model.findByIdAndDelete({ _id: userId });

        console.log("c4");
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
        console.log("inside upProfi");
        const userId = req.user.id;

        console.log(userId);
        console.log("req.body", req.body);
        console.log("req.file :", req.file);
        const displayPicturePath = req.file?.path;

        console.log("disp pic path", displayPicturePath);

        const displayImage = await uploadToCloudinary(
            displayPicturePath,
            process.env.CLD_PROFILE_PIC_FOLDER
        );
        console.log("image..", displayImage);

        const updateProfile = await User_Model.findByIdAndUpdate(
            { _id: userId },
            { profileImage: displayImage.secure_url },
            { new: true }
        );
        const updatedUser =
            await User_Model.findById(userId).populate("additionalDetails");

        return res.status(200).json({
            success: true,
            message: "Profile Picture Updated Successfully",
            updatedUser,
        });
        
    } catch (error) {
        console.log("Error in profile pic update", error);
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
