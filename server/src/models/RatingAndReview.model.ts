import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRatingAndReview extends Document {
    user: mongoose.Types.ObjectId;
    rating: number;
    review?: string;
    course: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const RatingAndReview_Schema = new Schema<IRatingAndReview>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User_Model",
            require: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            trim: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course_Model",
            index: true,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

const RatingAndReview_Model: Model<IRatingAndReview> = mongoose.model<IRatingAndReview>(
    "RatingAndReview_Model",
    RatingAndReview_Schema
);

module.exports = RatingAndReview_Model;

