import React from 'react'
import { Leaf } from 'lucide-react'

const Title = ({ text1, text2 }) => {
  return (
    <div className='inline-flex items-center gap-3'>
      <div className='flex items-center gap-2'>
        {/* Leaf Icon */}
        <Leaf className="w-5 h-5 text-primary-500" strokeWidth={1.5} />

        {/* Text */}
        <h2 className='text-gray-600 font-normal'>
          {text1}{' '}
          <span className='text-primary-700 font-semibold'>{text2}</span>
        </h2>
      </div>

      {/* Decorative Line */}
      <div className='hidden sm:flex items-center gap-1'>
        <span className='w-2 h-2 rounded-full bg-primary-300' />
        <span className='w-8 h-[2px] bg-primary-400' />
      </div>
    </div>
  )
}

export default Title
