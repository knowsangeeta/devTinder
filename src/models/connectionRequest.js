const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignored","interested", "accepted", "rejected"],
            message: "{VALUE} is incorrect. ",
        },
        required: true,
    },
},
{
    timestamps: true,
}
);

connectionRequestSchema.pre("save", function (next) {  
    const connectionRequest = this;
    //check if from and to user are same
    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error("cannot send connection request to self");
    }
    next();

})
const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;