import React, { useContext, useState, useRef, useEffect, useMemo } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { useProfile } from '../hooks/useApi'
import { User, ShoppingBag, LogOut, ChevronDown, ShoppingCart, Menu, ChevronLeft, Search, X, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { search, setSearch, setShowSearch, products, currency, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
  const { data } = useProfile(token);
  const user = data?.user;
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Search suggestions - filter products by name, max 5 results
  const suggestions = useMemo(() => {
    if (!search.trim() || !products.length) return [];
    const query = search.toLowerCase();
    return products
      .filter(p => p.name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [search, products]);

  const showSuggestions = searchFocused && search.trim() && suggestions.length > 0;

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setShowSearch(true);
      setSearchFocused(false);
      navigate('/collection');
    }
  }

  const handleSuggestionClick = (productId) => {
    setSearchFocused(false);
    setSearch('');
    navigate(`/product/${productId}`);
  }

  // Close dropdown & search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest('.user-dropdown-area')) {
        setDropdownOpen(false);
      }
      if (searchFocused && searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSearchFocused(false);
        searchInputRef.current?.blur();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen, searchFocused]);

  const navLinkClass = ({ isActive }) =>
    `relative py-1 text-sm tracking-wide transition-colors duration-200 ${
      isActive
        ? 'text-gray-900 font-semibold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary-500 after:rounded-full'
        : 'text-gray-500 hover:text-gray-800 font-medium'
    }`;

  return (
    <>
      <nav className='sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>

            {/* Logo */}
            <Link to='/' className='flex-shrink-0'>
              <img src={assets.logo} className='w-32 sm:w-36' alt="Vườn Lá Nhỏ" />
            </Link>

            {/* Navigation Links - Center */}
            <ul className='hidden md:flex items-center gap-8 ml-10'>
              <li>
                <NavLink to='/' end className={navLinkClass}>
                  {t('nav.home')}
                </NavLink>
              </li>
              <li>
                <NavLink to='/collection' className={navLinkClass}>
                  {t('nav.collection')}
                </NavLink>
              </li>
              <li>
                <NavLink to='/contact' className={navLinkClass}>
                  {t('nav.contact')}
                </NavLink>
              </li>
            </ul>

            {/* Right Section: Search + Actions */}
            <div className='flex items-center gap-3 sm:gap-4'>

              {/* Search Bar with Suggestions */}
              <div className='hidden sm:block relative' ref={searchContainerRef}>
                <form
                  onSubmit={handleSearchSubmit}
                  className={`flex items-center gap-2 border rounded-full px-4 py-2 
                             transition-all duration-200 w-48 lg:w-64
                             ${searchFocused 
                               ? 'bg-white border-primary-400 shadow-md ring-1 ring-primary-200' 
                               : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                >
                  <Search className='w-4 h-4 text-gray-400 flex-shrink-0' />
                  <input
                    ref={searchInputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => { setShowSearch(true); setSearchFocused(true); }}
                    className='flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400'
                    type="text"
                    placeholder={t('nav.searchPlaceholder', 'Tìm kiếm cảm hứng...')}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => { setSearch(''); searchInputRef.current?.focus(); }}
                      className='text-gray-400 hover:text-gray-600 transition-colors'
                    >
                      <X className='w-3.5 h-3.5' />
                    </button>
                  )}
                </form>

                {/* Suggestions Dropdown */}
                {showSuggestions && (
                  <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-scale-in'>
                    <div className='py-1.5'>
                      {suggestions.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleSuggestionClick(product._id)}
                          className='w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary-50/60 transition-colors text-left group'
                        >
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className='w-10 h-10 rounded-lg object-cover border border-gray-100 group-hover:border-primary-200 transition-colors flex-shrink-0'
                          />
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm text-gray-800 font-medium truncate group-hover:text-primary-700 transition-colors'>
                              {product.name}
                            </p>
                            <p className='text-xs text-primary-600 font-semibold'>
                              {product.price.toLocaleString()}{currency}
                            </p>
                          </div>
                          <Search className='w-3.5 h-3.5 text-gray-300 group-hover:text-primary-400 transition-colors flex-shrink-0' />
                        </button>
                      ))}
                    </div>
                    {/* View all results link */}
                    <button
                      onClick={() => {
                        setSearchFocused(false);
                        setShowSearch(true);
                        navigate('/collection');
                      }}
                      className='w-full px-3 py-2.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors border-t border-gray-100 text-center'
                    >
                      {t('nav.viewAllResults', 'Xem tất cả kết quả')} →
                    </button>
                  </div>
                )}

                {/* No results state */}
                {searchFocused && search.trim() && suggestions.length === 0 && (
                  <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-scale-in'>
                    <div className='px-4 py-6 text-center'>
                      <SearchX className='w-8 h-8 text-gray-300 mx-auto mb-2' />
                      <p className='text-sm text-gray-500'>{t('nav.noResults', 'Không tìm thấy sản phẩm')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile search toggle */}
              <button
                onClick={() => {
                  setShowSearch(true);
                  navigate('/collection');
                }}
                className='sm:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors'
              >
                <Search className='w-5 h-5' />
              </button>

              <LanguageSwitcher />

              {token ? (
                <div className='flex items-center gap-3 relative'>

                  {/* Cart Icon */}
                  <Link to='/cart' className='relative p-1.5 text-gray-600 hover:text-gray-900 transition-colors'>
                    <ShoppingCart className='w-5 h-5' />
                    {getCartCount() > 0 && (
                      <span className='absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center 
                                       bg-primary-500 text-white text-[10px] font-bold rounded-full leading-none px-1'>
                        {getCartCount()}
                      </span>
                    )}
                  </Link>

                  {/* Avatar with Dropdown */}
                  <div className='relative user-dropdown-area'>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className='flex items-center gap-1 cursor-pointer'
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          className='w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-primary-400 transition-all'
                          alt="User Avatar"
                        />
                      ) : (
                        <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 hover:border-primary-400 transition-all'>
                          <User className='w-4 h-4 text-gray-600' />
                        </div>
                      )}
                      <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className='absolute right-0 top-full mt-2 z-50 animate-scale-in'>
                        <div className='flex flex-col w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
                          {/* User Info Header */}
                          {user && (
                            <div className='px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-100'>
                              <p className='text-sm font-semibold text-gray-800 truncate'>{user.name}</p>
                            </div>
                          )}

                          {/* Menu Items */}
                          <div className='py-1.5'>
                            <button
                              onClick={() => handleNavigate('/profile')}
                              className='w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left'
                            >
                              <User className='w-4 h-4 text-gray-500' />
                              <span className='text-sm text-gray-700'>{t('user.profile')}</span>
                            </button>

                            <button
                              onClick={() => handleNavigate('/orders')}
                              className='w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left'
                            >
                              <ShoppingBag className='w-4 h-4 text-gray-500' />
                              <span className='text-sm text-gray-700'>{t('user.orders')}</span>
                            </button>

                            <div className='border-t border-gray-100 my-1'></div>

                            <button
                              onClick={logout}
                              className='w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left'
                            >
                              <LogOut className='w-4 h-4 text-red-500' />
                              <span className='text-sm text-red-600 font-medium'>{t('user.logout')}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              ) : (
                <div className='flex items-center gap-2.5'>
                  <button
                    onClick={() => navigate('/login')}
                    className='px-4 py-2 text-sm border border-primary-300 text-primary-700 rounded-full hover:bg-primary-50 transition-all font-medium'
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className='px-4 py-2 text-sm bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all font-medium shadow-sm'
                  >
                    {t('nav.register')}
                  </button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setVisible(true)} className='md:hidden p-1.5 text-gray-600 hover:text-gray-900 transition-colors'>
                <Menu className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar — rendered outside <nav> to avoid fixed-inside-sticky bug */}
      {visible && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 bg-black/30 z-50 animate-fade-in'
            onClick={() => setVisible(false)}
          />
          {/* Panel */}
          <div className='fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-2xl animate-slide-in-right'>
            <div className='flex flex-col h-full'>
              {/* Mobile Header */}
              <div className='flex items-center justify-between p-4 border-b border-gray-100'>
                <img src={assets.logo} className='w-28' alt="Vườn Lá Nhỏ" />
                <button onClick={() => setVisible(false)} className='p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all'>
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Mobile Search */}
              <div className='px-4 pt-4 pb-2'>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (search.trim()) {
                      setShowSearch(true);
                      navigate('/collection');
                      setVisible(false);
                    }
                  }}
                  className='flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5'
                >
                  <Search className='w-4 h-4 text-gray-400' />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400'
                    type="text"
                    placeholder={t('nav.searchPlaceholder', 'Tìm kiếm cảm hứng...')}
                  />
                </form>
              </div>

              {/* Mobile Nav Links */}
              <nav className='flex-1 px-2 py-3'>
                {[
                  { to: '/', label: t('nav.home'), end: true },
                  { to: '/collection', label: t('nav.collection') },
                  { to: '/contact', label: t('nav.contact') },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setVisible(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg text-sm transition-all duration-150 mb-0.5 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
