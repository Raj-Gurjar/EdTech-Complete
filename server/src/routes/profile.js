const express = require("express");
const router = express.Router();

const { getEnrolledCourses, updateProfile } = require("../controllers/Profile");

const { auth, isStudent } = require("../middlewares/auth");

//!Routes for get enrolled Courses

router.get("/getEnrolledCourses", auth, isStudent, getEnrolledCourses);
router.put("/updateProfile", auth, updateProfile);

module.exports = router;
