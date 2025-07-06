import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
const Add = ({token}) => {
  const  [image1,setImage1] = useState(false)
  const  [image2,setImage2] = useState(false)
  const  [image3,setImage3] = useState(false)
  const  [image4,setImage4] = useState(false)

  const [name,setName] = useState("");
  const [description , setDescription] = useState("");
  const [price , setPrice] = useState("");
  const [category , setCategory] = useState("Indoor");
  const [subCategory , setSubCategory] = useState("A");
  const [bestseller , setBestseller] = useState(false);
  const [sizes , setSizes] = useState([]); 

  const onSummitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes)) 
      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      }else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }
  return (
    <form onSubmit={onSummitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Tải ảnh lên</p>
        <div className='flex gap-2'> 
          <label htmlFor="image1">
            <img className='w-20' src={!image1?assets.upload_area: URL.createObjectURL(image1)} alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file"  id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20' src={!image2?assets.upload_area: URL.createObjectURL(image2)} alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file"  id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={!image3?assets.upload_area: URL.createObjectURL(image3)} alt="" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file"  id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={!image4?assets.upload_area: URL.createObjectURL(image4)} alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file"  id="image4" hidden />
          </label>
        </div>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Tên Sản Phẩm</p>
        <input onChange={(e)=> setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập vào' required/>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Mô tả sản phẩm</p>
        <textarea onChange={(e)=> setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Viết nội dung tại đây' required/>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Loại sản phẩm</p>
          <select onChange={(e)=> setCategory(e.target.value)} className='w-full px-3 py-2' >
            <option value="Trong nhà">Trong nhà</option>
            <option value="Ngoài trời">Ngoài trời</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Tiêu chí</p>
          <select onChange={(e)=> setSubCategory(e.target.value)} className='w-full px-3 py-2' >
            <option value="Mini để bàn">Mini để bàn</option>
            <option value="Phong thủy">Phong thủy</option>
            <option value="Cây chịu nắng tốt">Cây chịu nắng tốt</option>
            <option value="Lá độc lạ / sưu tầm">Lá độc lạ / sưu tầm</option>
            <option value="Trang trí sân vườn">Trang trí sân vườn</option>
            <option value="Cây dây leo / phủ tường ">Cây dây leo / phủ tường </option>
            


          </select>
        </div>
        <div>
          <p className='mb-2'>Giá sản phẩm</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
        </div>
      </div>
      <div>
        <p className='mb-2'>Kích cỡ sản phẩm</p>
        <div className='flex gap-3'>
          <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter(item => item !=="S"):[...prev,"S"])}>
            <p className={`${sizes.includes("S")? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter(item => item !=="M"):[...prev,"M"])}>
            <p className={`${sizes.includes("M")? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter(item => item !=="L"):[...prev,"L"])}>
            <p className={`${sizes.includes("L")? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
          </div>

        </div>
      </div>
      <div className=' flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)}  checked={bestseller } type="checkbox" id='bestseller' />
        <label className='curs-pointer' htmlFor="bestseller">Thêm vào bán chạy</label>
      </div>

      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>TẠO</button>
    </form>
  )
}

export default Add
