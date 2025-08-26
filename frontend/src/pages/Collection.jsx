import React, { use, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useMemo } from 'react';

const Collection = () => {

  const [sortType, setSortType] = useState('relavent');
  const { products, search, setSearch } = useContext(ShopContext);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [light, setLight] = useState("");
  const [price, setPrice] = useState([0, 2000000]);


  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setDifficulty("");
    setLight("");
    setPrice([0, 2000000]);
    setSortType("relavent");
  };

  

  const filterProducts = useMemo(() => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (difficulty) {
      filtered = filtered.filter((p) => p.difficulty === difficulty);
    }

    if (light) {
      filtered = filtered.filter((p) => p.light === light);
    }

    filtered = filtered.filter(
      (p) => p.price >= price[0] && p.price <= price[1]
    );

    if (sortType === "low-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, search, category, difficulty, light, price, sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6 sticky top-4 space-y-6">
        {/* Header */}
        <div className='flex justify-between items-center border-b pb-4'>
          <h3 className='font-semibold flex items-center'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Bộ lọc
          </h3>
          <button
            onClick={resetFilters}
            className='text-sm px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg:gray-700'
          >
            Xóa bộ lọc
          </button>

        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Tìm kiếm</label>
          <div className='relative'>
            <input type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}

              placeholder='Tên cây, mô tả...'
              className='w-full border rounded-md pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500'
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Danh mục</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Chọn danh mục</option>
            <option value="indoor">Cây trong nhà</option>
            <option value="outdoor">Ngoài trời</option>
          </select>
        </div>
        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium mb-2">Độ khó chăm sóc</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Chọn độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
        {/* Light Requirement */}
        <div>
          <label className="block text-sm font-medium mb-2">Yêu cầu ánh sáng</label>
          <select
            value={light}
            onChange={(e) => setLight(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Chọn ánh sáng</option>
            <option value="low">Ít</option>
            <option value="medium">Trung bình</option>
            <option value="high">Nhiều</option>
          </select>
        </div>
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Khoảng giá: {price[0].toLocaleString()}đ -{" "}
            {price[1].toLocaleString()}đ
          </label>
          <input
            type="range"
            min={0}
            max={2000000}
            step={10000}
            value={price[0]}
            onChange={(e) => setPrice([+e.target.value, price[1]])}
            className="w-full"
          />
          <input
            type="range"
            min={0}
            max={2000000}
            step={10000}
            value={price[1]}
            onChange={(e) => setPrice([price[0], +e.target.value])}
            className="w-full mt-2"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'Tất cả'} text2={'bộ sưu tập'} />
          {/* Products Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Map products */}
        <div className='grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
            ))
          }


        </div>

      </div>
    </div>
  )
}

export default Collection
