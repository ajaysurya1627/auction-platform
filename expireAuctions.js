const mongoose = require("mongoose");
const Auction = require("./models/Auction");
const connectDB = require("./config");

// Connect to database
connectDB();

const expireAuctions = async () => {
    try {
        const now = new Date();
        const expiredAuctions = await Auction.updateMany(
            { endTime: { $lt: now }, status: "active" },
            { $set: { status: "expired" } }
        );

        console.log(`✅ Expired ${expiredAuctions.modifiedCount} auctions`);
        process.exit();
    } catch (error) {
        console.error("❌ Error expiring auctions:", error);
        process.exit(1);
    }
};

// Run the function
const cron = require("node-cron");
const expireAuctions = require("./expireAuctions");

// Run the job every minute
cron.schedule("* * * * *", () => {
    console.log("🔄 Checking for expired auctions...");
    expireAuctions();
});
