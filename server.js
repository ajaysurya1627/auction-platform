const connectDB = require("./config"); // Import MongoDB connection
const express = require("express");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON (should be before routes)
app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to the Auction Platform! ");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
