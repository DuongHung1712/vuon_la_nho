import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import './index.css'
import Sidebar from './components/Sidebar.jsx'
import { Routes, Route } from 'react-router-dom'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login.jsx'
import Add from './pages/Add.jsx';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = 'VND'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <div className='bg-gray-50 min-h-screen'>
        <ToastContainer />
        {token === ""
          ? <Login setToken={setToken} />
          : <>
            <Navbar setToken={setToken} toggleSidebar={toggleSidebar} />
            <div className='flex w-full'>
              <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
              <main className='flex-1 w-full lg:w-auto p-4 sm:p-6 lg:p-8 overflow-x-auto'>
                <div className='max-w-7xl mx-auto'>
                  <Routes>
                    <Route path='/add' element={<Add token={token} />} />
                    <Route path='/list' element={<List token={token} />} />
                    <Route path='/orders' element={<Orders token={token} />} />
                  </Routes>
                </div>
              </main>
            </div>
          </>
        }
      </div>
    </QueryClientProvider>
  )
}

export default App
