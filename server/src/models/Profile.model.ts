import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfile extends Document {
    gender?: "Male" | "Female" | "Other";
    dateOfBirth?: Date;
    about?: string;
    contactNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const Profile_Schema = new Schema<IProfile>(
    {
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        dateOfBirth: {
            type: Date,
            default: new Date("1990-01-01"),
        },
        about: {
            type: String,
            default: "Not Mentioned",
            trim: true,
        },
        contactNumber: {
            type: String,
            default: "0000000000",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Profile_Model: Model<IProfile> = mongoose.model<IProfile>("Profile_Model", Profile_Schema);

module.exports = Profile_Model;

