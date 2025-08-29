import React, { use, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const Login = () => {

  const [currentState, setCurrentState] = useState('Đăng Nhập');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onSubmmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Đăng Ký') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)

        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        }
        else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }
  }
  const onClickFacebook = async () => {
    window.location.href = backendUrl + '/api/user/auth/facebook';
  };
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])
  return (
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center ">
      <div className='w-full max-w-md'>
        <div class="text-center mb-8 justify-center pt-24">
          <a class="inline-flex items-center space-x-2" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf h-10 w-10 text-green-600"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
            <span class="text-3xl font-bold text-gray-900">Vườn Lá Nhỏ</span>
          </a>
          <p class="text-gray-600 mt-2">Chào mừng bạn quay trở lại</p>
        </div>

        {/* Form  */}
        <div className="rounded-xl bg-white text-card-foreground flex flex-col gap-6 border py-6 shadow-lg">
          <form onSubmit={onSubmmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto  gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
              <p className='prata-regular text-3xl'>{currentState}</p>
              <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {currentState === 'Đăng Nhập' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='rounded-md w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='rounded-md w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='rounded-md w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
            {currentState === 'Đăng Nhập' ? '' : <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="text" className='rounded-md w-full px-3 py-2 border border-gray-800' placeholder='Confirm Password' required />}

            <div className='w-full flex justify-between text-sm mt-[-8px]'>
              <p className='cursor-pointer'>Bạn quên mật khẩu à?</p>
              {
                currentState === 'Đăng Nhập'
                  ? <p onClick={() => setCurrentState('Đăng Ký')} className='cursor-pointer' >Tạo Tài Khoản</p>
                  : <p onClick={() => setCurrentState('Đăng Nhập')} className='cursor-pointer' >Đăng nhập ở đây</p>

              }
            </div>
            <button className='rounded-md bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Đăng Nhập' ? 'Đăng Nhập' : 'Đăng Ký'}</button>
          </form>
          <div className='relative'>
            <div data-orientation="horizontal" role="none" data-slot="separator" class="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"></div>
            <span class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  px-2 text-sm text-gray-500">hoặc</span>
          </div>
          <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto  gap-4 text-gray-800'>
            <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 w-full"><svg class="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>Đăng nhập với Google</button>
            <button onClick={onClickFacebook} data-slot="button" class=" inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 w-full"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>Đăng nhập với Facebook</button>

          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Login
