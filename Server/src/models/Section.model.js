const mongoose = require("mongoose");

const Section_Schema = new mongoose.Schema({
    sectionName: {
        type: String,
        trim: true,
    },

    subSections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection_Schema",
            required: true,
        },
    ],
});

module.exports = mongoose.model("Section_Schema", Section_Schema);
