const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllPublishedCourses,
    getAllCoursesAdmin,
    getCourseById,
    editCourse,
    getInstructorCourses,
    deleteCourse,
    getFullCourseDetails,
    publishCourse,
    getCourseByIdAdmin,
} = require("../controllers/Course");

const {
    getAllRatingAndReviews,
    getAverageRating,
    createRatingNReview,
} = require("../controllers/RatingAndReview");

const {
    auth,
    isInstructor,
    isStudent,
    isAdmin,
} = require("../middlewares/auth");
const { fileUpload } = require("../middlewares/multer");

const { updateCourseProgress } = require("../controllers/CourseProgress");

//!Routes for creating , getting all and getting by id of instructor course
router.get("/getAllCourses-published", getAllPublishedCourses);

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
router.get("/getAllReviews", getAllRatingAndReviews);

//!Admin
router.get("/getAllCourses-admin", auth, isAdmin, getAllCoursesAdmin);
router.post("/courseDetails-admin", auth, isAdmin, getCourseByIdAdmin);
router.post("/publishCourse-admin", auth, isAdmin, publishCourse);

//!Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

module.exports = router;
