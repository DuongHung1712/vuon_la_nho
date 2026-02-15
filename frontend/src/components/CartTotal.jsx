import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Truck, Lightbulb, PartyPopper } from 'lucide-react';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className='w-full'>
      <div className='space-y-3'>
        {/* Subtotal */}
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Tạm tính</span>
          <span className='font-medium text-gray-800'>
            {subtotal.toLocaleString('vi-VN')}{currency}
          </span>
        </div>

        {/* Shipping */}
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600 flex items-center gap-1.5'>
            <Truck className="w-4 h-4 text-primary-500" strokeWidth={1.5} />
            Phí vận chuyển
          </span>
          <span className='font-medium text-gray-800'>
            {subtotal === 0 ? '—' : `${delivery_fee.toLocaleString('vi-VN')}${currency}`}
          </span>
        </div>

        {/* Divider */}
        <div className='border-t border-dashed border-primary-200 my-2' />

        {/* Total */}
        <div className='flex justify-between items-center'>
          <span className='font-semibold text-gray-800'>Tổng cộng</span>
          <span className='text-xl font-bold text-primary-600'>
            {total.toLocaleString('vi-VN')}{currency}
          </span>
        </div>
      </div>

      {/* Free shipping notice */}
      {subtotal > 0 && subtotal < 500000 && (
        <div className='mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200'>
          <p className='text-xs text-amber-700 flex items-center gap-1.5'>
            <Lightbulb className="w-4 h-4" />
            Mua thêm {(500000 - subtotal).toLocaleString('vi-VN')}{currency} để được miễn phí vận chuyển
          </p>
        </div>
      )}

      {subtotal >= 500000 && (
        <div className='mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200'>
          <p className='text-xs text-primary-700 flex items-center gap-1.5'>
            <PartyPopper className="w-4 h-4" />
            Bạn đã đủ điều kiện miễn phí vận chuyển!
          </p>
        </div>
      )}
    </div>
  )
}

export default CartTotal
