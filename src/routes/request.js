const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    console.log("Route hit with params:", req.params);
    console.log("Authenticated user:", req.user);
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatuses = ["ignored", "interested"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }
const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
            {fromUserId: toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
            ],  
        });
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        console.log(data)
        res.json({
            message: "Connection request sent successfully!",
            data,
        });
    } catch (err) {
        res.status(400).send("requestRouter Error : " + err.message);
    }
});

module.exports = requestRouter;