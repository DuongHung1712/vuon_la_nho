import express from "express";
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  checkUserReview,
} from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();

// Protected routes (require authentication)
reviewRouter.post("/add", authUser, addReview);
reviewRouter.post("/update", authUser, updateReview);
reviewRouter.post("/delete", authUser, deleteReview);
reviewRouter.post("/check", authUser, checkUserReview);

// Public routes
reviewRouter.post("/list", getProductReviews);

export default reviewRouter;
