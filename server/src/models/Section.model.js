const mongoose = require("mongoose");

const Section_Schema = new mongoose.Schema(
    {
        sectionName: {
            type: String,
            trim: true,
        },

        shortDescription: {
            type: String,
            default: "short description",
            trim: true,
            // required: true,
        },
        longDescription: {
            type: String,
            default: "long description",
        },

        subSections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubSection_Model",
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Section_Model", Section_Schema);
