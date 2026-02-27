import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Vườn Lá Nhỏ - Cây Cảnh Chất Lượng Cao',
  description = 'Vườn Lá Nhỏ cung cấp cây cảnh trong nhà và ngoài trời chất lượng cao. Đa dạng loại cây, giá tốt, giao hàng tận nơi. Tư vấn chăm sóc tận tình.',
  keywords = 'cây cảnh, cây trong nhà, cây ngoài trời, mua cây cảnh online, vườn lá nhỏ, cây trang trí',
  ogImage = '/favicon.png',
  ogUrl,
  ogType = 'website',
  article = false,
  noindex = false
}) => {
  const siteUrl = 'https://vuonlanho.com'; // Thay đổi thành URL thực của bạn
  const fullUrl = ogUrl || window.location.href;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Vườn Lá Nhỏ" />
      <meta property="og:locale" content="vi_VN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Article specific tags */}
      {article && (
        <>
          <meta property="article:publisher" content="Vườn Lá Nhỏ" />
          <meta property="article:author" content="Vườn Lá Nhỏ" />
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Additional SEO */}
      <meta name="author" content="Vườn Lá Nhỏ" />
      <meta name="language" content="Vietnamese" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
};

export default SEO;
