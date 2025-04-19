const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const port = 7777;
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth.js");
const requestRouter = require("./routes/request.js");
const profileRouter = require("./routes/profile.js");


app.use("/auth", authRouter);
app.use("/request", requestRouter);
app.use("/profile", profileRouter);


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