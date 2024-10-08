const express = require("express");
const router = express.Router();

const {
    createSection,
    updateSection,
    deleteSection,
    sectionById,
} = require("../controllers/Section");
const { auth, isInstructor } = require("../middlewares/auth");

router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);
router.post("/getSection", sectionById);

module.exports = router;
