import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: "Admin" | "Student" | "Instructor";
    adminKey?: string;
    profileImage?: string;
    additionalDetails: mongoose.Types.ObjectId;
    courses: mongoose.Types.ObjectId[];
    courseProgress: mongoose.Types.ObjectId[];
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const User_Schema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        accountType: {
            type: String,
            enum: ["Admin", "Student", "Instructor"],
            required: true,
        },
        adminKey: {
            type: String,
            default: "None",
        },
        profileImage: {
            type: String,
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile_Model",
            required: true,
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course_Model",
            },
        ],
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CourseProgress_Model",
                required: true,
            },
        ],
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const User_Model: Model<IUser> = mongoose.model<IUser>("User_Model", User_Schema);

module.exports = User_Model;

