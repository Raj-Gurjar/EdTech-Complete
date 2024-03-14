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
        ref: "User_Schema",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
        trim: true,
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section_Schema",
        },
    ],

    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview_Schema",
        },
    ],
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag_Schema",
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_Schema",
            required: true,
        },
    ],
});

module.exports = mongoose.model("Course_Schema", Course_Schema);
