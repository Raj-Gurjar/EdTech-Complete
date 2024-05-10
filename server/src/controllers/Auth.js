const User_Model = require("../models/User.model");
const OTP_Model = require("../models/OTP.model");
const otpGenerator = require("otp-generator");
const Profile_Model = require("../models/Profile.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
// const cookie = require("cookie-parser");

//! Send OTP after hitting SignUp submit button and before DB entry to verify email

exports.sendOTP = async (req, res) => {
    try {
        //Extract data
        const { email } = req.body;

        //* Checks

        // if Email is already in DB
        const checkUserPresent = await User_Model.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }
        //TODO: Optimize it (generate otp code)(can use other otp generator which only send unique OTPs)
        //* generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("OTP generated :", otp);

        //Check otp is Unique (check in otp model)

        let otpResult = await OTP_Model.findOne({ otp: otp });
        console.log("otpResult..", otpResult);

        while (otpResult) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            otpResult = await OTP_Model.findOne({ otp: otp });
        }

        //Insert Unique OTP in DB
        const otpPayload = { email, otp };

        const otpBody = await OTP_Model.create(otpPayload);

        console.log("OTP Body: ", otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent Successfully",
        });
    } catch (error) {
        console.log("Error in OTP sending :", error);

        return res.status(400).json({
            success: false,
            message: `Error in OTP Sending : ${error.message}`,
        });
    }
};

//! Sign Up
exports.signUp = async (req, res) => {
    try {
        //* Extract data
        console.log("in c");
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            // otp,
        } = req.body;

        //! User Validation

        //* Check all entries
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
            // !otp
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to be filled.",
            });
        }

        //* Check password length and pass and confirm pass
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPasswords doesn't match.",
            });
        }

        //TODO : Check Valid Email (@gmail, @yahoo, not temp mail)

        //* Check already email exist
        const existingUser = await User_Model.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists.",
            });
        }

        // //! Verify OTP

        // //* find most resent OTP for user
        // const recentOtp = await OTP_Model.find({ email })
        //     .sort({ createdAt: -1 })
        //     .limit(1);

        // console.log("Recent Otp :", recentOtp);

        // // //* validate OTP
        // if (recentOtp.length === 0) {
        //     // OTP not found
        //     return res.status(400).json({
        //         success: false,
        //         message: "OTP not found/Entered",
        //     });
        // } else if (otp !== recentOtp.otp) {
        //     //OTP is invalid
        //     return res.status(400).json({
        //         success: false,
        //         message: "Entered OTP is Invalid or not Matched",
        //     });
        // }

        //* Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        //! Create entry in DB

        const profileDetails = await Profile_Model.create({});
        const userData = await User_Model.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}`,
        });

        const user = await User_Model.findById(userData?._id).select(
            "-password"
        );

        if (!user) {
            console.log(error);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //return res
        return res.status(201).json({
            success: true,
            message: "User is Registered Successfully",
            user,
        });

        //!send SignUp Mail to user
    } catch (error) {
        console.log("Error in SignUp", error);

        return res.status(500).json({
            success: false,
            message: "Registration Unsuccessful, Please try Again Later.",
        });
    }
};

//! Log In

exports.logIn = async (req, res) => {
    try {
        //Get data
        console.log("Entering login controller");
        const { email, password } = req.body;

        //! User Validation
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "Enter email and password",
            });
        }
        //can remove populate
        const user = await User_Model.findOne({ email }).populate(
            "additionalDetails"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not Found",
            });
        }

        //! Generate JWT
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({
                success: false,
                message: "Password in incorrect",
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });
        user.token = token;
        user.password = undefined;

        //! Create-Cookie
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        const makeCookie = res.cookie("token", token, options);
        makeCookie.status(200).json({
            success: true,
            token,
            user,
            message: "Logged in Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login Failed, Please try again",
        });
    }
};

//TODO : Check the code properly
exports.changePassword = async (req, res) => {
    try {
        //get data
        const { email, oldPassword, newPassword, confirmNewPassword } =
            req.body;

        //* Validations

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Enter all the fields.",
            });
        }

        //decrypt old password from db
        const isOldPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password
        );
        if (!isOldPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Old Password doesn't match.",
            });
        } else if (newPassword.length < 8) {
            return res.status(401).json({
                success: false,
                message: "Password length must be more than 8 characters",
            });
        }

        //TODO : Add more criteria to password (like caps,num etc)
        else if (newPassword !== confirmNewPassword) {
            return res.status(401).json({
                success: false,
                message: "New Password and Confirm Password doesn't match.",
            });
        }

        //encrypt new Password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        //update password to new password
        const updateUser = await User_Model.findOneAndUpdate(
            { email: email },
            {
                password: hashedNewPassword,
            },
            { new: true }
        );

        //send mail
        await mailSender(
            email,
            "Password Changed",
            "Your password has be updated Successfully."
        );

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
            updateUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error in changing Password`,
        });
    }
};
