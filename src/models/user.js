const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address "+ value);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("password not strong: "+ value);
            }
        },
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: {
            values: ["Female","Male","Others"],
            message: "{VALUE} is not a valid gender type. ",
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo url: "+ value);
            }
        },
    },
    about:{
        type: String,
        default: "Hey there! I am using DevT.",
    },
    skills:{
        type: [String],
    },
});

userSchema.methods.getJWT = async function () {
    const user = this;
  
    const token = await jwt.sign({ _id: user._id }, "SecretKey", {
      expiresIn: "7d",
    });
  
    return token;
  };
  
  userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
  
    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      passwordHash
    );
  
    return isPasswordValid;
  };

const User = mongoose.model('User', userSchema);//name User in capital to show that it is model

module.exports = User;