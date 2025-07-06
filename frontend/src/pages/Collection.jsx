import React, { use, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const {products, search ,showSearch} = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item =>item !== e.target.value));
    }
    else{
      setCategory(prev => [...prev, e.target.value]);
    }
  }

  
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item =>item !== e.target.value));
    }
    else{
      setSubCategory(prev => [...prev, e.target.value]);
      
    }
    }

    const applyFilter = () => {

      let productsCopy = products.slice();
      
      if (showSearch && search) {
        productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        
      }

      if (category.length > 0) {
        productsCopy = productsCopy.filter(item => category.includes(item.category));
      }
      if (subCategory.length > 0) {
        
        productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
      }
      setFilterProducts(productsCopy);
    }
  const sortProducts = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    console.log(subCategory);
  },[subCategory])

  useEffect(() => {
    applyFilter();
  },[category,subCategory,search,showSearch,products]);

  useEffect(() => {
    sortProducts();
  },[sortType]);  
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
        {/* Filter options */}
        <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>Bộ Lọc 
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Loại</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Trong nhà'} onChange={toggleCategory} />Trong Nhà
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Ngoài trời'} onChange={toggleCategory} />Ngoài Trời
            </p>
          </div>
        </div>
        {/*Sub category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Tiêu chí</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Mini để bàn'} onChange={toggleSubCategory} />Mini để bàn
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Phong thủy'} onChange={toggleSubCategory} />Phong thủy
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Cây chịu nắng tốt'} onChange={toggleSubCategory} />Cây chịu nắng tốt
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Lá độc lạ / sưu tầm'} onChange={toggleSubCategory} />Lá độc lạ / sưu tầm
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Trang trí sân vườn'} onChange={toggleSubCategory} />Trang trí sân vườn
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Cây dây leo / phủ tường'} onChange={toggleSubCategory} />Cây dây leo / phủ tường
            </p>
          </div>
        </div>
        </div>
        {/* Right Side */}
        <div className='flex-1'>

          <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'Tất cả'} text2={'bộ sưu tập'}/>  
            {/* Products Sort */}
            <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
          {/* Map products */}
          <div className='grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {
              filterProducts.map((item,index) =>(
                <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image}/>
              ))
            }


          </div>

        </div>
    </div>
  )
}

export default Collection
