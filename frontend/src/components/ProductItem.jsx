import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { Eye, Plus, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ProductItem = ({ id, image, name, price, rating, reviewCount, sizes, difficulty, category }) => {
  const { currency } = useContext(ShopContext);
  const { t } = useTranslation();

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
      className='group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 
                 hover:border-primary-200 hover:shadow-xl transition-all duration-500'
    >
      {/* Image Container */}
      <div className='relative aspect-[4/5] overflow-hidden bg-gray-50'>
        <img
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
          src={image[0]}
          alt={name}
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className='absolute top-3 left-3 flex flex-col gap-1.5 text-center'>
          {difficulty && (
            <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md
                             ${difficulty === 'easy' ? 'bg-emerald-500/90 text-white' : 
                                difficulty === 'medium' ? 'bg-amber-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
              {t(`product.difficulty.${difficulty}`, difficulty)}
            </span>
          )}
          {category && (
            <span className='px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-gray-900/60 text-white backdrop-blur-md shadow-sm'>
              {t(`product.${category}`, category)}
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className='absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300' />

        {/* Quick View Button */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 
                        group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
          <span className='inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-sm 
                           text-primary-700 text-xs font-medium rounded-full shadow-md'>
            <Eye className="w-3.5 h-3.5" strokeWidth={2} />
            {t('common.viewDetail', 'Xem chi tiết')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='p-3 sm:p-4 flex-grow flex flex-col'>
        {/* Product Name */}
        <div className='min-h-[2.5rem] sm:min-h-[3rem] mb-2'>
          <h3 className='text-sm sm:text-base font-medium text-gray-800 line-clamp-2 
                         group-hover:text-primary-700 transition-colors'>
            {name}
          </h3>
        </div>

        {/* Rating & Price Container (Pushed to bottom) */}
        <div className='mt-auto'>
          {/* Rating */}
          <div className='min-h-[1.25rem] mb-2'>
            {rating > 0 ? (
              <div className='flex items-center gap-1.5'>
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
                <span className='text-[10px] text-gray-400'>
                  ({reviewCount || 0})
                </span>
              </div>
            ) : (
              <div className='h-4' /> 
            )}
          </div>

          {/* Price */}
          <div className='flex items-center justify-between'>
            <span className='text-base sm:text-lg font-bold text-primary-600'>
              {getPriceDisplay()}{currency}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
