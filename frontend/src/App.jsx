import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import About from './pages/About'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Loading from './components/Loading'
import { ToastContainer, toast } from 'react-toastify';
import LoginSuccess from './pages/LoginSuccess'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'

const App = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>  
      {isNavigating && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16 overflow-hidden animate-grow-up">
              <img 
                src="/favicon.png" 
                alt="Loading" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2 animate-pulse">
              <span className="text-primary-700 font-medium text-sm">Vườn Lá Nhỏ</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
      <Navbar />  
      <SearchBar /> 
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path="/success" element={<LoginSuccess />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/edit' element={<ProfileEdit />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
