const mongoose = require("mongoose");

const RatingAndReview_Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_Schema",
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        trim: true,
    },
});

module.exports = mongoose.model(
    "RatingAndReview_Schema",
    RatingAndReview_Schema
);
