const mongoose = require("mongoose");

const Profile_Schema = new mongoose.Schema(
    {
        gender: {
            type: String,
        },
        dateOfBirth: {
            type: String,
        },
        about: {
            type: String,
            trim: true,
        },
        contactNumber: {
            type: Number,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Profile_Model", Profile_Schema);
