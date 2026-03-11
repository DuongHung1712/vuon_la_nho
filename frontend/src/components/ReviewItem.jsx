import React from 'react';
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const ReviewItem = ({ review, onEdit, onDelete, isOwner }) => {
  const renderStars = (rating) => {
    return (
      <div className='flex items-center gap-0.5'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className='bg-white p-5 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors'>
      <div className='flex items-start gap-4'>
        {/* Avatar */}
        <div className='flex-shrink-0'>
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className='w-12 h-12 rounded-full object-cover border-2 border-primary-100'
            />
          ) : (
            <div className='w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center border-2 border-primary-100'>
              <User className='w-6 h-6 text-primary-400' />
            </div>
          )}
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-3 mb-2'>
            <div>
              <h4 className='font-semibold text-gray-900'>{review.userName}</h4>
              <div className='flex items-center gap-2 mt-1'>
                {renderStars(review.rating)}
                <span className='text-xs text-gray-400'>•</span>
                <span className='text-xs text-gray-500'>{getTimeAgo(review.createdAt)}</span>
              </div>
            </div>

            {/* Action buttons for owner */}
            {isOwner && (
              <div className='flex items-center gap-2'>
                <button
                  onClick={onEdit}
                  className='text-xs text-primary-600 hover:text-primary-700 font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors'
                >
                  Sửa
                </button>
                <button
                  onClick={onDelete}
                  className='text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors'
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          {/* Comment */}
          <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
