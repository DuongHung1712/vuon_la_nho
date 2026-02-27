import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // One review per user per product

const reviewModel =
  mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
