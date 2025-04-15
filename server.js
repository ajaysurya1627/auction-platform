const connectDB = require("./config"); // Import MongoDB connection
const express = require("express");

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Auction Platform! ");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
