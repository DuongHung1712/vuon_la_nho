import React from 'react'
import { RefreshCw, ShieldCheck, Headphones } from 'lucide-react'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      <div>
        <RefreshCw className='w-12 h-12 m-auto mb-5 text-primary-500' strokeWidth={1.5} />
        <p className='font-semibold'>Chính sách đổi trả dễ dàng</p>
        <p className='text-gray-400'>Chúng tôi cung cấp chính sách đổi trả dễ dàng</p>
      </div>
      <div>
        <ShieldCheck className='w-12 h-12 m-auto mb-5 text-primary-500' strokeWidth={1.5} />
        <p className='font-semibold'>Chính sách đổi trả 7 ngày</p>
        <p className='text-gray-400'>Chúng tôi cung cấp chính sách 7 ngày đổi trả miễn phí</p>
      </div>
      <div>
        <Headphones className='w-12 h-12 m-auto mb-5 text-primary-500' strokeWidth={1.5} />
        <p className='font-semibold'>Hỗ trợ khách hàng tốt nhất</p>
        <p className='text-gray-400'>Chúng tôi hỗ trợ khách hàng 24/7</p>
      </div>
    </div>
  )
}

export default OurPolicy
