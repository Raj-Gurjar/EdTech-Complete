const express = require("express");
const router = express.Router();

const { createSection,updateSection,deleteSection } = require("../controllers/Section");
const { auth } = require("../middlewares/auth");

router.post("/addSection",auth, createSection);
router.get("/updateSection",auth, updateSection);
router.get("/deleteSection",auth, deleteSection);

module.exports = router;
