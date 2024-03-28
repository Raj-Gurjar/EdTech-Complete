const User_Model = require("../models/User.model");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

//! sends url with token to email to reset password
exports.resetPasswordToken = async (req, res) => {
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
            return res.status(400).json({
                success: false,
                message: "User not found !!",
            });
        }

        console.log("User exists");

        //token generate
        const newPasswordResetToken = crypto.randomBytes(20).toString("hex");

        console.log("New token..", newPasswordResetToken);

        //update user by adding token and expire time
        const updatedDetails = await User_Model.findOneAndUpdate(
            { email: email },
            {
                resetPasswordToken: newPasswordResetToken,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );
        console.log("Updated Details ..", updatedDetails);
        //create url
        const resetPasswordUrl = `https://localhost:3000/update-password/${newPasswordResetToken}`;

        console.log("reset password url", resetPasswordUrl);
        //send mail containing url
        await mailSender(
            email,
            "Password Reset Link",
            `Here is your Password Reset Link : ${resetPasswordUrl} \n and the link will expire after ${Date.now() + 5 * 6 * 1000}`
        );
        console.log("Main sent");
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

exports.resetPassword = async (req, res) => {
    try {
        //get data

        const { password, confirmPassword, newPasswordResetToken } = req.body;

        //validation

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be greater than 8 characters.",
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        //get user details
        const userDetails = await User_Model.findOne({
            resetPasswordToken: newPasswordResetToken,
        });

        //if no entry - invalid token
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Token is invalid/not matched",
            });
        }

        //check token expire time
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token is expired, please regenerate it.",
            });
        }

        //hash password
        const hashedNewPassword = await bcrypt.hash(password, 12);

        //password update
        await User_Model.findByIdAndUpdate(
            { resetPasswordToken: newPasswordResetToken },
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
