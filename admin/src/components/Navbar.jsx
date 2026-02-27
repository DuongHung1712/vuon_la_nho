import React from 'react'
import { assets } from '../assets/assets'
import { Menu } from 'lucide-react'

const Navbar = ({ setToken, toggleSidebar }) => {
  return (
    <div className='flex items-center py-3 px-4 lg:px-8 justify-between bg-white border-b border-gray-200'>
      <div className='flex items-center gap-3'>
        <button
          onClick={toggleSidebar}
          className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label='Toggle menu'
        >
          <Menu className='w-6 h-6 text-gray-700' />
        </button>
        <img className='w-28 sm:w-36' src={assets.logo} alt="Logo" />
      </div>
      <button
        onClick={() => setToken('')}
        className='bg-gray-600 text-white px-4 sm:px-5 py-2 rounded-full text-sm hover:bg-gray-700 transition-colors'
      >
        Đăng xuất
      </button>
    </div>
  )
}

export default Navbar
