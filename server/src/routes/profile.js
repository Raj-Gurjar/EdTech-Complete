const express = require("express");
const router = express.Router();

const {
    getEnrolledCourses,
    updateProfile,
    deleteUserAccount,
} = require("../controllers/Profile");

const { auth, isStudent } = require("../middlewares/auth");

//!Routes for get enrolled Courses

router.get("/getEnrolledCourses", auth, isStudent, getEnrolledCourses);
router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteProfile", auth, deleteUserAccount);

module.exports = router;
