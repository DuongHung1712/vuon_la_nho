import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400 '>
      {/* Left side of the hero section */}
      <div className='w-full sm:w-1/2 flex flex-col items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141]'>
            <div className='flex items-center gap-2'>
                <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                <p className='font-medium text-sm md:text-base'>Sản Phẩm Bán Chạy của chúng tôi</p>
            </div>
            <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Sản phảm mới nhất</h1>   
            <div className='flex items-center gap-2'>
             <p className='font-semibold text-sm md:textbase'>Bỏ vào giỏ ngay</p>
             <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
            </div>
        </div>
      </div>
        {/* Right side of the hero section */}
        <img className='w-full sm:w-1/2' src={assets.hero_img} alt="" />

    </div>
  )
}

export default Hero
