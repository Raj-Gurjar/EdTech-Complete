const mongoose = require("mongoose");

const ContactUs_Schema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
        },
        phoneNo: {
            type: Number,
        },
        subject: {
            type: String,
            trim: true,
            require: true,
        },
        message: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ContactUs_Model", ContactUs_Schema);
