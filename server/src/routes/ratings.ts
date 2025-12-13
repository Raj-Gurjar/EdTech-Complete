import express, { Router } from "express";
const router: Router = express.Router();

const {
    getAllRatingAndReviews,
    getAverageRating,
    createRatingNReview,
} = require("../controllers/RatingAndReview");

const { auth, isInstructor, isStudent } = require("../middlewares/auth");

//!Rating
router.post("/createRating", auth, isStudent, createRatingNReview);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingAndReviews);

module.exports = router;

