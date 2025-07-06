import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-14 text-sm'> 
        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
                Website Bán Kiểng Lá
            </p>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>Công Ty</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Trang chủ</li>
                <li>Về chúng tôi</li>
                <li>Vận chuyển</li>
                <li>Chính sách riêng tư</li>
            </ul>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>Liên hệ với chúng tôi</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+84767925665</li>
                <li>22520501@gm.uit.edu.vn</li>
            </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@UniversityofInformationTechnology.</p>
      </div>
    </div>
  )
}

export default Footer
