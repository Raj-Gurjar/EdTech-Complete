import { Request, Response } from "express";
const Profile_Model = require("../models/Profile.model");
const User_Model = require("../models/User.model");
const Course_Model = require("../models/Course.model");
const CourseProgress_Model = require("../models/CourseProgress.model");
const { uploadToCloudinary } = require("../config/cloudinary");
const { convertSecondsToDuration } = require("../utils/convertDuration");
const Category_Model = require("../models/Category.model");

interface AuthRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

//! Since while creating SignUp we have already stored null in Profile's data,
//! so we do not need to create it, we will just to update the null values.

export const updateProfile = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    //TODO : check email exists or not before updating
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
        const userId = req.user?.id;

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

        let profileId = userDetails.additionalDetails;
        let profileDetails: any = null;
        
        if (!profileId) {
            // Create a new profile if it doesn't exist
            profileDetails = await Profile_Model.create({});
            userDetails.additionalDetails = profileDetails._id;
            await userDetails.save();
            profileId = profileDetails._id;
        } else {
            // Try to find the profile
            profileDetails = await Profile_Model.findById(profileId);
            
            // If profile doesn't exist but ID is referenced, create a new one
            if (!profileDetails) {
                profileDetails = await Profile_Model.create({});
                userDetails.additionalDetails = profileDetails._id;
                await userDetails.save();
                profileId = profileDetails._id;
            }
        }

        // Check if email is being changed and if it already exists
        if (email && email !== userDetails.email) {
            const emailExists = await User_Model.findOne({ email: email.toLowerCase().trim() });
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists",
                });
            }
        }

        // Update profile details (only update fields that are provided and not empty strings)
        const profileUpdate: any = {};
        if (dateOfBirth !== undefined && dateOfBirth !== null && dateOfBirth !== '') {
            profileUpdate.dateOfBirth = new Date(dateOfBirth);
        }
        if (gender !== undefined && gender !== null && gender !== '') {
            profileUpdate.gender = gender;
        }
        if (about !== undefined && about !== null) {
            profileUpdate.about = about;
        }
        if (contactNumber !== undefined && contactNumber !== null && contactNumber !== '') {
            profileUpdate.contactNumber = contactNumber;
        }

        if (Object.keys(profileUpdate).length > 0) {
            const profileUpdateResult = await Profile_Model.updateOne(
                { _id: profileId },
                { $set: profileUpdate }
            );
        }

        // Update user details (only update fields that are provided and not empty strings)
        const userUpdate: any = {};
        if (firstName !== undefined && firstName !== null && firstName.trim() !== '') {
            userUpdate.firstName = firstName.trim();
        }
        if (lastName !== undefined && lastName !== null && lastName.trim() !== '') {
            userUpdate.lastName = lastName.trim();
        }
        if (email !== undefined && email !== null && email.trim() !== '') {
            const normalizedEmail = email.toLowerCase().trim();
            // Only update if email is different
            if (normalizedEmail !== userDetails.email) {
                userUpdate.email = normalizedEmail;
            }
        }

        if (Object.keys(userUpdate).length > 0) {
            const userUpdateResult = await User_Model.updateOne(
                { _id: userId },
                { $set: userUpdate }
            );
        }

        // Fetch updated user details with populated additionalDetails
        const updatedUser =
            await User_Model.findById(userId).populate("additionalDetails");
        
        if (!updatedUser) {
            return res.status(400).json({
                success: false,
                message: "Failed to fetch updated user details",
            });
        }

        // Return success response with updated profile details
        return res.status(200).json({
            success: true,
            message: "User's Profile Updated Successfully",
            updatedUser,
        });
    } catch (error: any) {      
        return res.status(500).json({
            success: false,
            message: error.message || "Error while updating User Profile",
        });
    }
};

//! get all user details

export const getAllUserDetails = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        //get id
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }

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
            success: true,
            userDetails,
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
export const deleteUserAccount = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        //get the id
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }
        //validate

        const userDetails = await User_Model.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        //first we will delete the additional details,course,courseProgress then user details
        if (userDetails.additionalDetails) {
            await Profile_Model.findByIdAndDelete(userDetails.additionalDetails);
        }


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

        const coursesEnrolled = userDetails.courses;
        for (const courseId of coursesEnrolled) {
            await Course_Model.findByIdAndUpdate(courseId, {
                $pull: { studentsEnrolled: userId },
            });
        }


        await User_Model.findByIdAndDelete(userId);

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

export const updateDisplayPicture = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const displayPicturePath = req.file?.path;

        if (!displayPicturePath) {
            return res.status(400).json({
                success: false,
                message: "No image file provided",
            });
        }

        const displayImage = await uploadToCloudinary(
            displayPicturePath,
            process.env.CLD_PROFILE_PIC_FOLDER
        );

        if (!displayImage) {
            return res.status(500).json({
                success: false,
                message: "Error uploading image",
            });
        }

        await User_Model.findByIdAndUpdate(
            userId,
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
        return res.status(500).json({
            success: false,
            message: "Error in updating the Image.",
        });
    }
};

export const getEnrolledCourses = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }

        let userDetails: any = await User_Model.findOne({ _id: userId })
            .populate({
                path: "courses",
                populate: [
                    {
                        path: "courseContent",
                        populate: {
                            path: "subSections",
                        },
                    },
                    {
                        path: "ratingAndReviews",
                        select: "rating review user",
                        populate: {
                            path: "user",
                            select: "firstName lastName email profileImage",
                        },
                    },
                    {
                        path: "category",
                        select: "name",
                    },
                    {
                        path: "instructor",
                        select: "firstName lastName",
                    },
                ],
            })
            .exec();

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userId}`,
            });
        }

        userDetails = userDetails.toObject();

        let subSectionLength = 0;
        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            subSectionLength = 0;

            for (
                let j = 0;
                j < userDetails.courses[i].courseContent.length;
                j++
            ) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSections.reduce(
                    (acc: number, curr: any) => acc + parseInt(curr.timeDuration || "0"),
                    0
                );
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                );

                subSectionLength +=
                    userDetails.courses[i].courseContent[j].subSections.length;
            }

            let courseProgressCount = await CourseProgress_Model.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            });
            const completedVideosCount = courseProgressCount?.completedVideos?.length || 0;

            if (subSectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100;
            } else {
                //TO make it up to 2 decimal point
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (completedVideosCount / subSectionLength) *
                            100 *
                            multiplier
                    ) / multiplier;
            }
        }

        return res.status(200).json({
            success: true,
            userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in finding Enrolled Courses",
        });
    }
};

export const instructorDashboardData = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        // const { instructor } = req.user.id;

        if (!req.user?.id) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const courseDetails = await Course_Model.find({
            instructor: req.user.id,
        });
        const courseData = courseDetails.map((course: any) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            //create an new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };
            return courseDataWithStats;
        });

        return res.status(200).json({
            success: true,
            data: courseData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in fetching Instructor Course Data",
        });
    }
};

export const adminDashboardData = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        // Aggregate user data
        const userAggregation = User_Model.aggregate([
            {
                $facet: {
                    totalUsers: [{ $count: "count" }],
                    totalStudents: [
                        { $match: { accountType: "Student" } },
                        { $count: "count" },
                    ],
                    totalInstructors: [
                        { $match: { accountType: "Instructor" } },
                        { $count: "count" },
                    ],
                    totalActiveStudents: [
                        {
                            $match: {
                                accountType: "Student",
                                courses: { $ne: [] },
                            },
                        },
                        { $count: "count" },
                    ],
                    totalActiveInstructors: [
                        {
                            $match: {
                                accountType: "Instructor",
                                courses: { $ne: [] },
                            },
                        },
                        { $count: "count" },
                    ],
                },
            },
        ]);

        // Aggregate course and category data
        const [userResults, totalCategories] = await Promise.all([
            userAggregation,
            Category_Model.countDocuments(),
        ]);

        const userStats = userResults[0];
        const totalUsers = userStats.totalUsers[0]?.count || 0;
        const totalStudents = userStats.totalStudents[0]?.count || 0;
        const totalInstructors = userStats.totalInstructors[0]?.count || 0;
        const totalActiveStudents =
            userStats.totalActiveStudents[0]?.count || 0;
        const totalActiveInstructors =
            userStats.totalActiveInstructors[0]?.count || 0;

        // Calculate total earnings
        const courseDetails = await Course_Model.find(
            {},
            "studentsEnrolled price"
        );
        let totalCourses = 0;

        const totalEarningAdmin = courseDetails.reduce((total: number, course: any) => {
            totalCourses += 1;
            return total + course.studentsEnrolled.length * course.price * 0.25;
        }, 0);

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalCourses,
                totalCategories,
                totalActiveStudents,
                totalActiveInstructors,
                totalEarningAdmin: totalEarningAdmin.toFixed(2),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in fetching Data for Admin",
        });
    }
};

//! Public Statistics for About Page
export const getPublicStatistics = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        // Get total students
        const totalStudents = await User_Model.countDocuments({ accountType: "Student" });

        // Get total published courses
        const totalCourses = await Course_Model.countDocuments({ status: "Published" });

        // Get all published courses with populated course content
        const publishedCourses = await Course_Model.find({ status: "Published" })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections",
                },
            });

        // Calculate total lessons (sub-sections) and total minutes
        let totalLessons = 0;
        let totalMinutesInSeconds = 0;

        publishedCourses.forEach((course: any) => {
            if (course.courseContent && Array.isArray(course.courseContent)) {
                course.courseContent.forEach((section: any) => {
                    if (section.subSections && Array.isArray(section.subSections)) {
                        section.subSections.forEach((subSection: any) => {
                            totalLessons += 1;
                            const durationInSeconds = parseInt(subSection.timeDuration || "0", 10);
                            if (!isNaN(durationInSeconds)) {
                                totalMinutesInSeconds += durationInSeconds;
                            }
                        });
                    }
                });
            }
        });

        // Convert seconds to minutes (rounded to nearest integer)
        const totalMinutes = Math.round(totalMinutesInSeconds / 60);

        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalCourses,
                totalLessons,
                totalMinutes,
            },
        });
    } catch (error) {   
        return res.status(500).json({
            success: false,
            message: "Error in fetching public statistics",
        });
    }
};

