const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourse,
    getCourseById,
} = require("../controllers/Course");

const {
    getAllRatingAndReviews,
    getAverageRating,
    createRatingNReview,
} = require("../controllers/RatingAndReview");

const { auth, isInstructor, isStudent } = require("../middlewares/auth");

//!Routes for creating , getting all and getting by id of instructor course
router.post("/createCourse", auth, isInstructor, createCourse);

//!Rating
router.post("/createRating", auth, isStudent, createRatingNReview);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingAndReviews);

module.exports = router;
