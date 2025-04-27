const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI; // Load the MongoDB URI from environment variables
        if (!uri) {
            throw new Error("MongoDB connection string (MONGODB_URI) is missing in environment variables");
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        throw err; // Re-throw the error to be caught in app.js
    }
};

module.exports = connectDB;