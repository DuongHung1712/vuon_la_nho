import React from 'react'
import { NavLink } from 'react-router-dom'
import {assets} from '../assets/assets'

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 lg:w-72 min-h-screen
          bg-white border-r-2 border-gray-200
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className='flex flex-col gap-3 pt-6 px-4 lg:px-6'>
          <NavLink
            className='flex items-center gap-3 border border-gray-300 px-4 py-3 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all'
            to="/add"
            onClick={() => setIsOpen(false)}
          >
            <img className='w-5 h-5' src={assets.add_icon} alt="" />
            <p className='font-medium text-gray-700'>Thêm sản phẩm</p>
          </NavLink>

          <NavLink
            className='flex items-center gap-3 border border-gray-300 px-4 py-3 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all'
            to="/list"
            onClick={() => setIsOpen(false)}
          >
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <p className='font-medium text-gray-700'>Liệt kê sản phẩm</p>
          </NavLink>

          <NavLink
            className='flex items-center gap-3 border border-gray-300 px-4 py-3 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all'
            to="/orders"
            onClick={() => setIsOpen(false)}
          >
            <img className='w-5 h-5' src={assets.order_icon} alt="" />
            <p className='font-medium text-gray-700'>Đơn hàng</p>
          </NavLink>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
