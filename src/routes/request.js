const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatuses = ["ignored", "interested"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status });
        }
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        });
        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection request already exists" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " sent a connection request to " + toUser.firstName,
            data,
        });

    } catch (err) {
        res.status(400).send("requestRouter Error : " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const allowedStatuses = ["accepted", "rejected"];
        if(!allowedStatuses.includes(req.params.status)){
            return res.status(400).json({ message: "Invalid status type: " + req.params.status });
        }
        const connectionRequest = await ConnectionRequest.findById({
                _id: req.params.requestId,
                toUserId: loggedInUser._id,
                status: "interested"
            });
        
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }
        connectionRequest.status = req.params.status;
        const data = await connectionRequest.save();
        res.json({
            message: loggedInUser.firstName + " " + req.params.status + " the connection request",
            data,
        });
    }catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = requestRouter;