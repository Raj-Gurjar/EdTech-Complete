const express = require("express");
const router = express.Router();

const {
    createSubSection,
    deleteSubSection,
    updateSubSection,
} = require("../controllers/SubSection");
const { auth, isInstructor } = require("../middlewares/auth");
const { fileUpload } = require("../middlewares/multer");

router.post("/addSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

module.exports = router;
