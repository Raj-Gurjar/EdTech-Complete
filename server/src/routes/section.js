const express = require("express");
const router = express.Router();

const { createSection,updateSection,deleteSection } = require("../controllers/Section");
const { auth } = require("../middlewares/auth");

router.post("/addSection",auth, createSection);
router.put("/updateSection",auth, updateSection);
router.delete("/deleteSection",auth, deleteSection);

module.exports = router;
