const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create an Auction
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, description, startingPrice, endTime } = req.body;

        if (!title || !description || !startingPrice || !endTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newAuction = new Auction({
            title,
            description,
            startingPrice,
            currentPrice: startingPrice,
            seller: req.user.userId,
            endTime
        });

        await newAuction.save();
        res.status(201).json({ message: "Auction created successfully", auction: newAuction });
    } catch (error) {
        res.status(500).json({ message: "Error creating auction", error: error.message });
    }
});

// ✅ Get All Auctions
router.get("/", async (req, res) => {
    try {
        const auctions = await Auction.find().populate("seller", "username email");
        res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching auctions", error: error.message });
    }
});

// ✅ Get Auction by ID
router.get("/:id", async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id).populate("seller", "username email");
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        res.status(200).json(auction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching auction", error: error.message });
    }
});

// ✅ Delete Auction (Only Seller Can Delete)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) return res.status(404).json({ message: "Auction not found" });

        if (auction.seller.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to delete this auction" });
        }

        await auction.deleteOne();
        res.status(200).json({ message: "Auction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting auction", error: error.message });
    }
});

// ✅ Place a Bid (with Expiry Check)
router.post("/:id/bid", authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        const auctionId = req.params.id;
        const userId = req.user.userId;

        // Validate bid amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid bid amount" });
        }

        const auction = await Auction.findById(req.params.id.trim());
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        // Check if auction has ended
        const now = new Date();
        if (new Date(auction.endTime) < now) {
            auction.status = "expired"; // Update status in DB
            await auction.save();
            return res.status(400).json({ message: "Auction has ended. No more bids allowed." });
        }

        if (amount <= auction.currentPrice) {
            return res.status(400).json({ message: "Bid must be higher than the current price" });
        }

        // Update auction with new bid
        auction.bids.push({ bidder: userId, amount });
        auction.currentPrice = amount;
        auction.highestBidder = userId;
        await auction.save();

        res.status(200).json({ message: "Bid placed successfully", auction });
    } catch (error) {
        res.status(500).json({ message: "Error placing bid", error: error.message });
    }
});


module.exports = router;
