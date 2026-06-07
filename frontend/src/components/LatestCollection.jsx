import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const { t } = useTranslation();
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products]);

    return (
        <section className='py-12 sm:py-16 md:py-20'>
            {/* ── Section Header ── */}
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12'>
                <div className='max-w-xl animate-hero-reveal'>
                    <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 leading-tight'>
                        {t('latest.title1', 'Bộ Sưu Tập')} <span className='font-display italic text-primary-600'>{t('latest.title2', 'Mới Nhất')}</span>
                    </h2>
                    <p className='mt-3 text-sm sm:text-base text-gray-500 leading-relaxed'>
                        {t('latest.description', 'Khám phá những sắc xanh tinh khôi vừa cập bến Vườn Lá Nhỏ, mang hơi thở thiên nhiên vào tổ ấm của bạn.')}
                    </p>
                </div>

                <Link 
                    to='/collection'
                    className='group inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all animate-hero-reveal'
                    style={{ animationDelay: '0.2s' }}
                >
                    <span className='relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-primary-600 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-right group-hover:after:origin-left'>
                        {t('latest.viewAll', 'Xem tất cả sản phẩm')}
                    </span>
                    <div className='p-1.5 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors'>
                        <ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
                    </div>
                </Link>
            </div>

            {/* ── Products Grid ── */}
            <div 
                className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8'
            >
                {latestProducts.map((item, index) => (
                    <div 
                        key={item._id} 
                        className='animate-hero-reveal h-full' 
                        style={{ animationDelay: `${0.1 * (index % 5) + 0.3}s` }}
                    >
                        <ProductItem 
                            id={item._id} 
                            image={item.image} 
                            name={item.name} 
                            price={item.price} 
                            rating={item.rating} 
                            reviewCount={item.reviewCount} 
                            sizes={item.sizes} 
                            difficulty={item.difficulty}
                            category={item.category}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default LatestCollection
