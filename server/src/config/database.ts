import "dotenv/config";
import mongoose from "mongoose";

const dbConnect = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(mongoUri, {});
        console.log("DB connected successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("DB connection error:", errorMessage);
        process.exit(1);
    }
};

module.exports = dbConnect;

