const express = require("express");
const router = express.Router();

const { createSection,updateSection,deleteSection } = require("../controllers/Section");
const { auth,isInstructor} = require("../middlewares/auth");

router.post("/addSection",auth,isInstructor, createSection);
router.put("/updateSection",auth, isInstructor, updateSection);
router.delete("/deleteSection",auth,isInstructor, deleteSection);

module.exports = router;
