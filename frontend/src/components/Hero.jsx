import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, Leaf, Star, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className='relative overflow-hidden bg-[#f6f9f4]'>

      {/* ── Atmospheric Background ── */}
      <div className='absolute inset-0'>
        {/* Main gradient wash */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary-50 via-[#f6f9f4] to-white' />
        {/* Organic blob top-right */}
        <div className='absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary-200/20 blur-[100px]' />
        {/* Organic blob bottom-left */}
        <div className='absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-primary-100/25 blur-[80px]' />
        {/* Subtle grid texture overlay */}
        <div 
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage: 'radial-gradient(circle, #374a36 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Right side dots (visible on lg+) */}
      <div className='hidden lg:block absolute top-32 right-[48%] w-1.5 h-1.5 bg-primary-300/30 rounded-full animate-float' style={{ animationDelay: '2s' }} />

      {/* ── Content ── */}
      <div className='relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center min-h-[calc(100vh-200px)] pt-20 pb-10 sm:pt-24 sm:pb-14 lg:pt-20 lg:pb-8'>

          {/* Left: Copy */}
          <div className='lg:col-span-6 xl:col-span-5 flex flex-col justify-center order-2 lg:order-1 py-4 lg:-translate-y-2'>

            {/* Main Heading */}
            <h1 
              className='text-3xl leading-[1.2] sm:text-4xl lg:text-5xl xl:text-[3.5rem] 
                         font-bold text-gray-900 mb-5 sm:mb-6 animate-hero-reveal'
              style={{ animationDelay: '0.2s' }}
            >
              {t('hero.heading1', 'Khơi nguồn')}{' '}
              <span className='whitespace-nowrap font-display italic text-primary-600 relative'>
                {t('hero.headingAccent', 'Sức Sống')}
                {/* Underline accent */}
                <svg className='absolute -bottom-1 left-0 w-full h-2 text-primary-300/50' viewBox='0 0 200 8' preserveAspectRatio='none'>
                  <path d='M0 7 Q50 0, 100 4 T200 3' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' />
                </svg>
              </span>
              <br className='hidden sm:block' />
              <span className='sm:hidden'> </span>
              {t('hero.heading2', 'Trong Không Gian')}
            </h1>

            {/* Description */}
            <p 
              className='text-sm sm:text-[15px] lg:text-base text-gray-500 leading-relaxed max-w-md mb-7 sm:mb-8 animate-hero-reveal'
              style={{ animationDelay: '0.35s' }}
            >
              {t('hero.description', 'Biến ngôi nhà thành một ốc đảo yên bình với những loại cây tuyển chọn, dễ chăm sóc và đầy tính thẩm mỹ.')}
            </p>

            {/* CTA Buttons */}
            <div 
              className='flex flex-col xs:flex-row items-stretch xs:items-center gap-3 mb-9 sm:mb-10 animate-hero-reveal'
              style={{ animationDelay: '0.45s' }}
            >
              <Link
                to='/collection'
                className='group inline-flex items-center justify-center gap-2.5 
                           bg-primary-600 hover:bg-primary-700 text-white 
                           px-6 py-3 sm:py-3.5 rounded-xl text-sm font-semibold 
                           transition-all duration-300 ease-out
                           shadow-[0_4px_16px_-2px] shadow-primary-600/30 
                           hover:shadow-[0_8px_24px_-4px] hover:shadow-primary-600/35 
                           hover:-translate-y-0.5 active:translate-y-0'
              >
                {t('hero.ctaExplore', 'Khám phá bộ sưu tập')}
                <ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
              </Link>
              <a
                href='#ai-suggest'
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('ai-suggest')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className='group inline-flex items-center justify-center gap-2 
                           bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700
                           px-6 py-3 sm:py-3.5 rounded-xl text-sm font-semibold 
                           transition-all duration-300 ease-out
                           border border-gray-200 hover:border-primary-300 
                           shadow-sm hover:shadow-md'
              >
                <Leaf className='w-4 h-4 text-primary-500 transition-transform duration-300 group-hover:rotate-12' />
                {t('hero.ctaEasy', 'Tư vấn bệnh với AI')}
              </a>
            </div>

            {/* Stats */}
            <div 
              className='flex items-center gap-6 sm:gap-8 mt-4 sm:mt-6 animate-hero-reveal'
              style={{ animationDelay: '0.55s' }}
            >
              <div>
                <p className='text-xl sm:text-2xl font-bold text-gray-900 tabular-nums'>10K<span className='text-primary-500'>+</span></p>
                <p className='text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5'>
                  {t('hero.statsDelivered', 'Cây đã giao')}
                </p>
              </div>
              <div className='w-px h-8 bg-gray-200/80' />
              <div>
                <div className='flex items-baseline gap-0.5'>
                  <p className='text-xl sm:text-2xl font-bold text-gray-900 tabular-nums'>4.9</p>
                  <span className='text-xs text-gray-300 font-semibold'>/5</span>
                </div>
                <p className='text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5'>
                  {t('hero.statsRating', 'Đánh giá')}
                </p>
              </div>
              <div className='w-px h-8 bg-gray-200/80 hidden sm:block' />
              <div className='hidden sm:block'>
                <p className='text-xl sm:text-2xl font-bold text-gray-900 tabular-nums'>50<span className='text-primary-500'>+</span></p>
                <p className='text-[9px] sm:text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5'>
                  {t('hero.statsVarieties', 'Giống cây')}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className='lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end order-1 lg:order-2 lg:-translate-y-12'>
            <div className='animate-hero-image w-full flex justify-center lg:justify-end'>
              <div className='relative w-full max-w-sm sm:max-w-md lg:max-w-none'>
                {/* Tilted background shape */}
                <div className='absolute inset-3 sm:inset-5 bg-gradient-to-br from-primary-200/30 to-primary-100/10 rounded-[1.75rem] -rotate-2 scale-[1.02]' />

                {/* Main Image */}
                <div className='relative rounded-2xl sm:rounded-[1.25rem] overflow-hidden 
                                shadow-[0_20px_60px_-12px] shadow-primary-900/15'>
                  <img
                    className='w-full h-[300px] sm:h-[380px] lg:h-[440px] xl:h-[480px] object-cover'
                    src={assets.hero_img}
                    alt="Cây cảnh Vườn Lá Nhỏ"
                    loading='eager'
                  />
                  {/* Gradient vignette */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-white/5' />
                </div>

                {/* ── Floating Badge: Quality ── */}
                <div 
                  className='absolute bottom-3 right-3 sm:bottom-5 sm:right-5 
                             bg-white/95 backdrop-blur-md rounded-xl 
                             px-3.5 py-2.5 sm:px-4 sm:py-3 
                             shadow-lg shadow-gray-900/8 border border-white/60
                             flex items-center gap-2.5 sm:gap-3
                             animate-hero-reveal'
                  style={{ animationDelay: '0.7s' }}
                >
                  <div className='w-8 h-8 sm:w-9 sm:h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                    <ShieldCheck className='w-4 h-4 sm:w-5 sm:h-5 text-primary-600' />
                  </div>
                  <div>
                    <p className='text-[9px] sm:text-[10px] font-semibold text-primary-600 uppercase tracking-wider leading-none mb-0.5'>
                      {t('hero.badgeLabel', 'Chất lượng')}
                    </p>
                    <p className='text-xs sm:text-sm font-bold text-gray-800 leading-tight'>
                      {t('hero.badgeValue', 'Giá tốt nhất tại vườn')}
                    </p>
                  </div>
                </div>

                {/* ── Floating Badge: Stars ── */}
                <div 
                  className='absolute top-3 right-3 sm:top-5 sm:right-5 
                             bg-white/90 backdrop-blur-md rounded-full 
                             px-2.5 py-1.5 sm:px-3 sm:py-2 
                             shadow-md shadow-gray-900/8 border border-white/60
                             flex items-center gap-0.5
                             animate-hero-reveal'
                  style={{ animationDelay: '0.9s' }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400' />
                  ))}
                  <span className='text-[11px] sm:text-xs font-bold text-gray-700 ml-1'>4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
