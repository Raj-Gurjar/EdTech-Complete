const mongoose = require("mongoose");

const Tag_Schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    course: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course_Schema",
        },
    ],
});

module.exports = mongoose.model("Tag_Schema", Tag_Schema);
