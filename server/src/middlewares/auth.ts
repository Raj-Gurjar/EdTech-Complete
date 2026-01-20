import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

const User_Model = require("../models/User.model");

// Extend Express Request to include user
interface AuthRequest extends Request {
    user?: {
        id: string;
        accountType: string;
        email?: string;
        [key: string]: any;
    };
}

//! Check Auth
export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        //extract token

        const authHeader = req.header("Authorization");
        const token = req.body.token || (authHeader ? authHeader.replace("Bearer ", "") : null);

        //if token missing
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token is Missing",
            });
            return;
        }

        //verify the token
        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_SECRET is not defined");
            }

            const decodePayload = jwt.verify(token, jwtSecret) as {
                id: string;
                accountType: string;
                email?: string;
                [key: string]: any;
            };

            req.user = decodePayload;
        } catch (error: any) {
            //validation issue
            
            // Check if token is expired
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({
                    success: false,
                    message: "Token has expired. Please login again.",
                    code: "TOKEN_EXPIRED",
                });
                return;
            }
            
            // Check if token is invalid format
            if (error.name === 'JsonWebTokenError') {
                res.status(401).json({
                    success: false,
                    message: "Token is invalid or malformed",
                    code: "TOKEN_INVALID",
                });
                return;
            }
            
            res.status(401).json({
                success: false,
                message: "Token is invalid",
                code: "TOKEN_ERROR",
            });
            return;
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Something went wrong while validating Token.",
        });
    }
};

//! Check Student
export const isStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const role = req.user.accountType;

        if (role !== "Student") {
            res.status(401).json({
                success: false,
                message: "This is protected route for Students only.",
            });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Authz of Student",
        });
    }
};

//! Check Instructor
export const isInstructor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const role = req.user.accountType;

        if (role !== "Instructor") {
            res.status(401).json({
                success: false,
                message: "This is protected route for Instructor only.",
            });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Authz of Instructor",
        });
    }
};

//! Check Admin
export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const role = req.user.accountType;

        if (role !== "Admin") {
            res.status(401).json({
                success: false,
                message: "This is protected route for Admin only.",
            });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in Authz of Admin",
        });
    }
};

