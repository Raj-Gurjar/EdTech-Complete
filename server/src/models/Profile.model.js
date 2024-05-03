const mongoose = require("mongoose");

const Profile_Schema = new mongoose.Schema(
    {
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        dateOfBirth: {
            type: Date,
            default: new Date("1990-01-01"),
        },
        about: {
            type: String,
            default: "Not Mentioned",
            trim: true,
        },
        contactNumber: {
            type: String, 
            default: "0000000000", 
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Profile_Model", Profile_Schema);
