const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
        await user.save();
        res.send("User created successfully!");
    } catch (err) {
        
        res.status(400).send("Signup Error : " + err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials!");
        }
        const isPasswordValid = await user.validatePassword(password, user.password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.send("User logged in successfully!");
        }else{
            throw new Error("Invalid Credentials!");
        }
    }catch (err) {
        res.status(400).send("login Error : " + err.message);
    }
});
module.exports = authRouter;








