require('dotenv').config();
const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const port = 7777;
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const authRouter = require("./routes/auth.js");
const requestRouter = require("./routes/request.js");
const profileRouter = require("./routes/profile.js");
const userRouter = require("./routes/user");


app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);


connectDB()
.then(() => {
    console.log("Database connected successfully!");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process with failure
});