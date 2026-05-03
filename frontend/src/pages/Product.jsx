import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import ReviewList from "../components/ReviewList";
import Loading from "../components/Loading";
import SEO from "../components/SEO";
import { ProductSchema, BreadcrumbSchema } from "../components/StructuredData";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Leaf,
  ShieldCheck,
  Truck,
  Droplets,
  Sun,
  History,
  MessageCircle,
  Phone,
  Clock,
  Shield,
} from "lucide-react";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token, navigate } = useContext(ShopContext);
  const { t } = useTranslation();
  
  const [image, setImage] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedPrice, setSelectedPrice] = useState(0);

  const productData = useMemo(() => {
    return products.find((item) => item._id === productId);
  }, [products, productId]);

  useEffect(() => {
    if (productData) {
      setImage(productData.image[0]);
      setSize("");
      setQuantity(1);

      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedPrice(0);
      } else if (productData.price) {
        setSelectedPrice(productData.price);
      }
    }
  }, [productData]);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleSizeSelect = (sizeItem) => {
    if (typeof sizeItem === "object") {
      setSize(sizeItem.name);
      setSelectedPrice(sizeItem.price);
    } else {
      setSize(sizeItem);
      setSelectedPrice(productData.price);
    }
  };

  const handleBuyNow = () => {
    if (!size) {
      toast.error(t('product.selectSizeError', 'Vui lòng chọn kích thước'));
      return;
    }
    if (!token) {
      toast.error(t('product.loginRequired', 'Vui lòng đăng nhập để mua hàng'));
      navigate('/login');
      return;
    }
    navigate('/place-order', {
      state: {
        buyNowItem: {
          _id: productData._id,
          size: size,
          quantity: quantity
        }
      }
    });
  };

  const getPriceDisplay = () => {
    if (productData.sizes && productData.sizes.length > 0) {
      if (selectedPrice > 0) {
        return selectedPrice.toLocaleString("vi-VN");
      }
      const prices = productData.sizes.map((s) => s.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return minPrice.toLocaleString("vi-VN");
      }
      return `${minPrice.toLocaleString("vi-VN")} - ${maxPrice.toLocaleString("vi-VN")}`;
    }
    return (productData.price || 0).toLocaleString("vi-VN");
  };

  const getSizesArray = () => {
    if (productData.sizes && productData.sizes.length > 0) {
      return productData.sizes;
    }
    if (productData.size && productData.size.length > 0) {
      return productData.size.map((s) => ({
        name: s,
        price: productData.price,
      }));
    }
    return [];
  };

  if (!productData) {
    return <Loading />;
  }

  const breadcrumbItems = [
    { name: t('nav.home'), url: "/" },
    { name: t('nav.collection'), url: "/collection" },
    { name: productData.name, url: `/product/${productData._id}` },
  ];

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8 sm:py-12">
      <SEO
        title={`${productData.name} - Vườn Lá Nhỏ`}
        description={productData.description}
        ogImage={productData.image[0]}
        ogType="product"
      />
      <ProductSchema product={productData} currency={currency} />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          
          {/* ── Left: Images ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square max-w-[540px] mx-auto lg:mx-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-hero-reveal">
              {image && (
                <img
                  className="w-full h-full object-cover"
                  src={image}
                  alt={productData.name}
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide animate-hero-reveal" style={{ animationDelay: '0.2s' }}>
              {productData.image.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setImage(item)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300
                    ${item === image ? "border-primary-500 scale-105" : "border-transparent hover:border-primary-200"}`}
                >
                  <img src={item} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col animate-hero-reveal" style={{ animationDelay: '0.1s' }}>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {productData.difficulty && (
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                  {t(`product.difficulty.${productData.difficulty}`, productData.difficulty)}
                </span>
              )}
              <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-[9px] font-bold uppercase tracking-wider rounded-full border border-primary-100">
                {t(`product.${productData.category}`, productData.category)}
              </span>
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-wider rounded-full">
                {t('product.airPurifying')}
              </span>
            </div>

            {/* Title & Price */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {productData.name}
            </h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                {getPriceDisplay()}{currency}
              </span>
              {productData.sizes && productData.sizes.length > 1 && !size && (
                <span className="text-sm text-gray-400 font-medium italic">/ {t('product.selectSize')}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8 max-w-xl">
              {productData.description}
            </p>

            {/* Care Info Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                <Leaf className="w-4 h-4 text-emerald-500 mb-1.5" />
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">{t('product.difficulty_label')}</span>
                <span className="text-xs font-bold text-gray-800">{t(`product.difficulty.${productData.difficulty}`, productData.difficulty)}</span>
              </div>
              <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                <Sun className="w-4 h-4 text-amber-500 mb-1.5" />
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">{t('product.light_label')}</span>
                <span className="text-xs font-bold text-gray-800">{t('product.light.semi')}</span>
              </div>
              <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex flex-col items-center text-center">
                <Droplets className="w-4 h-4 text-primary-500 mb-1.5" />
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">{t('product.water_label')}</span>
                <span className="text-xs font-bold text-gray-800">{t('product.water_weekly')}</span>
              </div>
            </div>

            {/* Size Selection */}
            {getSizesArray().length > 0 && (
              <div className="mb-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{t('product.selectSize')}</h4>
                <div className="flex flex-wrap gap-2">
                  {getSizesArray().map((item, index) => {
                    const isSelected = size === (typeof item === 'object' ? item.name : item);
                    return (
                      <button
                        key={index}
                        onClick={() => handleSizeSelect(item)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 border
                          ${isSelected ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200" : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"}`}
                      >
                        {typeof item === 'object' ? item.name : item}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {/* Quantity */}
              <div className="flex items-center bg-gray-100 rounded-xl px-2 py-1">
                <button onClick={handleDecrement} className="p-2 text-gray-500 hover:text-primary-600"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-bold text-gray-800">{quantity}</span>
                <button onClick={handleIncrement} className="p-2 text-gray-500 hover:text-primary-600"><Plus className="w-4 h-4" /></button>
              </div>

              <button
                onClick={() => addToCart(productData._id, quantity, size)}
                className="flex-1 py-4 px-8 rounded-xl border-2 border-primary-600 text-primary-700 font-bold text-sm hover:bg-primary-50 transition-colors"
              >
                {t('product.addToCart')}
              </button>
              
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 px-8 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-800 shadow-lg shadow-primary-900/20 transition-all"
              >
                {t('product.buyNow')}
              </button>
            </div>

            {/* Trust List */}
            <div className="space-y-4 pt-6 border-t border-gray-100 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="p-1.5 rounded-full bg-emerald-50"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>
                {t('product.trust_guarantee')}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="p-1.5 rounded-full bg-primary-50"><MessageCircle className="w-4 h-4 text-primary-600" /></div>
                {t('product.trust_advice')}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="p-1.5 rounded-full bg-amber-50"><Truck className="w-4 h-4 text-amber-600" /></div>
                {t('product.trust_delivery')}
              </div>
            </div>

            {/* Contact Card - Mobile only (lg+ dùng sidebar - nhưng hiện tại đã bỏ sidebar nên hiện trên mọi màn hình hoặc tối ưu lại) */}
            <div className="rounded-2xl border border-primary-100 overflow-hidden shadow-sm animate-hero-reveal" style={{ animationDelay: '0.4s' }}>
              {/* Hotline */}
              <div className="bg-primary-50 px-4 py-3 border-b border-primary-100">
                <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-3">
                  {t('product.hotline_title')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="tel:0767925665"
                    className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 border border-primary-100 active:scale-95 transition-transform"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-primary-700">
                        0767925665
                      </span>
                      <span className="text-xs text-gray-500">{t('product.retail')}</span>
                    </div>
                  </a>
                  <a
                    href="tel:0939569235"
                    className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 border border-amber-100 active:scale-95 transition-transform"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-amber-700">
                        0939569235
                      </span>
                      <span className="text-xs text-gray-500">{t('product.wholesale')}</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Clock
                    className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <span>
                    {t('product.delivery_time')}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Truck
                    className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <span>
                    {t('product.delivery_hcm')}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Shield
                    className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <a href="/about" className="hover:text-primary-700">
                    {t('product.warranty_policy')}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <Truck
                    className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <span>
                    {t('product.delivery_province')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="mt-20">
          <div className="flex border-b border-gray-100 mb-10 overflow-x-auto scrollbar-hide">
            {['description', 'reviews', 'care'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative
                  ${activeTab === tab ? "text-primary-700" : "text-gray-400 hover:text-gray-600"}`}
              >
                {t(`product.tab_${tab}`, tab)}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600" />}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === 'description' && (
              <div className="prose prose-primary max-w-none text-gray-600 leading-relaxed animate-fade-in">
                {productData.description}
              </div>
            )}
            {activeTab === 'reviews' && <ReviewList productId={productId} />}
            {activeTab === 'care' && (
              <div className="grid sm:grid-cols-2 gap-8 animate-fade-in">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary-500" /> {t('product.care_water_title')}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{t('product.care_water_desc')}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-500" /> {t('product.care_light_title')}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{t('product.care_light_desc')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24">
          <RelatedProducts
            category={productData.category}
            subCategory={productData.subCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
