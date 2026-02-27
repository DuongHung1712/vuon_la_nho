import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import diseaseRouter from "./routes/diseaseRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import { config } from "dotenv";
import passport from "passport";
import LocalStratery from "passport-local";
// APP Config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/disease-detection", diseaseRouter);
app.use("/api/review", reviewRouter);
app.get("/", (req, res) => {
  res.send("API Working");
});

// Connect to database and start server
connectDB()
  .then(() => {
    connectCloudinary();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });
