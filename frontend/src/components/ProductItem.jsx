import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
const ProductItem = ({ id, image, name, price }) => {

  const { currency } = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out w-full h-64 object-cover rounded-t-lg' src={image[0]} alt="" />
      </div >
      <div className='flex justify-between items-start mb-2'>
      <p className='pt-3 pb-1 text-sm font-semibold'>{name}</p>
      <div className='flex items-center justify-between '>
        {/* <svg className='pt-3 pb-1' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star h-4 w-4 text-yellow-400 fill-current"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
        <span className="text-sm text-gray-600 ml-1 pt-3 pb-1">4.8</span> */}
      </div>
      </div>


      <div>
      <span className='text-sm font-medium'>{(price).toLocaleString('vi-VN')}{currency}</span>
      </div>
    </Link>
  )
}

export default ProductItem
