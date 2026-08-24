import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    // Use reliable public DNS servers for MongoDB SRV resolution
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    console.log("🔎 Resolving MongoDB DNS...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    console.log("=================================");
    console.log("✅ MongoDB connected successfully");
    console.log(`📦 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log("=================================");

    return conn;
  } catch (error) {
    console.error("=================================");
    console.error("❌ MongoDB connection failed");
    console.error(error.message);
    console.error("=================================");

    throw error;
  }
};

export default connectDB;
