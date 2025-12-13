import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
const { passwordResetEmail } = require("../mail/passwordRestEmail");
const User_Model = require("../models/User.model");
const mailSender = require("../utils/mailSender");

//! sends url with token to email to reset password
export const resetPasswordToken = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        //get data
        console.log("reset pass");

        const { email } = req.body;
        console.log("email", email);
        //verify email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Enter the Email",
            });
        }

        const existingUser = await User_Model.findOne({ email: email });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found !!",
            });
        }

        console.log("User exists");

        //token generate
        const token = crypto.randomBytes(20).toString("hex");

        console.log("New token..", token);

        //update user by adding token and expire time
        const updatedDetails = await User_Model.findOneAndUpdate(
            { email: email },
            {
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );
        console.log("Updated Details ..", updatedDetails);
        //create url

        const resetPasswordUrl = `${process.env.FRONTEND_LOCAL_HOST_3000}/reset-password/${token}`;
        const validityTime = 5; // 5 minutes

        console.log("reset password url", resetPasswordUrl);

        // Send mail containing URL
        await mailSender(
            email,
            "Password Reset Link",
            passwordResetEmail(resetPasswordUrl, validityTime)
        );
        console.log("Mail sent");
        //return res
        return res.status(200).json({
            success: true,
            message: "Reset Password Mail Sent Successfully.",
            updatedDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in sending mail to reset password",
        });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        //get data

        console.log("in reset pass");

        const { password, confPassword, token } = req.body;

        console.log("reqb", req.body);

        console.log("tt", token);
        //validation

        if (password.length < 1) {
            return res.status(400).json({
                success: false,
                message: "Password must be greater than 8 characters.",
            });
        } else if (password !== confPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }
        console.log("c0");

        //get user details
        const userDetails = await User_Model.findOne({
            resetPasswordToken: token,
        });

        console.log("c1");

        //if no entry - invalid token
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Link is invalid/not matched/expired",
            });
        }

        //check token expire time
        if (userDetails.resetPasswordExpires && userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Link is expired, please regenerate it.",
            });
        }
        console.log("c2");
        //hash password
        const hashedNewPassword = await bcrypt.hash(password, 10);

        console.log("c3");
        //password update
        await User_Model.findOneAndUpdate(
            { resetPasswordToken: token },
            { password: hashedNewPassword },
            { new: true }
        );

        console.log("c4");

        //send success mail

        //return res
        return res.status(200).json({
            success: true,
            message: "Password reset Successful.",
        });
    } catch (error) {
        console.log("Error in resetting the password", error);
        return res.status(500).json({
            success: false,
            message: "Error in resetting the password.",
        });
    }
};

