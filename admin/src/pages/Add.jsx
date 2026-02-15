import React from 'react'
import { assets } from '../assets/assets'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAddProduct, useUpdateProduct } from '../hooks/useApi'
import { useForm } from 'react-hook-form'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const Add = ({token}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const editProduct = location.state?.product 
  const isEditMode = !!editProduct

  const addProductMutation = useAddProduct()
  const updateProductMutation = useUpdateProduct()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset, watch } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: 'indoor',
      difficulty: 'easy',
      light: 'low',
      sizes: '',
      bestseller: false
    }
  })

  const  [image1,setImage1] = useState(false)
  const  [image2,setImage2] = useState(false)
  const  [image3,setImage3] = useState(false)
  const  [image4,setImage4] = useState(false)

  useEffect(() => {
    if (editProduct) {
      setValue('name', editProduct.name)
      setValue('description', editProduct.description)
      setValue('price', editProduct.price)
      setValue('category', editProduct.category)
      setValue('difficulty', editProduct.difficulty)
      setValue('light', editProduct.light)
      setValue('sizes', editProduct.size ? editProduct.size.join(', ') : '')
      setValue('bestseller', editProduct.bestseller)
    }
  }, [editProduct, setValue])

  const resetForm = () => {
    reset()
    setImage1(false)
    setImage2(false)
    setImage3(false)
    setImage4(false)
  }

  const onSummitHandler = async (data) => {
    const formData = new FormData()
    
    if (isEditMode) {
      formData.append("id", editProduct._id)
    }
    
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("difficulty", data.difficulty)
    formData.append("light", data.light)
    formData.append("price", data.price)
    formData.append("bestseller", data.bestseller)
    
    const sizeArray = data.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    sizeArray.forEach(size => {
      formData.append("size", size);
    });
    
    image1 && formData.append("image1", image1)
    image2 && formData.append("image2", image2)
    image3 && formData.append("image3", image3)
    image4 && formData.append("image4", image4)

    if (isEditMode) {
      updateProductMutation.mutate(formData, {
        onSuccess: () => {
          navigate('/list')
        }
      })
    } else {
      addProductMutation.mutate(formData, {
        onSuccess: () => {
          resetForm()
        }
      })
    }
  }
  return (
    <Card className='max-w-4xl'>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSummitHandler)} className='flex flex-col w-full items-start gap-6'>
      <div>
        <p className='mb-2'>{isEditMode ? 'Cập nhật ảnh (để trống nếu không đổi)' : 'Tải ảnh lên'}</p>
        <div className='flex gap-2'> 
          <label htmlFor="image1">
            <img className='w-20' src={
              image1 ? URL.createObjectURL(image1) : 
              (isEditMode && editProduct.image[0] ? editProduct.image[0] : assets.upload_area)
            } alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file"  id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20' src={
              image2 ? URL.createObjectURL(image2) : 
              (isEditMode && editProduct.image[1] ? editProduct.image[1] : assets.upload_area)
            } alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file"  id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={
              image3 ? URL.createObjectURL(image3) : 
              (isEditMode && editProduct.image[2] ? editProduct.image[2] : assets.upload_area)
            } alt="" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file"  id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={
              image4 ? URL.createObjectURL(image4) : 
              (isEditMode && editProduct.image[3] ? editProduct.image[3] : assets.upload_area)
            } alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file"  id="image4" hidden />
          </label>
        </div>
      </div>
      <div className='w-full space-y-2'>
        <Label htmlFor="name">Tên Sản Phẩm</Label>
        <Input 
          id="name"
          {...register('name', {
            required: 'Vui lòng nhập tên sản phẩm',
            minLength: {
              value: 3,
              message: 'Tên sản phẩm phải có ít nhất 3 ký tự'
            }
          })}
          className={`max-w-[500px] ${errors.name ? 'border-red-500' : ''}`}
          placeholder='Nhập tên sản phẩm'
        />
        {errors.name && <p className='text-sm text-red-600'>{errors.name.message}</p>}
      </div>
      <div className='w-full space-y-2'>
        <Label htmlFor="description">Mô tả sản phẩm</Label>
        <Textarea 
          id="description"
          {...register('description', {
            required: 'Vui lòng nhập mô tả sản phẩm',
            minLength: {
              value: 10,
              message: 'Mô tả phải có ít nhất 10 ký tự'
            }
          })}
          className={`max-w-[500px] min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
          placeholder='Viết mô tả chi tiết về sản phẩm'
        />
        {errors.description && <p className='text-sm text-red-600'>{errors.description.message}</p>}
      </div>

      <div className='w-full space-y-2'>
        <Label htmlFor="sizes">Kích thước (phân cách bằng dấu phẩy)</Label>
        <Input 
          id="sizes"
          {...register('sizes', {
            required: 'Vui lòng nhập ít nhất một kích thước'
          })}
          className={`max-w-[500px] ${errors.sizes ? 'border-red-500' : ''}`}
          placeholder='Ví dụ: Nhỏ, Vừa, Lớn hoặc 10cm, 15cm, 20cm'
        />
        <p className='text-xs text-gray-500'>Nhập các kích thước, phân cách bằng dấu phẩy</p>
        {errors.sizes && <p className='text-sm text-red-600'>{errors.sizes.message}</p>}
      </div>

      <div className='flex flex-col sm:flex-row gap-4 w-full sm:gap-6'>
        <div className='space-y-2'>
          <Label htmlFor="category">Loại sản phẩm</Label>
          <select 
            id="category"
            {...register('category')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900'
          >
            <option value="indoor">Trong nhà</option>
            <option value="outdoor">Ngoài trời</option>
          </select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor="difficulty">Độ khó</Label>
          <select 
            id="difficulty"
            {...register('difficulty')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900'
          >
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor="light">Ánh sáng</Label>
          <select 
            id="light"
            {...register('light')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900'
          >
            <option value="low">Ít</option>
            <option value="medium">Trung bình</option>
            <option value="high">Nhiều</option>
          </select>
        </div>
        
        <div className='space-y-2'>
          <Label htmlFor="price">Giá sản phẩm</Label>
          <Input 
            id="price"
            {...register('price', {
              required: 'Vui lòng nhập giá sản phẩm',
              min: {
                value: 1,
                message: 'Giá phải lớn hơn 0'
              }
            })}
            type="number"
            className={`sm:w-[120px] ${errors.price ? 'border-red-500' : ''}`}
            placeholder='25'
          />
          {errors.price && <p className='text-sm text-red-600'>{errors.price.message}</p>}
        </div>
      </div>
      
      <div className='flex gap-2 mt-2 items-center'>
        <input 
          {...register('bestseller')}
          type="checkbox" 
          id='bestseller'
          className='w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900'
        />
        <Label htmlFor="bestseller" className='cursor-pointer'>Thêm vào bán chạy</Label>
      </div>

      <div className='flex gap-3 mt-4'>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className='w-32'
        >
          {isSubmitting ? 'Đang xử lý...' : (isEditMode ? 'CẬP NHẬT' : 'TẠO MỚI')}
        </Button>
        {!isEditMode && (
          <Button 
            type="button"
            variant="outline"
            onClick={resetForm}
          >
            Làm mới
          </Button>
        )}
      </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default Add
