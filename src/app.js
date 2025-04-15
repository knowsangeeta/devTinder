const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const port = 7777;
const User = require("./models/user.js");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

    try {
        // Validation of data
        validateSignUpData(req);
        const { firstName, lastName, email, password } = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        //   Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added successfully!");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials!!");
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            //create a jwt token
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });


            //add the token to cookie ans send responnse backk to user
            res.cookie("token", token);
            res.send("Login Successful!!!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    console.log("Sending connection request to user");

    res.send(user.firstName + " sent connection req");

})

app.patch("/user/:userId", async (req, res) => {
    const data = req.body;
    const userId = req.params?.userId;

    try {
        const AllowedUpdates = ["photoUrl", "about", "gender", "age", "skills", "password"];
        const isUpdateValid = Object.keys(data).every((update) => AllowedUpdates.includes(update));
        if (!isUpdateValid) {
            return res.status(400).json({ message: "Invalid updates" });
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: 'before' }, { runValidators: true });
        console.log(user);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("UPDATE FAILED:" + err.message);
    }
})
connectDB().then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
).catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
});
