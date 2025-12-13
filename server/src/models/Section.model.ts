import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISection extends Document {
    sectionName?: string;
    shortDescription?: string;
    longDescription?: string;
    subSections: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const Section_Schema = new Schema<ISection>(
    {
        sectionName: {
            type: String,
            trim: true,
        },
        shortDescription: {
            type: String,
            default: "short description",
            trim: true,
            // required: true,
        },
        longDescription: {
            type: String,
            default: "long description",
        },
        subSections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubSection_Model",
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Section_Model: Model<ISection> = mongoose.model<ISection>("Section_Model", Section_Schema);

module.exports = Section_Model;

