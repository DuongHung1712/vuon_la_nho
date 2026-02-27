import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { Eye, Plus, Star } from 'lucide-react'

const ProductItem = ({ id, image, name, price, rating, reviewCount, sizes }) => {
  const { currency } = useContext(ShopContext);

  const getPriceDisplay = () => {
    if (sizes && sizes.length > 0) {
      const prices = sizes.map(s => s.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return minPrice.toLocaleString('vi-VN');
      }
      return `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')}`;
    }
    return (price || 0).toLocaleString('vi-VN');
  };

  return (
    <Link
      to={`/product/${id}`}
      className='group block bg-white rounded-xl overflow-hidden border border-primary-100 
                 hover:border-primary-300 hover:shadow-lg transition-all duration-300'
    >
      {/* Image Container */}
      <div className='relative aspect-square overflow-hidden bg-primary-50'>
        <img
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
          src={image[0]}
          alt={name}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className='absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300' />

        {/* Quick View Button */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 
                        group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
          <span className='inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-sm 
                           text-primary-700 text-xs font-medium rounded-full shadow-md'>
            <Eye className="w-3.5 h-3.5" strokeWidth={2} />
            Xem chi tiết
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='p-3 sm:p-4'>
        {/* Product Name */}
        <h3 className='text-sm sm:text-base font-medium text-gray-800 line-clamp-2 
                       group-hover:text-primary-700 transition-colors mb-2'>
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className='flex items-center gap-1.5 mb-2'>
            <div className='flex items-center gap-0.5'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className='text-xs text-gray-500'>
              {rating.toFixed(1)} ({reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className='flex items-center justify-between'>
          <span className='text-base sm:text-lg font-semibold text-primary-600'>
            {getPriceDisplay()}{currency}
          </span>

          {/* Add to Cart Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Có thể thêm logic quick add to cart ở đây
            }}
            className='p-2 rounded-full bg-primary-50 text-primary-600 
                       hover:bg-primary-100 hover:text-primary-700 
                       transition-colors opacity-0 group-hover:opacity-100'
            aria-label="Thêm vào giỏ hàng"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
