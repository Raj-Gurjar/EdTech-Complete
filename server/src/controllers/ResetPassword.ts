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

        const { email } = req.body;
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

        //token generate
        const token = crypto.randomBytes(20).toString("hex");


        //update user by adding token and expire time
        const updatedDetails = await User_Model.findOneAndUpdate(
            { email: email },
            {
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );
        //create url

        const resetPasswordUrl = `${process.env.FRONTENT_URL}/reset-password/${token}`;
        const validityTime = 5;

        // Send mail containing URL
        await mailSender(
            email,
            "Password Reset Link",
            passwordResetEmail(resetPasswordUrl, validityTime)
        );
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

        const { password, confPassword, token } = req.body;

        //validation

        if (password !== confPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        //* Validate password strength
        const { validatePassword } = require("../utils/passwordValidation");
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.errors.join(". "),
            });
        }

        //get user details
        const userDetails = await User_Model.findOne({
            resetPasswordToken: token,
        });


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
        //hash password
        const hashedNewPassword = await bcrypt.hash(password, 10);

        //password update
        await User_Model.findOneAndUpdate(
            { resetPasswordToken: token },
            { password: hashedNewPassword },
            { new: true }
        );

        //send success mail

        //return res
        return res.status(200).json({
            success: true,
            message: "Password reset Successful.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in resetting the password.",
        });
    }
};

