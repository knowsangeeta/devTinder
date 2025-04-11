const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const port = 7777;
const User = require("./models/user.js");


app.post("/signup", async(req, res) => {
    const userObject = {
        firstName: "Sangeeta",
        lastName: "K",
        email: "sgeet@gmail.com",
        password: "geet123",
    }
    const user = new User(userObject);
    await user.save().then(() => {
        console.log("User saved successfully");
        res.status(200).json({ message: "User saved successfully" });
    }).catch((err) => {
        console.error("Error saving user", err);
        res.status(500).json({ message: "Error saving user" });
    });
});

connectDB().then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
).catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
});
