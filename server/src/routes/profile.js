const express = require("express");
const router = express.Router();

const { getEnrolledCourses } = require("../controllers/Profile");

const { auth } = require("../middlewares/auth");

//!Routes for get enrolled Courses

router.get("/getEnrolledCourses", getEnrolledCourses);

module.exports = router;
