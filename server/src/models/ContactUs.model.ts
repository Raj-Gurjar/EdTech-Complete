import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactUs extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo?: string;
    subject: string;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ContactUs_Schema = new Schema<IContactUs>(
    {
        firstName: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
        },
        phoneNo: {
            type: String,
        },
        subject: {
            type: String,
            trim: true,
            require: true,
        },
        message: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

const ContactUs_Model: Model<IContactUs> = mongoose.model<IContactUs>("ContactUs_Model", ContactUs_Schema);

module.exports = ContactUs_Model;

