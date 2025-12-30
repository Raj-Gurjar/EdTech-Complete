import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const dbConnect = require("./config/database");

const app = express();

const PORT: number = parseInt(process.env.PORT || "4002", 10);

app.use(express.json());
app.use(cookieParser());

// CORS configuration - allow only frontend and localhost:3000
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3000/",
    process.env.FRONTEND_URL || "",
].filter(Boolean); // Remove empty strings

// Log allowed origins for debugging
console.log("Allowed CORS origins:", allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, or curl requests)
        if (!origin) {
            console.log("Request with no origin - allowing");
            return callback(null, true);
        }
        
        // Remove trailing slash for comparison
        const normalizedOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;
        
        // Check if origin is in allowed list
        const isAllowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.endsWith("/") ? allowed.slice(0, -1) : allowed;
            return normalizedOrigin === normalizedAllowed;
        });
        
        if (isAllowed) {
            console.log(`CORS: Allowing origin ${origin}`);
            callback(null, true);
        } else {
            console.log(`CORS: Blocking origin ${origin}. Allowed origins:`, allowedOrigins);
            callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
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
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log("Server is listening on port " + PORT);
    });
}

// Export app for Vercel serverless functions
export default app;

