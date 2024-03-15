const mongoose = require("mongoose");

const CourseProgress_Schema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course_Model",
    },
    completeVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"SubSection_Model"
        },
    ],

    
});

module.exports = mongoose.model("CourseProgress_Model", CourseProgress_Schema);
