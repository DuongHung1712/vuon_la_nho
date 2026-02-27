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
import { Trash2, Plus } from 'lucide-react'

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
      category: 'indoor',
      difficulty: 'easy',
      light: 'low',
      bestseller: false
    }
  })

  const  [image1,setImage1] = useState(false)
  const  [image2,setImage2] = useState(false)
  const  [image3,setImage3] = useState(false)
  const  [image4,setImage4] = useState(false)

  const [sizes, setSizes] = useState([
    { name: 'Nhỏ', price: '', stock: 10 }
  ])

  useEffect(() => {
    if (editProduct) {
      setValue('name', editProduct.name)
      setValue('description', editProduct.description)
      setValue('category', editProduct.category)
      setValue('difficulty', editProduct.difficulty)
      setValue('light', editProduct.light)
      setValue('bestseller', editProduct.bestseller)
      
      if (editProduct.sizes && editProduct.sizes.length > 0) {
        setSizes(editProduct.sizes.map(s => ({
          name: s.name || '',
          price: s.price || '',
          stock: s.stock || 0
        })))
      } else if (editProduct.size && editProduct.size.length > 0) {
        setSizes(editProduct.size.map(sizeName => ({
          name: sizeName,
          price: editProduct.price || '',
          stock: 10
        })))
      }
    }
  }, [editProduct, setValue])

  const addSizeField = () => {
    setSizes([...sizes, { name: '', price: '', stock: 10 }])
  }

  const removeSizeField = (index) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((_, i) => i !== index))
    } else {
      toast.error('Phải có ít nhất một kích thước')
    }
  }

  const updateSize = (index, field, value) => {
    const newSizes = [...sizes]
    newSizes[index][field] = value
    setSizes(newSizes)
  }

  const resetForm = () => {
    reset()
    setImage1(false)
    setImage2(false)
    setImage3(false)
    setImage4(false)
    setSizes([{ name: 'Nhỏ', price: '', stock: 10 }])
  }

  const onSummitHandler = async (data) => {

    const hasEmptySize = sizes.some(s => !s.name.trim() || !s.price || s.price <= 0)
    if (hasEmptySize) {
      toast.error('Vui lòng điền đầy đủ thông tin cho tất cả kích thước')
      return
    }

    const formData = new FormData()
    
    if (isEditMode) {
      formData.append("id", editProduct._id)
    }
    
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("difficulty", data.difficulty)
    formData.append("light", data.light)
    formData.append("bestseller", data.bestseller)
    
    formData.append("sizes", JSON.stringify(sizes.map(s => ({
      name: s.name.trim(),
      price: Number(s.price),
      stock: Number(s.stock) || 0
    }))))
    
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
    <Card className='w-full max-w-5xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-xl sm:text-2xl'>{isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSummitHandler)} className='flex flex-col w-full items-start gap-6'>
      <div className='w-full'>
        <p className='mb-3 text-sm font-medium'>{isEditMode ? 'Cập nhật ảnh (để trống nếu không đổi)' : 'Tải ảnh lên'}</p>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'> 
          <label htmlFor="image1" className='cursor-pointer'>
            <img className='w-full aspect-square object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors' src={
              image1 ? URL.createObjectURL(image1) : 
              (isEditMode && editProduct.image[0] ? editProduct.image[0] : assets.upload_area)
            } alt="Upload 1" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" accept="image/*" id="image1" hidden />
          </label>
          <label htmlFor="image2" className='cursor-pointer'>
            <img className='w-full aspect-square object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors' src={
              image2 ? URL.createObjectURL(image2) : 
              (isEditMode && editProduct.image[1] ? editProduct.image[1] : assets.upload_area)
            } alt="Upload 2" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" accept="image/*" id="image2" hidden />
          </label>
          <label htmlFor="image3" className='cursor-pointer'>
            <img className='w-full aspect-square object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors' src={
              image3 ? URL.createObjectURL(image3) : 
              (isEditMode && editProduct.image[2] ? editProduct.image[2] : assets.upload_area)
            } alt="Upload 3" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" accept="image/*" id="image3" hidden />
          </label>
          <label htmlFor="image4" className='cursor-pointer'>
            <img className='w-full aspect-square object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors' src={
              image4 ? URL.createObjectURL(image4) : 
              (isEditMode && editProduct.image[3] ? editProduct.image[3] : assets.upload_area)
            } alt="Upload 4" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" accept="image/*" id="image4" hidden />
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
          className={`w-full ${errors.name ? 'border-red-500' : ''}`}
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
          className={`w-full min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
          placeholder='Viết mô tả chi tiết về sản phẩm'
        />
        {errors.description && <p className='text-sm text-red-600'>{errors.description.message}</p>}
      </div>

      {/* Sizes with Prices Section */}
      <div className='w-full space-y-3'>
        <div className='flex items-center justify-between'>
          <Label>Kích thước & Giá</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addSizeField}
            className='flex items-center gap-1'
          >
            <Plus className='w-4 h-4' />
            Thêm kích thước
          </Button>
        </div>
        
        <div className='space-y-3'>
          {sizes.map((size, index) => (
            <div key={index} className='flex flex-col sm:flex-row gap-3 items-start p-3 sm:p-4 border rounded-lg bg-gray-50'>
              <div className='flex-1 w-full space-y-2'>
                <Label className='text-xs'>Tên kích thước</Label>
                <Input
                  value={size.name}
                  onChange={(e) => updateSize(index, 'name', e.target.value)}
                  placeholder='Ví dụ: Nhỏ (10-15cm)'
                  className='bg-white w-full'
                />
              </div>
              <div className='w-full sm:w-28 space-y-2'>
                <Label className='text-xs'>Giá (VNĐ)</Label>
                <Input
                  type="number"
                  value={size.price}
                  onChange={(e) => updateSize(index, 'price', e.target.value)}
                  placeholder='50000'
                  className='bg-white w-full'
                />
              </div>
              <div className='w-full sm:w-24 space-y-2'>
                <Label className='text-xs'>Tồn kho</Label>
                <Input
                  type="number"
                  value={size.stock}
                  onChange={(e) => updateSize(index, 'stock', e.target.value)}
                  placeholder='10'
                  className='bg-white w-full'
                />
              </div>
              {sizes.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeSizeField(index)}
                  className='sm:mt-6 self-end sm:self-auto text-red-600 hover:text-red-700 hover:bg-red-50'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className='text-xs text-gray-500'>Thêm các kích thước với giá tương ứng cho sản phẩm</p>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div className='space-y-2 flex-1'>
          <Label htmlFor="category">Loại sản phẩm</Label>
          <select 
            id="category"
            {...register('category')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          >
            <option value="indoor">Trong nhà</option>
            <option value="outdoor">Ngoài trời</option>
          </select>
        </div>
        <div className='space-y-2 flex-1'>
          <Label htmlFor="difficulty">Độ khó</Label>
          <select 
            id="difficulty"
            {...register('difficulty')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          >
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
        <div className='space-y-2 flex-1'>
          <Label htmlFor="light">Ánh sáng</Label>
          <select 
            id="light"
            {...register('light')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          >
            <option value="low">Ít</option>
            <option value="medium">Trung bình</option>
            <option value="high">Nhiều</option>
          </select>
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

      <div className='flex gap-3 mt-4 flex-wrap'>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className='min-w-[120px]'
        >
          {isSubmitting ? 'Đang xử lý...' : (isEditMode ? 'CẬP NHẬT' : 'TẠO MỚI')}
        </Button>
        {!isEditMode && (
          <Button 
            type="button"
            variant="outline"
            onClick={resetForm}
            className='min-w-[120px]'
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
