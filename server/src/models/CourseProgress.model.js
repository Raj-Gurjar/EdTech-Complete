const mongoose = require("mongoose");

const CourseProgress_Schema = new mongoose.Schema(
    {
        courseID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course_Model",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        completedVideos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubSection_Model",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("CourseProgress_Model", CourseProgress_Schema);
