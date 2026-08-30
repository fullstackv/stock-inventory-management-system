const mongoose = require("mongoose");
require("dotenv").config();

// Works with MongoDB Atlas (mongodb+srv://...) or a local/self-hosted
// MongoDB instance - just point MONGODB_URI at whichever you're using.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sims";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };
