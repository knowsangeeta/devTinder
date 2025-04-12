const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const port = 7777;
const User = require("./models/user.js");

app.use(express.json());

app.post("/signup", async(req, res) => {
    
    const user = new User(req.body);
    console.log(user);
    await user.save().then(() => {
        console.log("User saved successfully");
        res.status(200).json({ message: "User saved successfully" });
    }).catch((err) => {
        console.error("Error saving user", err);
        res.status(500).json({ message: "Error saving user" });
    });
});

app.get("/user", async(req, res) => {
    const userEmail = req.body.email;
    try{
        const user = await User.find({ email: userEmail });
        if(user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(user);
    } catch(err) {
        console.error("Error fetching user", err);
        res.status(400).json({ message: "Error fetching user" });
    }

})
app.get("/feed", async(req, res) => {
    const userEmail = req.body.email;
    try{
        const user = await User.find({});
        if(user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(user);
    } catch(err) {
        console.error("Error fetching user", err);
        res.status(400).json({ message: "Error fetching user" });
    }

})
app.delete("/user", async(req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id: userId});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send("User deleted successfully");
    } catch(err) {
        console.error("Error fetching user", err);
        res.status(400).json({ message: "Error fetching user" });
    }

})
app.delete("/userbyEmail", async(req, res) => {
    const userEmail = req.body.email;
    try{
        const user = await User.findOneAndDelete({email:userEmail});
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send("User deleted successfully");
    } catch(err) {
        console.error("Error fetching user", err);
        res.status(400).json({ message: "Error fetching user" });
    }

})
app.patch("/user", async(req, res) => {
    const data   = req.body;
    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndUpdate({_id: userId},data,{returnDocument: 'before'});
        console.log(user);
        res.send("User updated successfully");
    }catch(err){
        
        res.status(400).json({ message: "Error updating user" });
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
