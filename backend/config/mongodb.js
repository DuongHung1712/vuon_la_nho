import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB connection error", { error: err.message });
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB", { error: error.message });
    process.exit(1);
  }
};
export default connectDB;
