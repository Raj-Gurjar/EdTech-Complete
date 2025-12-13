import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubSection extends Document {
    title?: string;
    timeDuration?: string;
    description?: string;
    videoUrl?: string;
    additionalUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const SubSection_Schema = new Schema<ISubSection>(
    {
        title: {
            type: String,
            trim: true,
        },
        timeDuration: {
            type: String,
        },
        description: {
            type: String,
            trim: true,
        },
        videoUrl: {
            type: String,
        },
        additionalUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const SubSection_Model: Model<ISubSection> = mongoose.model<ISubSection>("SubSection_Model", SubSection_Schema);

module.exports = SubSection_Model;

