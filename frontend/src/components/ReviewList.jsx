import React, { useState, useContext } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import Loading from './Loading';
import {
  useProductReviews,
  useCheckUserReview,
  useAddReview,
  useUpdateReview,
  useDeleteReview,
} from '../hooks/useApi';
import { ShopContext } from '../context/ShopContext';

const ReviewList = ({ productId }) => {
  const { token, navigate } = useContext(ShopContext);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const { data: reviewData, isLoading } = useProductReviews(productId, page, 10);
  const { data: userReviewData } = useCheckUserReview(productId);
  const addReviewMutation = useAddReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const reviews = reviewData?.reviews || [];
  const pagination = reviewData?.pagination || {};
  const hasReviewed = userReviewData?.hasReviewed || false;
  const userReview = userReviewData?.review || null;

  const handleAddReview = ({ rating, comment }) => {
    if (!token) {
      navigate('/login');
      return;
    }

    addReviewMutation.mutate(
      { productId, rating, comment },
      {
        onSuccess: () => {
          setShowForm(false);
        },
      }
    );
  };

  const handleUpdateReview = ({ rating, comment }) => {
    if (!editingReview) return;

    updateReviewMutation.mutate(
      { reviewId: editingReview._id, rating, comment },
      {
        onSuccess: () => {
          setEditingReview(null);
          setShowForm(false);
        },
      }
    );
  };

  const handleDeleteReview = (reviewId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    deleteReviewMutation.mutate(reviewId);
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const handleWriteReview = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setShowForm(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      {/* Header with stats */}
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
          <MessageSquare className='w-5 h-5 text-primary-500' />
          Đánh giá khách hàng ({pagination.totalReviews || 0})
        </h3>

        {/* Write Review Button */}
        {!hasReviewed && !showForm && (
          <button
            onClick={handleWriteReview}
            className='px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm flex items-center gap-2'
          >
            <Star className='w-4 h-4' />
            Viết đánh giá
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          onSubmit={editingReview ? handleUpdateReview : handleAddReview}
          onCancel={handleCancelForm}
          initialData={editingReview}
          isSubmitting={addReviewMutation.isPending || updateReviewMutation.isPending}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-xl border border-gray-100'>
          <MessageSquare className='w-12 h-12 text-gray-300 mx-auto mb-3' />
          <p className='text-gray-500'>Chưa có đánh giá nào</p>
          <p className='text-sm text-gray-400 mt-1'>Hãy là người đầu tiên đánh giá sản phẩm này</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              isOwner={userReview?._id === review._id}
              onEdit={() => handleEditClick(review)}
              onDelete={() => handleDeleteReview(review._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 pt-4'>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className='px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            Trước
          </button>
          <span className='text-sm text-gray-600'>
            Trang {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className='px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
