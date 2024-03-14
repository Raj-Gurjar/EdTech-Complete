const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTP_Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    },
});

//!function to send email

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email from EdTech",
            otp
        );

        console.log("Mail Response in OTP-schema", mailResponse);
    } catch (error) {
        console.log("Error in sending Verification Email", error);
        throw error;
    }
}

OTP_Schema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("OTP_Schema", OTP_Schema);
