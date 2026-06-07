import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false);
        }
    }, [location])

    return showSearch && visible ? (
        <div className='border-y border-gray-100 bg-gray-50/90 backdrop-blur-sm'>
            <div className='mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8'>
                <div className='flex min-w-0 flex-1 items-center rounded-full border border-gray-300 bg-white px-4 py-3 shadow-sm'>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='min-w-0 flex-1 bg-transparent text-sm outline-none sm:text-base'
                        type="text"
                        placeholder='Tìm kiếm'
                    />
                    <Search className='w-4 h-4 text-gray-500' />
                </div>
                <button
                    type='button'
                    onClick={() => setShowSearch(false)}
                    className='inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:text-gray-700'
                >
                    <X className='w-4 h-4' />
                </button>
            </div>
        </div>
    ) : null
}

export default SearchBar
