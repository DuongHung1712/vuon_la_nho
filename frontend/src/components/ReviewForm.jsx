import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

const ReviewForm = ({ onSubmit, onCancel, initialData = null, isSubmitting = false }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialData?.comment || '');

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setComment(initialData.comment);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Vui lòng chọn số sao');
      return;
    }
    if (!comment.trim()) {
      alert('Vui lòng nhập đánh giá');
      return;
    }
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <div className='bg-white p-6 rounded-xl border border-primary-100 shadow-sm'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {initialData ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Star Rating */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Đánh giá của bạn
          </label>
          <div className='flex items-center gap-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type='button'
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className='transition-transform hover:scale-110'
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className='ml-2 text-sm text-gray-600'>
                {rating === 1 && 'Rất tệ'}
                {rating === 2 && 'Tệ'}
                {rating === 3 && 'Bình thường'}
                {rating === 4 && 'Tốt'}
                {rating === 5 && 'Tuyệt vời'}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Nhận xét của bạn
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Chia sẻ trải nghiệm của bạn về sản phẩm này...'
            rows={5}
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none'
            disabled={isSubmitting}
          />
          <p className='text-xs text-gray-500 mt-1'>
            {comment.length} ký tự
          </p>
        </div>

        {/* Buttons */}
        <div className='flex items-center gap-3 pt-2'>
          <button
            type='submit'
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className='flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Đang gửi...' : initialData ? 'Cập nhật' : 'Gửi đánh giá'}
          </button>
          {onCancel && (
            <button
              type='button'
              onClick={onCancel}
              disabled={isSubmitting}
              className='px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
