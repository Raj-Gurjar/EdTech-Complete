const mongoose = require("mongoose");

const Category_Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course_Model",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Category_Model", Category_Schema);
