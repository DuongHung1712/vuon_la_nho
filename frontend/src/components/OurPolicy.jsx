import React from 'react'
import { RefreshCw, ShieldCheck, Headphones } from 'lucide-react'

const OurPolicy = () => {
  return (
    <section className='py-12 sm:py-16 md:py-20'>
      <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
        <div className='page-surface-card text-center text-sm text-gray-700'>
          <RefreshCw className='m-auto mb-5 h-12 w-12 text-primary-500' strokeWidth={1.5} />
          <p className='font-semibold'>Chính sách đổi trả dễ dàng</p>
          <p className='mt-2 text-gray-500'>Chúng tôi cung cấp chính sách đổi trả dễ dàng</p>
        </div>
        <div className='page-surface-card text-center text-sm text-gray-700'>
          <ShieldCheck className='m-auto mb-5 h-12 w-12 text-primary-500' strokeWidth={1.5} />
          <p className='font-semibold'>Chính sách đổi trả 7 ngày</p>
          <p className='mt-2 text-gray-500'>Chúng tôi cung cấp chính sách 7 ngày đổi trả miễn phí</p>
        </div>
        <div className='page-surface-card text-center text-sm text-gray-700 sm:col-span-2 xl:col-span-1'>
          <Headphones className='m-auto mb-5 h-12 w-12 text-primary-500' strokeWidth={1.5} />
          <p className='font-semibold'>Hỗ trợ khách hàng tốt nhất</p>
          <p className='mt-2 text-gray-500'>Chúng tôi hỗ trợ khách hàng 24/7</p>
        </div>
      </div>
    </section>
  )
}

export default OurPolicy
