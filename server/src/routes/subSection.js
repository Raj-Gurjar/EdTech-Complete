const express = require("express");
const router = express.Router();

const {
    createSubSection,
    deleteSubSection,
    updateSubSection,
} = require("../controllers/SubSection");
const { auth } = require("../middlewares/auth");

router.post("/addSubSection", auth, createSubSection);
router.get("/updateSubSection", auth, updateSubSection);
router.get("/deleteSubSection", auth, deleteSubSection);

module.exports = router;
