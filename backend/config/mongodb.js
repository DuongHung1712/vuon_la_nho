import mongoose, { mongo } from "mongoose";
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error:", err);
  });

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/vuonlanho`, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};
export default connectDB;
