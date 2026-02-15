import React, { useContext, useEffect, useState, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, Package, Truck, RotateCcw, Leaf } from 'lucide-react'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const cartData = useMemo(() => {
    const tempData = [];
    if (products.length > 0) {
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempData.push({
              _id: itemId,
              size: size,
              quantity: cartItems[itemId][size]
            })
          }
        }
      }
    }
    return tempData;
  }, [cartItems, products]);

  const handleQuantityChange = (itemId, size, value) => {
    const numValue = Number(value);
    if (value === '' || numValue < 1) return;
    updateQuantity(itemId, numValue, size);
  };

  return (
    <div className='py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Title text1={'Giỏ Hàng'} text2={'của bạn'} />
        <p className='text-sm text-gray-500 mt-1'>
          {cartData.length} sản phẩm trong giỏ hàng
        </p>
      </div>

      {cartData.length > 0 ? (
        <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-8'>
            <div className='bg-white rounded-xl border border-primary-100 overflow-hidden'>
              {/* Table Header - Desktop */}
              <div className='hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 bg-primary-50/50 border-b border-primary-100 text-sm font-medium text-gray-600'>
                <div className='col-span-6'>Sản phẩm</div>
                <div className='col-span-2 text-center'>Số lượng</div>
                <div className='col-span-3 text-right'>Thành tiền</div>
                <div className='col-span-1'></div>
              </div>

              {/* Cart Items List */}
              <div className='divide-y divide-primary-100'>
                {cartData.map((item, index) => {
                  const productData = products.find((product) => product._id === item._id);
                  if (!productData) return null;

                  const itemTotal = productData.price * item.quantity;

                  return (
                    <div
                      key={index}
                      className='p-4 sm:p-5 sm:grid sm:grid-cols-12 gap-4 items-center hover:bg-primary-50/30 transition-colors'
                    >
                      {/* Product Info */}
                      <div className='sm:col-span-6 flex items-start gap-4 mb-4 sm:mb-0'>
                        <img
                          className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-primary-100 flex-shrink-0'
                          src={productData.image[0]}
                          alt={productData.name}
                        />
                        <div className='min-w-0'>
                          <h3 className='font-medium text-gray-800 line-clamp-2 mb-1'>
                            {productData.name}
                          </h3>
                          <p className='text-primary-600 font-semibold text-sm sm:text-base'>
                            {productData.price.toLocaleString('vi-VN')}{currency}
                          </p>
                          <span className='inline-flex items-center mt-2 px-2.5 py-1 bg-secondary-50 text-secondary-700 text-xs font-medium rounded-md border border-secondary-200'>
                            <Leaf className="w-3 h-3 mr-1" /> {item.size}
                          </span>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className='sm:col-span-2 flex items-center justify-between sm:justify-center gap-2 mb-4 sm:mb-0'>
                        <span className='sm:hidden text-sm text-gray-500'>Số lượng:</span>
                        <div className='flex items-center border border-primary-200 rounded-lg overflow-hidden'>
                          <button
                            onClick={() => item.quantity > 1 && updateQuantity(item._id, item.quantity - 1, item.size)}
                            className='w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-primary-50 transition-colors'
                          >
                            <Minus className="w-3 h-3" strokeWidth={2.5} />
                          </button>
                          <input
                            key={item.quantity}
                            onBlur={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleQuantityChange(item._id, item.size, e.target.value);
                              }
                            }}
                            className='w-12 h-8 text-center border-x border-primary-200 text-sm font-medium focus:outline-none focus:bg-primary-50 no-spinner'
                            type="number"
                            min={1}
                            defaultValue={item.quantity}
                          />
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1, item.size)}
                            className='w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-primary-50 transition-colors'
                          >
                            <Plus className="w-3 h-3" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className='sm:col-span-3 flex items-center justify-between sm:justify-end mb-4 sm:mb-0'>
                        <span className='sm:hidden text-sm text-gray-500'>Thành tiền:</span>
                        <span className='font-semibold text-gray-800'>
                          {itemTotal.toLocaleString('vi-VN')}{currency}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <div className='sm:col-span-1 flex justify-end'>
                        <button
                          onClick={() => updateQuantity(item._id, 0, item.size)}
                          className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className='mt-4'>
              <button
                onClick={() => navigate('/collection')}
                className='inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors'
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Tiếp tục mua sắm
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className='lg:col-span-4 mt-8 lg:mt-0'>
            <div className='sticky top-4'>
              <div className='bg-white rounded-xl border border-primary-100 p-5'>
                <h3 className='font-semibold text-gray-800 mb-4 pb-4 border-b border-primary-100'>
                  Tóm tắt đơn hàng
                </h3>
                <CartTotal />
                <button
                  onClick={() => navigate('/place-order')}
                  className='w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                  Tiến hành thanh toán
                </button>
              </div>

              {/* Trust Badges */}
              <div className='mt-4 bg-primary-50/50 rounded-xl border border-primary-100 p-4'>
                <div className='flex items-center gap-3 text-sm text-gray-600'>
                  <Package className='w-5 h-5 text-primary-500' strokeWidth={1.5} />
                  <span>Cây được đóng gói cẩn thận</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-gray-600 mt-3'>
                  <Truck className='w-5 h-5 text-primary-500' strokeWidth={1.5} />
                  <span>Giao hàng toàn quốc</span>
                </div>
                <div className='flex items-center gap-3 text-sm text-gray-600 mt-3'>
                  <RotateCcw className='w-5 h-5 text-primary-500' strokeWidth={1.5} />
                  <span>Đổi trả trong 7 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart */
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='w-32 h-32 mb-6 text-primary-200'>
            <ShoppingCart className="w-full h-full" strokeWidth={0.5} />
          </div>
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>
            Giỏ hàng trống
          </h3>
          <p className='text-gray-500 mb-6 max-w-sm'>
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập cây cảnh tuyệt đẹp của chúng tôi!
          </p>
          <button
            onClick={() => navigate('/collection')}
            className='px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2'
          >
            <Leaf /> Khám phá sản phẩm
          </button>
        </div>
      )}
    </div>
  )
}

export default Cart
