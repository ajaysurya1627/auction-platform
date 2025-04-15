const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://eajaysurya2013:DwctNyr15vQgrh7J@cluster0.rttpdrq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your actual connection string

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected ");
    } catch (err) {
        console.error("MongoDB Connection Failed ", err);
        process.exit(1);
    }
};

module.exports = connectDB;
