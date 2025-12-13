import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    description?: string;
    courses: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const Category_Schema = new Schema<ICategory>(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course_Model",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Category_Model: Model<ICategory> = mongoose.model<ICategory>("Category_Model", Category_Schema);

module.exports = Category_Model;

