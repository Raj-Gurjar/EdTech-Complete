const jwt = require("jsonwebtoken");

require("dotenv").config();

const User_Model = require("../models/User.model");

//! Check Auth

exports.auth = async (req, res, next) => {
    try {
        //extract token

        const token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization").replace("Bearer ", "");

        //if token missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is Missing",
            });
        }

        //verify the token

        try {
            const decodePayload = jwt.verify(token, process.env.JWT_SECRET);

            console.log("Decode payload: ", decodePayload);

            req.user = decodePayload;
        } catch (error) {
            //validation issue
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating Token.",
        });
    }
};

//! Check Student

exports.isStudent = async (req, res, next) => {
    try {
        const role = req.user.accountType;

        if (role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Students only.",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Authz of Student",
        });
    }
};

//! Check Instructor

exports.isStudent = async (req, res, next) => {
    try {
        const role = req.user.accountType;

        if (role !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Instructor only.",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Authz of Instructor",
        });
    }
};

//! Check Admin

exports.isStudent = async (req, res, next) => {
    try {
        const role = req.user.accountType;

        if (role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin only.",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in Authz of Admin",
        });
    }
};
