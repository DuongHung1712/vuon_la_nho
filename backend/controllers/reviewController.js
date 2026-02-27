import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Add a review
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.body.userId;

    // Validate input
    if (!productId || !rating || !comment) {
      return res.json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Đánh giá phải từ 1 đến 5 sao",
      });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    // Get user info
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await reviewModel.findOne({ productId, userId });
    if (existingReview) {
      return res.json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    // Create review
    const review = new reviewModel({
      productId,
      userId,
      rating: Number(rating),
      comment: comment.trim(),
      userName: user.name,
      userAvatar: user.avatar || "",
    });

    await review.save();

    // Update product rating statistics
    await updateProductRating(productId);

    res.json({
      success: true,
      message: "Đánh giá thành công",
      review,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    const reviews = await reviewModel
      .find({ productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await reviewModel.countDocuments({ productId });

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasMore: skip + reviews.length < totalReviews,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;
    const userId = req.body.userId;

    if (!reviewId || !rating || !comment) {
      return res.json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Đánh giá phải từ 1 đến 5 sao",
      });
    }

    // Find review and check ownership
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.json({
        success: false,
        message: "Đánh giá không tồn tại",
      });
    }

    if (review.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa đánh giá này",
      });
    }

    // Update review
    review.rating = Number(rating);
    review.comment = comment.trim();
    await review.save();

    // Update product rating statistics
    await updateProductRating(review.productId);

    res.json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      review,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const userId = req.body.userId;

    if (!reviewId) {
      return res.json({
        success: false,
        message: "Review ID is required",
      });
    }

    // Find review and check ownership
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      return res.json({
        success: false,
        message: "Đánh giá không tồn tại",
      });
    }

    if (review.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: "Bạn không có quyền xóa đánh giá này",
      });
    }

    const productId = review.productId;
    await reviewModel.findByIdAndDelete(reviewId);

    // Update product rating statistics
    await updateProductRating(productId);

    res.json({
      success: true,
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user has reviewed a product
const checkUserReview = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.body.userId;

    if (!productId) {
      return res.json({
        success: false,
        message: "Product ID is required",
      });
    }

    const review = await reviewModel.findOne({ productId, userId });

    res.json({
      success: true,
      hasReviewed: !!review,
      review: review || null,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await reviewModel.find({ productId });

    if (reviews.length === 0) {
      await productModel.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await productModel.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
};

export {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  checkUserReview,
};
