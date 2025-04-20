const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    //read the token from the req cookies
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid token");
        }
        const decodedObj = await jwt.verify(token, "SecretKey");
        //validate the token
        const { _id } = decodedObj;
        console.log("Decoded ID:", _id);
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("User Auth Error : " + err.message);

    }
    // if valid, get the userId from the token and set it in the req object
};

module.exports = {
    userAuth
};