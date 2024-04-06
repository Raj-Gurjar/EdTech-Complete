const express = require("express");
const router = express.Router();

const { createCategory,showAllCategories } = require("../controllers/Category");

router.post("/createCategory", createCategory);
router.get("/showAllCategories", showAllCategories);

module.exports = router;
