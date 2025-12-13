import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourseProgress extends Document {
    courseID?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    completedVideos: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const CourseProgress_Schema = new Schema<ICourseProgress>(
    {
        courseID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course_Model",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        completedVideos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubSection_Model",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const CourseProgress_Model: Model<ICourseProgress> = mongoose.model<ICourseProgress>(
    "CourseProgress_Model",
    CourseProgress_Schema
);

module.exports = CourseProgress_Model;

