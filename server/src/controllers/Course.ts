import { Request, Response } from "express";
const Course_Model = require("../models/Course.model");
const Category_Model = require("../models/Category.model");
const User_Model = require("../models/User.model");
const CourseProgress_Model = require("../models/CourseProgress.model");

const { uploadImageToCloudinary } = require("../utils/imageUploader");

const SubSection_Model = require("../models/SubSection.model");

const Section_Model = require("../models/Section.model");
const { uploadToCloudinary } = require("../config/cloudinary");
const {
    convertSecondsToDuration,
    calculateTotalDuration,
} = require("../utils/convertDuration");

interface AuthRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

//TODO : Add courseProgress controller (lec 30 , 2.18 time)

export const getAllPublishedCourses = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { search, category } = req.query;
        
        // Build the query filter
        const filter: any = { status: "Published" };
        
        // Add search filter if provided
        if (search && typeof search === 'string' && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i'); // Case-insensitive search
            filter.$or = [
                { courseName: searchRegex },
                { courseDescription: searchRegex },
            ];
        }
        
        // Add category filter if provided
        if (category && typeof category === 'string' && category.trim() && category !== 'all') {
            // First, find the category by name
            const categoryDoc = await Category_Model.findOne({ 
                name: { $regex: new RegExp(`^${category.trim()}$`, 'i') } 
            });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            }
        }

        const allCourse = await Course_Model.find(
            filter,
            {
                courseName: true,
                price: true,
                courseDescription: true,
                instructor: true,
                thumbnail: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
                category: true,
            }
        )
            .populate("instructor")
            .populate("category")
            .populate({
                path: "ratingAndReviews",
                select: "rating", // Only select rating field for performance
            })
            .exec();

        //* return res
        return res.status(200).json({
            success: true,
            data: allCourse,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error in getting all the Courses",
            error: error.message,
        });
    }
};

// Get Course by Id
export const getCourseById = async (req: Request, res: Response): Promise<Response | void> => {
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
            .populate({
                path: "ratingAndReviews",
                populate: {
                    path: "user",
                    select: "firstName lastName email profileImage",
                },
            })
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

        const totalDuration = calculateTotalDuration(
            courseDetails.courseContent
        );

        return res.status(200).json({
            success: true,
            data: { courseDetails, totalDuration },
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error in fetching this course data.",
            error: error.message,
        });
    }
};

// get full course Details
export const getFullCourseDetails = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        const { courseId } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const courseDetails = await Course_Model.findOne({ _id: courseId })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate({
                path: "ratingAndReviews",
                populate: {
                    path: "user",
                    select: "firstName lastName email profileImage",
                },
            })
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

        let courseProgressCount = await CourseProgress_Model.findOne({
            courseID: courseId,
            userId: userId,
        });

        let totalDurationInSeconds = 0;
        courseDetails.courseContent?.forEach((content: any) => {
            content.subSections?.forEach((subSection: any) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration || "0");
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

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
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error in fetching whole course details",
            error: error.message,
        });
    }
};

//! ######### Student Specific ##########

//! ######### Instructor Specific ##########
export const createCourse = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        //*get the data
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            language,
            category,
            // status,
            instructions,
            tag,
        } = req.body;
        let { status } = req.body;

        // Parse JSON strings if they are strings
        if (typeof instructions === 'string') {
            try {
                instructions = JSON.parse(instructions);
            } catch (e) {
                // If parsing fails, keep as is
            }
        }
        if (typeof tag === 'string') {
            try {
                tag = JSON.parse(tag);
            } catch (e) {
                // If parsing fails, keep as is
            }
        }
        if (typeof whatYouWillLearn === 'string') {
            try {
                whatYouWillLearn = JSON.parse(whatYouWillLearn);
            } catch (e) {
                // If parsing fails, keep as is
            }
        }


        // Handle both disk storage (path) and memory storage (buffer) for serverless
        const thumbnailPath = req.file?.path;
        const thumbnailBuffer = req.file?.buffer;

        //* validation

        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !language ||
            !category ||
            !tag ||
            (!thumbnailPath && !thumbnailBuffer)
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
        //TODO: check userID and instructorDetail are equal or not
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const instructorDetails = await User_Model.findById(userId, {
            accountType: "Instructor",
        });

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }
        //* Add course in that Category
        const categoryDetail = await Category_Model.findById(category);

        if (!categoryDetail) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        //* Upload thumbnail to cloudinary
        // Check if Cloudinary environment variables are set
        if (!process.env.CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Cloudinary configuration is missing. Please check environment variables.",
            });
        }

        // Use buffer for serverless, path for local
        const thumbnailFile = thumbnailBuffer || thumbnailPath;
        const thumbnailImage = await uploadToCloudinary(
            thumbnailFile,
            process.env.CLD_THUMBNAIL_FOLDER || "thumbnails"
        );

        if (!thumbnailImage) {
            return res.status(400).json({
                success: false,
                message: "Unable to upload thumbnail to cloudinary. Please check file format and size.",
            });
        }

        //* Create course entry in db

        const newCourse = await Course_Model.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id, //to give reference to instructor obj
            whatYouWillLearn,
            tags: tag,
            price,
            language,
            category: categoryDetail._id,
            status: status,
            instructions: instructions,
            thumbnail: thumbnailImage.secure_url || "",
        });

        //* Add course in user schema of instructor
        await User_Model.findByIdAndUpdate(
            instructorDetails._id,
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
            category,
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );

        //* return res
        return res.status(200).json({
            success: true,
            message: "New Course Created Successfully.",
            newCourse,
        });
    } catch (error: any) {
        console.error("Error in creating course:", error);
        const errorMessage = error?.message || "Unknown error";
        const errorStack = error?.stack;
        
        // Log full error details for debugging
        console.error("Error details:", {
            message: errorMessage,
            stack: errorStack,
            file: req.file ? {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                hasPath: !!req.file.path,
                hasBuffer: !!req.file.buffer
            } : "No file uploaded"
        });
        
        return res.status(500).json({
            success: false,
            message: "Error in Creating Course.",
            error: process.env.NODE_ENV === "development" ? errorMessage : "An error occurred while creating the course. Please try again.",
        });
    }
};

//edit Course  (vid. 26, near 1:00hr)
export const editCourse = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        const { courseId } = req.body;
        const updates = req.body;


        const course = await Course_Model.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not Found" });
        }

        //if thumbnail image is found update it
        if (req.files) {
            const thumbnail = (req.files as any).thumbnailImage;
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
                    course[key] = (updates[key]);
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
            .populate({
                path: "ratingAndReviews",
                populate: {
                    path: "user",
                    select: "firstName lastName email profileImage",
                },
            })
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
    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: "Some error in updating the course",
            error: error.message,
        });
    }
};

export const deleteCourse = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        //get data
        const { courseId } = req.body;
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
        await Category_Model.findByIdAndUpdate(categoryId, {
            $pull: { courses: courseId },
        });

        //TODO: delete course from ratingAndReview schema

        //delete section and sub-sections
        const courseSections = course.courseContent;

        for (const sectionId of courseSections) {
            //delete subsection of the section
            const section = await Section_Model.findById(sectionId);
            if (section) {
                const subSections = section.subSections;
                for (const subSectionId of subSections) {
                    await SubSection_Model.findByIdAndDelete(subSectionId);
                }
            }

            await Section_Model.findByIdAndDelete(sectionId);
        }
        //Delete the course

        await Course_Model.findByIdAndDelete(courseId);

        //return
        return res.status(200).json({
            success: true,
            message: "Course deleted Successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Deleting Course",
        });
    }
};

// list of course by Instructor
export const getInstructorCourses = async (req: AuthRequest, res: Response): Promise<Response | void> => {
    try {
        const instructorId = req.user?.id;

        if (!instructorId) {
            return res.status(400).json({
                success: false,
                message: "User not authenticated",
            });
        }

        // Find all the courses belonging to instructor
        const instructorCourses = await Course_Model.find({
            instructor: instructorId,
        })
            .sort({ createdAt: -1 })

            .populate("category")

            .exec();

        // Return
        return res.status(200).json({
            success: true,
            data: instructorCourses,
        });
    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
};

//! ######### Admin Specific ##########
export const getAllCoursesAdmin = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const allCourse = await Course_Model.find({}, {})
            .populate("instructor")
            .populate("courseContent")
            .exec();

        //* return res
        return res.status(200).json({
            success: true,
            data: allCourse,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error in getting all the Courses",
            error: error.message,
        });
    }
};

export const publishCourse = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course_Model.findOne({ _id: courseId });

        // Check if the course exists
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the Course with ${courseId}`,
            });
        }

        // If the course status is "Draft", update it to "Publish"
        if (courseDetails.status === "Draft") {
            await Course_Model.findByIdAndUpdate(
                courseId,
                { $set: { status: "Published" } },
                { new: true }
            );
        }

        //* return res
        return res.status(200).json({
            success: true,
            message: "Course Published Successfully.",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error in publishing the Course",
            error: error.message,
        });
    }
};

export const unpublishCourse = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course_Model.findOne({ _id: courseId });

        // Check if the course exists
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the Course with ${courseId}`,
            });
        }

        // If the course status is "Published", update it to "Draft"
        if (courseDetails.status === "Published") {
            await Course_Model.findByIdAndUpdate(
                courseId,
                { $set: { status: "Draft" } },
                { new: true }
            );
        }

        //* return res
        return res.status(200).json({
            success: true,
            message: "Course Unpublished Successfully.",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Error in unpublishing the Course",
            error: error.message,
        });
    }
};

export const getCourseByIdAdmin = async (req: Request, res: Response): Promise<Response | void> => {
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
            .populate({
                path: "ratingAndReviews",
                populate: {
                    path: "user",
                    select: "firstName lastName email profileImage",
                },
            })
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

        const totalDuration = calculateTotalDuration(
            courseDetails.courseContent
        );

        return res.status(200).json({
            success: true,
            data: { courseDetails, totalDuration },
        });
    } catch (error: any) { 
        return res.status(500).json({
            success: false,
            message: "Error in fetching this course data.",
            error: error.message,
        });
    }
};

