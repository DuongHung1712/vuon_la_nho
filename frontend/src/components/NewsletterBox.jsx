import React from 'react'

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  }

  return (
    <section className='py-14 sm:py-16'>
      <div className='mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-primary-100/70 bg-gradient-to-br from-white via-primary-50/40 to-secondary-50/50 px-5 py-8 text-center shadow-[0_24px_80px_-48px_rgba(66,88,62,0.45)] sm:px-8 sm:py-10 lg:px-12'>
        <p className='mx-auto max-w-2xl text-2xl font-semibold leading-tight text-gray-800 sm:text-3xl'>
          Đăng ký ngay và nhận khuyến mãi 20%
        </p>
        <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base'>
          Website bán kiểng lá
        </p>

        <form
          onSubmit={onSubmitHandler}
          className='mx-auto mt-6 flex w-full max-w-2xl flex-col gap-3 rounded-[22px] border border-primary-100 bg-white/90 p-3 shadow-sm sm:flex-row sm:items-center'
        >
          <input
            className='min-w-0 flex-1 rounded-2xl border border-transparent bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary-200 focus:bg-primary-50/40 sm:text-base'
            type="email"
            placeholder='Nhập email vào'
            required
          />
          <button
            type='submit'
            className='inline-flex w-full items-center justify-center rounded-2xl bg-primary-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 sm:w-auto sm:px-8'
          >
            Đăng Ký
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterBox
