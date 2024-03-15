const mongoose = require("mongoose");

const Category_Schema = new mongoose.Schema({
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
            ref: "Course_Model",
        },
    ],
});

module.exports = mongoose.model("Category_Model", Category_Schema);
