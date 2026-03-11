import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import Home from '../pages/Home'
import { ShopContext } from '../context/ShopContext'
import { useProfile } from '../hooks/useApi'
import { User, ShoppingBag, LogOut, ChevronDown, ShoppingCart, Menu, ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
  const { data } = useProfile(token);
  const user = data?.user;
  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    setDropdownOpen(false)
  }

  const handleNavigate = (path) => {
    navigate(path)
    setDropdownOpen(false)
  }
  return (
    <div className='flex items-center justify-between py-5 font-medium '>

      <Link to='/'><img src={assets.logo} className='w-36' alt="" /> </Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700 '>
        <NavLink to='/' className='flex flex-col items-center gap-1 '>
          <p>{t('nav.home')}</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-primary-400 hidden ' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1 '>
          <p>{t('nav.collection')}</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-primary-400 hidden ' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1 '>
          <p>{t('nav.about')}</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-primary-400 hidden ' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1 '>
          <p>{t('nav.contact')}</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-primary-400 hidden ' />
        </NavLink>

      </ul>
      <div className='flex items-center gap-6'>
        <LanguageSwitcher />

        {token ? (

          <div className='flex items-center gap-4 relative'>

            {/* Avatar with Dropdown */}
            <div className='relative'>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='cursor-pointer'
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className='w-9 h-9 rounded-full object-cover border-2 border-gray-200 hover:border-primary-400 transition-all shadow-sm'
                    alt="User Avatar"
                  />
                ) : (
                  <div className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 hover:border-primary-400 transition-all'>
                    <User className='w-5 h-5 text-gray-600' />
                  </div>
                )}
                <ChevronDown className={`w-3 h-3 text-gray-600 absolute -bottom-1 -right-1 bg-white rounded-full transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className='absolute right-0 top-12 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
                  <div className='flex flex-col w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden'>
                    {/* User Info Header */}
                    {user && (
                      <div className='px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200'>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{user.name}</p>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className='py-2'>
                      <button
                        onClick={() => handleNavigate('/profile')}
                        className='w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left'
                      >
                        <User className='w-4 h-4 text-gray-600' />
                        <span className='text-sm text-gray-700 hover:text-gray-900'>{t('user.profile')}</span>
                      </button>

                      <button
                        onClick={() => handleNavigate('/orders')}
                        className='w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left'
                      >
                        <ShoppingBag className='w-4 h-4 text-gray-600' />
                        <span className='text-sm text-gray-700 hover:text-gray-900'>{t('user.orders')}</span>
                      </button>

                      <div className='border-t border-gray-100 my-1'></div>

                      <button
                        onClick={logout}
                        className='w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left'
                      >
                        <LogOut className='w-4 h-4 text-red-600' />
                        <span className='text-sm text-red-600 hover:text-red-700 font-medium'>{t('user.logout')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Cart Icon */}
            <Link to='/cart' className='relative'>
              <ShoppingCart className='w-5 h-5 text-gray-700' />
              <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
            </Link>

          </div>

        ) : (
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/login')}
              className='px-4 py-2 text-sm border border-primary-400 text-primary-700 rounded hover:bg-primary-50 transition'
            >
              {t('nav.login')}
            </button>
            <button
              onClick={() => navigate('/register')}
              className='px-4 py-2 text-sm bg-primary-400 text-white rounded hover:bg-primary-500 transition'
            >
              {t('nav.register')}
            </button>
          </div>
        )}
        <Menu onClick={() => setVisible(true)} className='w-5 h-5 cursor-pointer sm:hidden text-gray-700' />
      </div>
      {/* Sidebar for small screens */}
      <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 z-50 shadow-xl ${visible ? 'w-full' : 'w-0'} `}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer '>
            <ChevronLeft className='h-4 w-4 text-gray-600' />
            <p>{t('nav.back', 'Back')}</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>{t('nav.home')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>{t('nav.collection')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>{t('nav.about')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>{t('nav.contact')}</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar
