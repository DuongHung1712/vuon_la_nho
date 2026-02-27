import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import ReviewList from '../components/ReviewList';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import { ProductSchema, BreadcrumbSchema } from '../components/StructuredData';
import { Star, Minus, Plus, ShoppingCart, Leaf, CheckCircle, CreditCard, RotateCcw } from 'lucide-react'

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedPrice, setSelectedPrice] = useState(0);

  const productData = useMemo(() => {
    return products.find((item) => item._id === productId);
  }, [products, productId]);

  useEffect(() => {
    if (productData) {
      setImage(productData.image[0]);
      setSize('');
      setQuantity(1);
      
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedPrice(0); 
      } else if (productData.price) {
        setSelectedPrice(productData.price);
      }
    }
  }, [productData]);

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => q > 1 ? q - 1 : 1);

  const handleSizeSelect = (sizeItem) => {
    if (typeof sizeItem === 'object') {
      setSize(sizeItem.name);
      setSelectedPrice(sizeItem.price);
    } else {
      setSize(sizeItem);
      setSelectedPrice(productData.price);
    }
  };

  const getPriceDisplay = () => {
    if (productData.sizes && productData.sizes.length > 0) {
      if (selectedPrice > 0) {
        return selectedPrice.toLocaleString('vi-VN');
      }
      const prices = productData.sizes.map(s => s.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return minPrice.toLocaleString('vi-VN');
      }
      return `${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')}`;
    }
    return (productData.price || 0).toLocaleString('vi-VN');
  };

  const getSizesArray = () => {
    if (productData.sizes && productData.sizes.length > 0) {
      return productData.sizes;
    }
    if (productData.size && productData.size.length > 0) {
      return productData.size.map(s => ({ name: s, price: productData.price }));
    }
    return [];
  };

  if (!productData) {
    return <Loading />;
  }

  const breadcrumbItems = [
    { name: 'Trang chủ', url: '/' },
    { name: 'Bộ sưu tập', url: '/collection' },
    { name: productData.name, url: `/product/${productData._id}` }
  ];

  return (
    <div className='py-8'>
      <SEO 
        title={`${productData.name} - Vườn Lá Nhỏ | Cây Cảnh Chất Lượng`}
        description={productData.description || `Mua ${productData.name} giá tốt tại Vườn Lá Nhỏ. ${productData.category === 'indoor' ? 'Cây trong nhà' : 'Cây ngoài trời'} dễ chăm sóc, giao hàng nhanh chóng.`}
        keywords={`${productData.name}, cây cảnh ${productData.category === 'indoor' ? 'trong nhà' : 'ngoài trời'}, mua ${productData.name}, giá ${productData.name}`}
        ogImage={productData.image[0]}
        ogType="product"
      />
      <ProductSchema product={productData} currency={currency} />
      <BreadcrumbSchema items={breadcrumbItems} />
      {/* Main Product Section */}
      <div className='lg:grid lg:grid-cols-2 lg:gap-12'>
        {/* Product Images */}
        <div className='mb-8 lg:mb-0'>
          {/* Main Image */}
          <div className='relative aspect-square bg-primary-50 rounded-2xl overflow-hidden border border-primary-100 mb-4'>
            <img
              className='w-full h-full object-cover'
              src={image}
              alt={productData.name}
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className='flex gap-3 overflow-x-auto pb-2'>
            {productData.image.map((item, index) => (
              <button
                key={index}
                onClick={() => setImage(item)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                  ${item === image
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-primary-100 hover:border-primary-300'
                  }`}
              >
                <img
                  src={item}
                  alt={`${productData.name} ${index + 1}`}
                  className='w-full h-full object-cover'
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {/* Category Badge */}
          <div className='flex items-center gap-2 mb-3'>
            <span className='inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200'>
              <Leaf className="w-4 h-4 text-green-500 inline mr-1" /> {productData.category === 'indoor' ? 'Cây trong nhà' : 'Cây ngoài trời'}
            </span>
          </div>

          {/* Product Name */}
          <h1 className='text-2xl sm:text-3xl font-semibold text-gray-800 mb-3'>
            {productData.name}
          </h1>

          {/* Rating */}
          <div className='flex items-center gap-2 mb-4'>
            <div className='flex items-center gap-0.5'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(productData.rating || 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className='text-sm font-medium text-gray-700'>
              {productData.rating ? productData.rating.toFixed(1) : '0.0'}
            </span>
            <span className='text-sm text-gray-500'>
              ({productData.reviewCount || 0} đánh giá)
            </span>
          </div>

          {/* Price */}
          <div className='mb-6'>
            <span className='text-3xl sm:text-4xl font-bold text-primary-600'>
              {getPriceDisplay()}{currency}
            </span>
            {productData.sizes && productData.sizes.length > 0 && selectedPrice === 0 && (
              <p className='text-sm text-gray-500 mt-1'>Chọn kích thước để xem giá chính xác</p>
            )}
          </div>

          {/* Description */}
          <p className='text-gray-600 leading-relaxed mb-8'>
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Chọn kích thước
            </label>
            <div className='flex flex-wrap gap-2'>
              {getSizesArray().map((item, index) => {
                const isObject = typeof item === 'object';
                const itemName = isObject ? item.name : item;
                const itemPrice = isObject ? item.price : productData.price;
                const isSelected = size === itemName;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSizeSelect(item)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      isSelected
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-primary-200 hover:border-primary-400'
                    }`}
                  >
                    <div className='flex flex-col items-center gap-0.5'>
                      <span>{itemName}</span>
                      {isObject && (
                        <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-primary-600'}`}>
                          {itemPrice.toLocaleString('vi-VN')}{currency}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className='mb-8'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Số lượng
            </label>
            <div className='inline-flex items-center border border-primary-200 rounded-lg overflow-hidden'>
              <button
                onClick={handleDecrement}
                className='w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-primary-50 transition-colors'
              >
                <Minus className="w-5 h-5" strokeWidth={2} />
              </button>
              <span className='w-16 h-12 flex items-center justify-center font-semibold text-lg border-x border-primary-200'>
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className='w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-primary-50 transition-colors'
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(productData._id, quantity, size)}
            className='w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 mb-8'
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={2} />
            Thêm vào giỏ hàng
          </button>

          {/* Trust Badges */}
          <div className='bg-primary-50/50 rounded-xl border border-primary-100 p-4 space-y-3'>
            <div className='flex items-center gap-3 text-sm text-gray-600'>
              <CheckCircle className="w-5 h-5 text-primary-500" strokeWidth={1.5} />
              <span>100% cam kết cây khỏe mạnh</span>
            </div>
            <div className='flex items-center gap-3 text-sm text-gray-600'>
              <CreditCard className="w-5 h-5 text-primary-500" strokeWidth={1.5} />
              <span>Thanh toán khi nhận hàng (COD)</span>
            </div>
            <div className='flex items-center gap-3 text-sm text-gray-600'>
              <RotateCcw className="w-5 h-5 text-primary-500" strokeWidth={1.5} />
              <span>Đổi trả miễn phí trong 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className='mt-12 sm:mt-16'>
        <div className='border-b border-primary-100 overflow-x-auto'>
          <div className='flex gap-1 min-w-max'>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'description'
                  ? 'text-primary-700 border-b-2 border-primary-500 bg-primary-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mô tả chi tiết
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'text-primary-700 border-b-2 border-primary-500 bg-primary-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đánh giá ({productData.reviewCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'care'
                  ? 'text-primary-700 border-b-2 border-primary-500 bg-primary-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Hướng dẫn chăm sóc
            </button>
          </div>
        </div>

        <div className='py-6 sm:py-8'>
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className='text-gray-600 leading-relaxed'>
              <div className='prose max-w-none'>
                <p>
                  {productData.description || 'Cây cảnh được chọn lọc kỹ lưỡng từ các vườn ươm uy tín, đảm bảo cây khỏe mạnh và phát triển tốt khi đến tay bạn.'}
                </p>

                <div className='mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {productData.difficulty && (
                    <div className='bg-white p-4 rounded-lg border border-primary-100'>
                      <span className='text-xs text-gray-500 block mb-1'>Độ khó chăm sóc</span>
                      <span className='font-medium text-gray-800'>
                        {productData.difficulty === 'easy' ? 'Dễ' : productData.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                      </span>
                    </div>
                  )}
                  {productData.light && (
                    <div className='bg-white p-4 rounded-lg border border-primary-100'>
                      <span className='text-xs text-gray-500 block mb-1'>Ánh sáng</span>
                      <span className='font-medium text-gray-800'>
                        {productData.light === 'low' ? 'Ít ánh sáng' : productData.light === 'medium' ? 'Ánh sáng vừa' : 'Nhiều ánh sáng'}
                      </span>
                    </div>
                  )}
                  <div className='bg-white p-4 rounded-lg border border-primary-100'>
                    <span className='text-xs text-gray-500 block mb-1'>Loại cây</span>
                    <span className='font-medium text-gray-800'>
                      {productData.category === 'indoor' ? 'Cây trong nhà' : 'Cây ngoài trời'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <ReviewList productId={productId} />
          )}

          {/* Care Guide Tab */}
          {activeTab === 'care' && (
            <div className='text-gray-600 leading-relaxed'>
              <div className='prose max-w-none'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Hướng dẫn chăm sóc</h3>
                <div className='space-y-4'>
                  <div className='bg-white p-5 rounded-xl border border-primary-100'>
                    <h4 className='font-semibold text-gray-800 mb-2'>💧 Tưới nước</h4>
                    <p className='text-sm'>
                      Tưới nước đều đặn khi thấy đất khô. Tránh tưới quá nhiều nước gây úng rễ.
                    </p>
                  </div>
                  <div className='bg-white p-5 rounded-xl border border-primary-100'>
                    <h4 className='font-semibold text-gray-800 mb-2'>☀️ Ánh sáng</h4>
                    <p className='text-sm'>
                      {productData.light === 'low'
                        ? 'Đặt cây ở nơi có ánh sáng gián tiếp, tránh ánh nắng trực tiếp.'
                        : productData.light === 'medium'
                        ? 'Đặt cây ở nơi có ánh sáng vừa phải, có thể tiếp xúc với ánh nắng nhẹ buổi sáng.'
                        : 'Cây cần nhiều ánh sáng, có thể đặt ngoài trời hoặc gần cửa sổ.'}
                    </p>
                  </div>
                  <div className='bg-white p-5 rounded-xl border border-primary-100'>
                    <h4 className='font-semibold text-gray-800 mb-2'>🌡️ Nhiệt độ</h4>
                    <p className='text-sm'>
                      Nhiệt độ lý tưởng từ 18-25°C. Tránh đặt cây ở nơi có gió lạnh hoặc điều hòa thổi trực tiếp.
                    </p>
                  </div>
                  <div className='bg-white p-5 rounded-xl border border-primary-100'>
                    <h4 className='font-semibold text-gray-800 mb-2'>🌱 Bón phân</h4>
                    <p className='text-sm'>
                      Bón phân hữu cơ 1-2 tháng/lần trong mùa sinh trưởng (mùa xuân - hè).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className='mt-12'>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </div>
  );
}

export default Product
