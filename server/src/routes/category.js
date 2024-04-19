const express = require("express");
const router = express.Router();

const {
    createCategory,
    showAllCategories,
    categoryPageDetails,
} = require("../controllers/Category");
const { auth, isAdmin } = require("../middlewares/auth");

router.post("/createCategory", createCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.get("/showAllCategories", showAllCategories);

module.exports = router;
