const express = require("express");
const router = express.Router();

const { createCategory,showAllCategories } = require("../controllers/Category");

router.post("/createCategory", createCategory);
router.post("/showAllCategories", showAllCategories);
// router.post("/login", logIn);

module.exports = router;
