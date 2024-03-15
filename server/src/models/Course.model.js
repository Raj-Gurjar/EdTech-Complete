const mongoose = require("mongoose");

const Course_Schema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
        required: true,
    },
    courseDescription: {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_Model",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
        trim: true,
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section_Model",
        },
    ],

    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview_Model",
        },
    ],
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category_Model",
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_Model",
            required: true,
        },
    ],
});

module.exports = mongoose.model("Course_Model", Course_Schema);
