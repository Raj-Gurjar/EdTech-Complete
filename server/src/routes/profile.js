const express = require("express");
const router = express.Router();

const { getEnrolledCourses } = require("../controllers/Profile");

const { auth, isStudent } = require("../middlewares/auth");

//!Routes for get enrolled Courses

router.get("/getEnrolledCourses", auth, isStudent, getEnrolledCourses);

module.exports = router;
