const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired"], default: "active" }, // Added status
    bids: [
        {
            bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            amount: { type: Number, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("Auction", auctionSchema);
