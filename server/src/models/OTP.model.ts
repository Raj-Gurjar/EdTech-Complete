import mongoose, { Schema, Document, Model } from "mongoose";
const mailSender = require("../utils/mailSender");
import { otpVerificationEmail } from "../mail/OTPVerification";

export interface IOTP extends Document {
    email: string;
    otp: string;
    createdAt?: Date;
}

//!function to send email
async function sendVerificationEmail(email: string, otp: string): Promise<void> {
    try {
        const emailContent = otpVerificationEmail(otp);
        const mailResponse = await mailSender(
            email,
            "Verification Email from EdTech",
            emailContent
        );

        console.log("Mail Response in OTP-schema", mailResponse);
    } catch (error) {
        console.log("Error in sending Verification Email", error);
        throw error;
    }
}

const OTP_Schema = new Schema<IOTP>({
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

OTP_Schema.pre("save", async function (next) {
    try {
        await sendVerificationEmail(this.email, this.otp);
        next();
    } catch (error) {
        console.log("Error in pre-save hook for OTP:", error);
        // Don't prevent save if email fails - OTP should still be saved
        next();
    }
});

const OTP_Model: Model<IOTP> = mongoose.model<IOTP>("OTP_Model", OTP_Schema);

module.exports = OTP_Model;

