const mongoose = require("mongoose");
require("dotenv").config();

// Works with MongoDB Atlas (mongodb+srv://...) or a local/self-hosted
// MongoDB instance - just point MONGODB_URI at whichever you're using.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sims";

// Serverless-safe connection caching.
// On Vercel, each request can hit a fresh (or a reused "warm") function
// instance - there's no long-lived process like there is on Render/Railway.
// Without caching, a fresh mongoose.connect() on every cold start (or worse,
// every request) quickly exhausts Atlas's connection limit. Stashing the
// connection promise on `global` lets a warm instance reuse it instead of
// reconnecting. This is a no-op in normal long-running environments (local
// dev, Render) - it just connects once, same as before.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((m) => {
        console.log("MongoDB connected:", m.connection.name);
        return m;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("MongoDB connection failed:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = { connectDB, mongoose };