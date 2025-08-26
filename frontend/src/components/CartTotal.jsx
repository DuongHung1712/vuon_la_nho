import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
    const {currency, delivery_fee,getCartAmount} = useContext(ShopContext);

  return (
    <div className='w-full'> 
      <div className='text-2xl'>
        <Title text1={'Tổng'} text2={'Đơn Hàng'}/>
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
              <p>Tổng</p>
              <p>{getCartAmount().toLocaleString('vi-VN')}{currency}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Phí Vận Chuyển</p>
                <p>{delivery_fee.toLocaleString('vi-VN')}{currency}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee).toLocaleString('vi-VN')}{currency}</b>

            </div>
      </div>
    </div>
  )
}

export default CartTotal
