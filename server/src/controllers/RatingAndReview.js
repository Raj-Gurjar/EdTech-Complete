const RatingAndReview_Model = require("../models/RatingAndReview.model.js");
const Course_Model = require("../models/Course.model.js");

exports.createRatingNReview = async (req, res) => {
    try {
        //* get the data
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        //* validate
        //check fields are not empty
        if (!rating || !review || !userId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Some fields are missing.",
            });
        }
        //check user is enrolled in course
        const courseDetails = await Course_Model.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Error! Student Details not found in this course",
            });
        }
        //1 comment per user
        const alreadyReviewed = await RatingAndReview_Model.findOne({
            user: userId,
            courseId: courseId,
        });

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course is already reviewed by User",
            });
        }

        //* create rating
        const ratingReview = await RatingAndReview_Model.create({
            rating: rating,
            review: review,
            course: courseId,
            user: userId,
        });

        //*update course model also with this rating
        const updateCourse = await Course_Model.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                },
            },
            {
                new: true,
            }
        );
        console.log("Updated Course:", updateCourse);
        //*return
        return res.status(200).json({
            success: true,
            message: "Rating Created Successfully.",
            ratingReview,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while creating Rating",
        });
    }
};

//get Average Rating
exports.getAverageRating = async (req, res) => {
    try {
        //get course id
        const courseId = req.body.courseId;

        //calculate avg rating
        const result = await RatingAndReview_Model.aggregate(
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating",
                    },
                },
            }
        );

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Average rating is shown successfully.",
                averageRating: result[0].averageRating,
            });
        }

        return res.status(200).json({
            success: false,
            message: "Average Rating is 0, now rating given till now",
            averageRating: 0,
        });
    } catch (error) {
        return res.status().json({
            success: false,
            message: "Error while getting average rating.",
        });
    }
};

//get all rating And Reviews

exports.getAllRatingAndReviews = async (req, res) => {
    try {
        //get the data
        const allReviews = await RatingAndReview_Model.find({})
            .sort({
                rating: "desc",
            })
            .populate({
                path: "user",
                select: "firstName lastName email  profileImage",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();

        //return
        // console.log("rr", allReviews);
        return res.status(200).json({
            success: true,
            message: "All rating and reviews are fetched successfully",
            data: allReviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting all reviews and rating",
            error: error.message,
        });
    }
};

//TODO : get rating and reviews corresponding to a course
