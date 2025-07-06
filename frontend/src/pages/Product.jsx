import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
    <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row '>
      {/*---------- Product Image ----------*/} 
      <div className='flex-1 flex-col-reverse sm:flex-row flex gap-3 '>
        <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
        {
          productData.image.map((item,index) => (
            <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
          ))
        }
        </div>
        <div className='w-full sm:w-[80%] '>
          <img className='w-full h-auto' src={image} alt="" />
        </div>
      </div>
        {/*------- Product Info --------*/}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2 '>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{productData.price}{currency}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8 '>
            <p>Chọn kích thước</p>  
            <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button onClick={()=> setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                ))}
            </div>
              <p>Số lượng:</p>
              <div className='flex items-center '>
              <button
                className='px-4 py-2 hover:bg-gray-100'
                onClick={handleDecrement}
              >
                -
              </button>
              <span className='px-4 py-2'>{quantity}</span>
              <button
                className='px-4 py-2 hover:bg-gray-100'
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>
          <button onClick={() => addToCart(productData._id,size, quantity)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                <p>100% Uy Tín</p>
                <p>Có thể thanh toán khi nhận hàng.</p>
                <p>Dễ dàng đổi trả và hoàn tiền trong vòng 7 ngày.</p>
          </div>
        </div>
    </div>
    {/*-----------Description -----------*/}
    <div className='mt-20'>
      <div className='flex'>
        <b className='border px-5 py-3 text-sm'>Description</b>
        <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
      </div>
      <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
        <p>Website bán cây kiểng lá</p>
      </div>
    </div>
    {/*-----------Related Products -----------*/}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
