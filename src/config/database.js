const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://ksange0301:oaSh0k9wn0MDoJmZ@cluster0.se6glrp.mongodb.net/devTinder"
    );
}


module.exports = connectDB;