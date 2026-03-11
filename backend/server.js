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
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import logger from "./config/logger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

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
      process.env.ADMIN_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use("/api/", limiter);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      },
    );
  });
  next();
});

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

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
connectDB()
  .then(() => {
    connectCloudinary();
    app.listen(port, () => {
      logger.info(`Server started on port ${port}`, {
        env: process.env.NODE_ENV || "development",
      });
    });
  })
  .catch((error) => {
    logger.error("Failed to start server:", { error: error.message });
    process.exit(1);
  });
