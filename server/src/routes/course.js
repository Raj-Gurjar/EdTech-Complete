const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseById,
    editCourse,
    getInstructorCourses,
    deleteCourse,
    getFullCourseDetails,
} = require("../controllers/Course");

const {
    getAllRatingAndReviews,
    getAverageRating,
    createRatingNReview,
} = require("../controllers/RatingAndReview");

const { auth, isInstructor, isStudent } = require("../middlewares/auth");
const { fileUpload } = require("../middlewares/multer");

//!Routes for creating , getting all and getting by id of instructor course
router.get("/getAllCourses", getAllCourses);
router.post("/getFullCourseDetails", auth, isStudent, getFullCourseDetails);
router.post(
    "/createCourse",
    auth,
    isInstructor,
    fileUpload.single("thumbnail"),
    createCourse
);
router.post("/editCourse", auth, isInstructor, editCourse);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.post("/getCourse", getCourseById);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

//!Rating
router.post("/createRating", auth, isStudent, createRatingNReview);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingAndReviews);

module.exports = router;
