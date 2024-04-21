const mongoose = require("mongoose");

const RatingAndReview_Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_Model",
            require: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            trim: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course_Model",
            index: true,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "RatingAndReview_Model",
    RatingAndReview_Schema
);
