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
                <p className='font-medium text-sm md:text-base '>Khám phá thế giới cây cảnh</p>
            </div>
            <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Sản phẩm mới nhất</h1>   
            <div className='flex items-center gap-2'>
            <a href="aisuggest">
              <button  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 rounded-md px-6 has-[>svg]:px-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle h-4 w-4 mr-2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
               <span>Tư vấn AI ngay</span>
             </button>
            </a>
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
