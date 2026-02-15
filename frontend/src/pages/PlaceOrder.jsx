import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const {navigate,backendUrl,token,cartItems,refetchCart,getCartAmount, delivery_fee,products} = useContext(ShopContext);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      phone: ''
    }
  });

  const onSubmit = async (formData) => {
      try {
          let orderItems = []
          for(const items in cartItems){
            for (const item in cartItems[items]){
              if (cartItems[items][item] > 0) {
                const itemInfo = structuredClone(products.find(product => product._id == items))
                if (itemInfo) {
                  itemInfo.quantity = cartItems[items][item]
                  orderItems.push(itemInfo)
                }
                
              }
            }
          }
          
          let orderData = {
            address:  formData,
            items: orderItems,
            amount: getCartAmount() + delivery_fee
          }
          switch(method) {
            // API Calls for COD
            case 'cod':
              const response = await axios.post(backendUrl + '/api/order/place',orderData,{headers:{token}})
              console.log
              if (response.data.success){
                await refetchCart()
                navigate('/orders')
              }else{
                toast.error(response.data.message)
              }
              break;
              default:
                break;
          }
      } catch (error) {
          console.log(error)
          toast.error(error.message)
      }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* ----------Left Side ------------*/}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl  sm:text-2xl my-3'>
            <Title text1={'Thông tin'} text2={'vận chuyển'}/>
        </div>
        
        <div className='flex gap-3'>
          <div className='w-full'>
            <Label htmlFor="firstName">Họ</Label>
            <Input 
              id="firstName"
              {...register('firstName', { 
                required: 'Vui lòng nhập họ',
                minLength: { value: 2, message: 'Họ phải có ít nhất 2 ký tự' }
              })}
              placeholder='Họ' 
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          <div className='w-full'>
            <Label htmlFor="lastName">Tên</Label>
            <Input 
              id="lastName"
              {...register('lastName', { 
                required: 'Vui lòng nhập tên',
                minLength: { value: 2, message: 'Tên phải có ít nhất 2 ký tự' }
              })}
              placeholder='Tên' 
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            {...register('email', { 
              required: 'Vui lòng nhập email',
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ' 
              }
            })}
            placeholder='Địa chỉ Email' 
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="street">Địa chỉ</Label>
          <Input 
            id="street"
            {...register('street', { 
              required: 'Vui lòng nhập địa chỉ',
              minLength: { value: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự' }
            })}
            placeholder='Địa chỉ' 
          />
          {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
        </div>

        <div className='flex gap-3'>
          <div className='w-full'>
            <Label htmlFor="city">Phường</Label>
            <Input 
              id="city"
              {...register('city', { required: 'Vui lòng nhập phường' })}
              placeholder='Phường' 
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
          </div>

          <div className='w-full'>
            <Label htmlFor="state">Tỉnh</Label>
            <Input 
              id="state"
              {...register('state', { required: 'Vui lòng nhập tỉnh' })}
              placeholder='Tỉnh' 
            />
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
          </div>
        </div>

        <div className='flex gap-3'>
          <div className='w-full'>
            <Label htmlFor="zipcode">Zipcode</Label>
            <Input 
              id="zipcode"
              type="number"
              {...register('zipcode', { required: 'Vui lòng nhập zipcode' })}
              placeholder='Zipcode' 
            />
            {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>}
          </div>

          <div className='w-full'>
            <Label htmlFor="country">Quốc gia</Label>
            <Input 
              id="country"
              {...register('country', { required: 'Vui lòng nhập quốc gia' })}
              placeholder='Quốc gia' 
            />
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input 
            id="phone"
            type="tel"
            {...register('phone', { 
              required: 'Vui lòng nhập số điện thoại',
              pattern: { 
                value: /^[0-9]{10,11}$/,
                message: 'Số điện thoại phải có 10-11 chữ số' 
              }
            })}
            placeholder='Số điện thoại' 
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
      </div>
      {/* ----------Right Side ------------*/}
      <div className='mt-8'>
          <div className='mt-8 min-w-80'>
              <CartTotal/>
          </div>
          <div className='mt-8'>
            <Title text1={'PHƯƠNG THỨC'} text2={'THANH TOÁN'}/>
            {/* Payment Method */}
            <div className='flex gap-3 flex-col lg:flex-row'>
              {/*
                <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-primary-400' : ''}`}></p>                 
                <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                </div>
              
              <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                 <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-primary-400' : ''}`}></p>
                 <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
              </div>
              */}
              <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                 <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-primary-400' : ''}`}></p>
                 <p className='text-gray-500 text-sm font-medium mx-4'>Thanh Toán Khi Nhận Hàng</p>
              </div>
            </div>
            <div className='w-full text-end mt-8'> 
              <Button 
                type='submit'  
                disabled={isSubmitting}
                className='px-16 py-3 text-sm'
              >
                {isSubmitting ? (
                  <>
                    <span>Đang xử lý...</span>
                    <div className="flex gap-1 ml-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </>
                ) : 'Đặt Hàng'}
              </Button>
            </div>
          </div>
      </div>
    </form>
  )

}

export default PlaceOrder
