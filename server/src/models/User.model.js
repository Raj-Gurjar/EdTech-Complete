const mongoose = require("mongoose");

const User_Schema = new mongoose.Schema(
    {
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
            ref: "Profile_Model",
            required: true,
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course_Model",
            },
        ],

        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CourseProgress_Model",
                required: true,
            },
        ],

        resetPasswordToken: {
            type: String,
        },

        resetPasswordExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User_Model", User_Schema);
