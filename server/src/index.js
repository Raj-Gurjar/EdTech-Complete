require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();

const PORT = process.env.PORT || 4003;

app.use(express.json());
app.use(cors(
  {
    origin: ["*"],
    methods: ["POST", "GET","PUT","DELETE"],
    credentials: true
  }
));

app.use("/api/v1/auth", require("./routes/auth"));


app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});

app.get('/', (req, res) => {
  res.send('Welcome to EdTech Server');
});

const dbConnect = require("./config/database");
dbConnect();
