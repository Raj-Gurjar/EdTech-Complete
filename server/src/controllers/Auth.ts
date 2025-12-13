import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
const User_Model = require("../models/User.model");
const OTP_Model = require("../models/OTP.model");
const otpGenerator = require("otp-generator");
const Profile_Model = require("../models/Profile.model");
const mailSender = require("../utils/mailSender");

interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        [key: string]: any;
    };
}

//! Send OTP after hitting SignUp submit button and before DB entry to verify email

export const sendOTP = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        //Extract data
        console.log("inside send OTP");
        const { email } = req.body;

        //* Normalize email (lowercase and trim) to ensure consistent matching
        const normalizedEmail = email ? email.toLowerCase().trim() : email;

        //* Checks

        // if Email is already in DB
        const checkUserPresent = await User_Model.findOne({ email: normalizedEmail });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }
        //TODO: Optimize it (generate otp code)(can use other otp generator which only send unique OTPs)
        //* generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("OTP generated :", otp);

        //Check otp is Unique (check in otp model)

        let otpResult = await OTP_Model.findOne({ otp: otp });
        console.log("otpResult..", otpResult);

        while (otpResult) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            otpResult = await OTP_Model.findOne({ otp: otp });
        }

        // Delete any existing OTPs for this email to avoid confusion
        await OTP_Model.deleteMany({ email: normalizedEmail });

        //Insert Unique OTP in DB (use normalized email)
        const otpPayload = { email: normalizedEmail, otp };

        const otpBody = await OTP_Model.create(otpPayload);

        console.log("OTP Body created: ", otpBody);
        console.log("OTP Body ID:", otpBody._id);
        console.log("OTP Body email:", otpBody.email);
        console.log("OTP Body otp:", otpBody.otp);
        console.log("OTP Body createdAt:", otpBody.createdAt);
        
        // Verify OTP was saved by querying it back immediately
        const verifyOtp = await OTP_Model.findById(otpBody._id);
        console.log("OTP verification by ID:", verifyOtp ? "Found" : "NOT FOUND");
        
        const verifyOtpByEmail = await OTP_Model.findOne({ email: normalizedEmail, otp: otp });
        console.log("OTP verification by email+otp:", verifyOtpByEmail ? "Found" : "NOT FOUND");
        
        if (!verifyOtp || !verifyOtpByEmail) {
            console.error("CRITICAL: OTP was created but cannot be found immediately after creation!");
            // Try to find any OTPs for this email
            const allForEmail = await OTP_Model.find({ email: normalizedEmail });
            console.log("All OTPs for email:", allForEmail.length);
        }

        res.status(200).json({
            success: true,
            message: "OTP sent Successfully",
            otp,
        });
    } catch (error: any) {
        console.log("Error in OTP sending :", error);

        return res.status(400).json({
            success: false,
            message: `Error in OTP Sending : ${error.message}`,
        });
    }
};

//! Sign Up
export const signUp = async (req: Request, res: Response): Promise<Response | void> => {
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
            otp,
            adminKey,
        } = req.body;

        //* Normalize email (lowercase and trim) to ensure consistent matching
        const normalizedEmail = email ? email.toLowerCase().trim() : email;

        //! User Validation

        console.log("adminkey back", adminKey);

        //* Check all entries
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp
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

        if (accountType === "Admin") {
            console.log("Admin log");
            if (adminKey !== process.env.ADMIN_SECRET_KEY) {
                return res.status(400).json({
                    success: false,
                    message: "Wrong Admin Secret Key",
                });
            }
        }

        //TODO : Check Valid Email (@gmail, @yahoo, not temp mail)

        //* Check already email exist
        const existingUser = await User_Model.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists.",
            });
        }

        //! Verify OTP

        //* find most recent OTP for user (using normalized email)
        // First try exact match with email and OTP
        let recentOtp = await OTP_Model.findOne({ 
            email: normalizedEmail, 
            otp: otp 
        }).sort({ createdAt: -1 });

        // If not found, try to find by email only (for debugging)
        if (!recentOtp) {
            recentOtp = await OTP_Model.findOne({ email: normalizedEmail })
                .sort({ createdAt: -1 });
        }

        console.log("Recent Otp found:", recentOtp ? "Yes" : "No");
        console.log("Otp entered by user:", otp);
        console.log("Email used for OTP lookup (normalized):", normalizedEmail);
        
        if (recentOtp) {
            console.log("Recent OTP from DB - email:", recentOtp.email, "otp:", recentOtp.otp, "createdAt:", recentOtp.createdAt);
        }

        // //* validate OTP
        if (!recentOtp) {
            // OTP not found - try to find any OTPs for debugging
            const allOtps = await OTP_Model.find({}).sort({ createdAt: -1 }).limit(5);
            console.log("Recent OTPs in DB (last 5):", allOtps.map((o: any) => ({ 
                email: o.email, 
                otp: o.otp, 
                createdAt: o.createdAt 
            })));
            
            // Also check if there are any OTPs for this email with different case
            const caseVariations = await OTP_Model.find({ 
                $or: [
                    { email: normalizedEmail.toLowerCase() },
                    { email: normalizedEmail.toUpperCase() },
                    { email: normalizedEmail }
                ]
            }).sort({ createdAt: -1 });
            console.log("OTPs found with case variations:", caseVariations.length);
            
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired. Please request a new OTP.",
            });
        }
        
        if (otp !== recentOtp.otp) {
            //OTP is invalid
            console.log("OTP mismatch - entered:", otp, "stored:", recentOtp.otp);
            return res.status(400).json({
                success: false,
                message: "Entered OTP is Invalid or not Matched",
            });
        }
        
        // OTP verified successfully - delete it to prevent reuse
        await OTP_Model.deleteOne({ _id: recentOtp._id });
        console.log("OTP verified and deleted");

        //* Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        //! Create entry in DB

        const profileDetails = await Profile_Model.create({});
        const userData = await User_Model.create({
            firstName,
            lastName,
            email: normalizedEmail,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        const user = await User_Model.findById(userData?._id).select(
            "-password"
        );

        if (!user) {
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

export const logIn = async (req: Request, res: Response): Promise<Response | void> => {
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

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };
        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: "2h",
        });
        user.token = token;
        user.password = undefined;

        //! Create-Cookie
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("tokenCookie", token, options);
        return res.status(200).json({
            success: true,
            token,
            user,
            message: "Logged in Successfully",
        });
    } catch (error) {
        console.log("Error in login  :", error);
        return res.status(500).json({
            success: false,
            message: "Login Failed, Please try again",
        });
    }
};

//TODO : Check the code properly
export const changePassword = async (req: AuthRequest, res: Response): Promise<Response | void> => {
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

        // Get user from email or from req.user
        const userEmail = email || req.user?.email;
        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const user = await User_Model.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
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
            { email: userEmail },
            {
                password: hashedNewPassword,
            },
            { new: true }
        );

        //send mail
        await mailSender(
            userEmail,
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

