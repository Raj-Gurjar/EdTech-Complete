import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
    courseName: string;
    courseDescription?: string;
    instructor: mongoose.Types.ObjectId;
    whatYouWillLearn: string[];
    courseContent: mongoose.Types.ObjectId[];
    ratingAndReviews: mongoose.Types.ObjectId[];
    price: number;
    language: string;
    thumbnail?: string;
    tags?: string[];
    category?: mongoose.Types.ObjectId;
    studentsEnrolled: mongoose.Types.ObjectId[];
    instructions?: string[];
    status: "Draft" | "Published";
    createdAt?: Date;
    updatedAt?: Date;
}

const Course_Schema = new Schema<ICourse>(
    {
        courseName: {
            type: String,
            trim: true,
            required: true,
        },
        courseDescription: {
            type: String,
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_Model",
            required: true,
        },
        whatYouWillLearn: [
            {
                type: String,
                trim: true,
            },
        ],
        courseContent: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Section_Model",
            },
        ],
        ratingAndReviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RatingAndReview_Model",
            },
        ],
        price: {
            type: Number,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        tags: {
            type: [String],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category_Model",
        },
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User_Model",
                required: true,
            },
        ],
        instructions: {
            type: [String],
        },
        status: {
            type: String,
            enum: ["Draft", "Published"],
            default: "Draft",
        },
    },
    {
        timestamps: true,
    }
);

const Course_Model: Model<ICourse> = mongoose.model<ICourse>("Course_Model", Course_Schema);

module.exports = Course_Model;

