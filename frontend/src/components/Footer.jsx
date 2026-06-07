import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='border-t border-gray-100 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='mx-auto my-10 mt-14 grid max-w-7xl gap-10 text-sm sm:gap-12 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full max-w-md text-gray-600'>Website Bán Kiểng Lá</p>
        </div>

        <div>
          <p className='mb-5 text-xl font-medium'>Công Ty</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Trang chủ</li>
            <li>Về chúng tôi</li>
            <li>Vận chuyển</li>
            <li>Chính sách riêng tư</li>
          </ul>
        </div>

        <div className='md:col-span-2 xl:col-span-1'>
          <p className='mb-5 text-xl font-medium'>Liên hệ với chúng tôi</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+84767925665</li>
            <li>22520501@gm.uit.edu.vn</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-center text-xs text-gray-500 sm:text-sm'>
          Copyright 2025@UniversityofInformationTechnology.
        </p>
      </div>
    </footer>
  )
}

export default Footer
