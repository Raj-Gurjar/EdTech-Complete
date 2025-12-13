import express, { Router } from "express";
const router: Router = express.Router();

const {
    createCategory,
    showAllCategories,
    categoryPageDetails,
    deleteCategory,
} = require("../controllers/Category");
const { auth, isAdmin } = require("../middlewares/auth");

router.post("/createCategory", auth, isAdmin, createCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.get("/showAllCategories", showAllCategories);
router.delete("/deleteCategory", auth, isAdmin, deleteCategory);

module.exports = router;

