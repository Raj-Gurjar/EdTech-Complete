import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
const dbConnect = require("./config/database");

const app = express();

const PORT: number = parseInt(process.env.PORT || "4003", 10);

app.use(express.json());
app.use("*", cors());

// app.use(cors(
//   {
//     origin: ["https://mini-loan-webapp.vercel.app", "https://mini-loan-app-bkd.vercel.app","http://localhost:3000"],
//     methods: ["POST", "GET","PUT","DELETE"],
//     credentials: true
//   }
// ));

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/category", require("./routes/category"));
app.use("/api/v1/course", require("./routes/course"));
app.use("/api/v1/profile", require("./routes/profile"));
app.use("/api/v1/course", require("./routes/section"));
app.use("/api/v1/course", require("./routes/subSection"));
app.use("/api/v1/payment", require("./routes/payment"));
app.use("/api/v1/course", require("./routes/ratings"));
app.use("/api/v1/reach", require("./routes/contact"));

app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to EdTech Server");
});

dbConnect();

