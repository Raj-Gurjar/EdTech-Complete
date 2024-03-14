const mongoose = require("mongoose");

const CourseProgress_Schema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course_Schema",
    },
    completeVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"SubSection_Schema"
        },
    ],

    
});

module.exports = mongoose.model("CourseProgress_Schema", CourseProgress_Schema);
