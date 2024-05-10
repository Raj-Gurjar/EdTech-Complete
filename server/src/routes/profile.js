const express = require("express");
const router = express.Router();

const {
    getEnrolledCourses,
    updateProfile,
    deleteUserAccount,
    updateDisplayPicture,
} = require("../controllers/Profile");

const { auth, isStudent } = require("../middlewares/auth");
const { fileUpload } = require("../middlewares/multer");

//!Routes for get enrolled Courses

router.get("/getEnrolledCourses", auth, isStudent, getEnrolledCourses);
router.put("/updateProfile", auth, updateProfile);
router.put(
    "/updateDisplayPicture",
    auth,
    fileUpload.single("profileImage"),
    updateDisplayPicture
);
router.delete("/deleteProfile", auth, deleteUserAccount);

module.exports = router;
