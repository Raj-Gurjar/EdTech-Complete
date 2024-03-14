const mongoose = require("mongoose");

const SubSection_Schema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
    },
    additionalUrl:
    {
        type:String
    }
});

module.exports = mongoose.model("SubSection_Schema", SubSection_Schema);
