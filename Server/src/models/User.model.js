const mongoose = require("mongoose");

const User_Schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile_Schema",
        required: true,
    },
    courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course_Schema",
    },

    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress_Schema",
            required: true,
        },
    ],

    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpires: {
        type: Date,
    },
});

module.exports = mongoose.model("User_Schema", User_Schema);
