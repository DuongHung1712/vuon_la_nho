import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'Liên hệ'} text2={'với chúng tôi'} />
      </div>
    <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
      <div className='flex flex-col justify-center items-start gap-6'>
        <p className='font-semibold text-xl text-gray-600'>Cửa hàng của chúng tôi </p>
        <p className='text-gray-500'> 401 Lê Lợi, khóm Tân Mỹ, phường Sa Đéc <br /> Tỉnh Đồng Tháp </p>
        <p className='text-gray-500'>SĐT  : 0767925665 <br /> Email: duonghung171204sd@gmail.com</p>

      </div>
    </div>
  </div>
  )
}

export default Contact
