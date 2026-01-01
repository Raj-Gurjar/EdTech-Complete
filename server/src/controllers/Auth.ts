import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
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
        // Generate access token (short-lived)
        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: "2h",
        });
        
        // Generate refresh token (long-lived, stored in httpOnly cookie)
        const refreshToken = jwt.sign(payload, jwtSecret, {
            expiresIn: "7d",
        });
        user.token = token;
        user.password = undefined;

        //! Create-Cookie for refresh token
        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
            sameSite: "strict" as const,
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        
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

//! Google Authentication
export const googleAuth = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        console.log("Entering Google auth controller");
        const { access_token, user: googleUserInfo } = req.body;

        // Validate input
        if (!access_token || !googleUserInfo) {
            return res.status(400).json({
                success: false,
                message: "Access token and user information are required",
            });
        }

        // Verify the access token with Google and check it was issued to our app
        let verifiedUserInfo;
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        
        try {
            // First, verify the token and check the audience (client ID)
            if (googleClientId) {
                const tokenInfoResponse = await axios.get(
                    `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`
                );
                const tokenInfo = tokenInfoResponse.data;
                
                // Verify the token was issued to our client ID
                if (tokenInfo.audience !== googleClientId && tokenInfo.aud !== googleClientId) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid Google access token - token not issued for this application",
                    });
                }
            }
            
            // Get user info from Google
            const googleResponse = await axios.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            verifiedUserInfo = googleResponse.data;
        } catch (error: any) {
            console.log("Error verifying Google token:", error);
            return res.status(401).json({
                success: false,
                message: error.response?.data?.error_description || "Invalid Google access token",
            });
        }

        // Normalize email
        const normalizedEmail = verifiedUserInfo.email?.toLowerCase().trim();
        
        if (!normalizedEmail) {
            return res.status(400).json({
                success: false,
                message: "Email not found in Google account",
            });
        }

        // Extract user information
        const firstName = googleUserInfo.given_name || verifiedUserInfo.given_name || "User";
        const lastName = googleUserInfo.family_name || verifiedUserInfo.family_name || "";
        const profileImage = googleUserInfo.picture || verifiedUserInfo.picture || 
            `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`;

        // Check if user already exists
        let user = await User_Model.findOne({ email: normalizedEmail }).populate(
            "additionalDetails"
        );

        if (user) {
            // User exists - log them in
            console.log("Existing user found, logging in");

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_SECRET is not defined");
            }

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            // Generate access token
            const token = jwt.sign(payload, jwtSecret, {
                expiresIn: "2h",
            });

            // Generate refresh token
            const refreshToken = jwt.sign(payload, jwtSecret, {
                expiresIn: "7d",
            });

            // Update profile image if it's different and from Google
            if (profileImage && profileImage !== user.profileImage && profileImage.includes("googleusercontent")) {
                user.profileImage = profileImage;
                await user.save();
            }

            user.token = token;
            user.password = undefined;

            // Set refresh token cookie
            const cookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict" as const,
            };
            res.cookie("refreshToken", refreshToken, cookieOptions);

            return res.status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully with Google",
            });
        } else {
            // User doesn't exist - create new user
            console.log("New user, creating account");

            // Generate a random password for Google-authenticated users
            // They won't need it since they use Google to login
            const randomPassword = Math.random().toString(36).slice(-12) + 
                                 Math.random().toString(36).slice(-12) + 
                                 "!@#";
            const hashedPassword = await bcrypt.hash(randomPassword, 12);

            // Create profile details
            const profileDetails = await Profile_Model.create({});

            // Create user with default accountType as "Student"
            const userData = await User_Model.create({
                firstName,
                lastName,
                email: normalizedEmail,
                password: hashedPassword,
                accountType: "Student", // Default to Student for Google sign-ups
                additionalDetails: profileDetails._id,
                profileImage,
            });

            user = await User_Model.findById(userData._id)
                .select("-password")
                .populate("additionalDetails");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found after creation",
                });
            }

            // Generate JWT tokens
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

            const refreshToken = jwt.sign(payload, jwtSecret, {
                expiresIn: "7d",
            });

            user.token = token;

            // Set refresh token cookie
            const cookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict" as const,
            };
            res.cookie("refreshToken", refreshToken, cookieOptions);

            return res.status(201).json({
                success: true,
                token,
                user,
                message: "Account created and logged in successfully with Google",
            });
        }
    } catch (error) {
        console.log("Error in Google auth:", error);
        return res.status(500).json({
            success: false,
            message: "Google authentication failed, please try again",
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

//! Refresh Token
export const refreshToken = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies?.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is missing",
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        // Verify refresh token
        let decoded: any;
        try {
            decoded = jwt.verify(refreshToken, jwtSecret);
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token has expired. Please login again.",
                });
            }
            throw error;
        }

        // Get user from database
        const user = await User_Model.findById(decoded.id).populate("additionalDetails");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate new access token
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };
        
        const newToken = jwt.sign(payload, jwtSecret, {
            expiresIn: "2h",
        });

        return res.status(200).json({
            success: true,
            token: newToken,
            message: "Token refreshed successfully",
        });
    } catch (error) {
        console.log("Error in refresh token:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to refresh token",
        });
    }
};

