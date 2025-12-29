import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
const dbConnect = require("./config/database");

const app = express();

const PORT: number = parseInt(process.env.PORT || "4003", 10);

app.use(express.json());

// CORS configuration - allow only frontend and localhost:3000
const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "",
].filter(Boolean); // Remove empty strings

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/category", require("./routes/category"));
app.use("/api/v1/course", require("./routes/course"));
app.use("/api/v1/profile", require("./routes/profile"));
app.use("/api/v1/course", require("./routes/section"));
app.use("/api/v1/course", require("./routes/subSection"));
app.use("/api/v1/payment", require("./routes/payment"));
app.use("/api/v1/course", require("./routes/ratings"));
app.use("/api/v1/reach", require("./routes/contact"));

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to EdTech Server");
});

// Connect to database
dbConnect();

// Only start server if not in Vercel environment
if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log("Server is listening on port " + PORT);
    });
}

// Export app for Vercel serverless functions
export default app;

