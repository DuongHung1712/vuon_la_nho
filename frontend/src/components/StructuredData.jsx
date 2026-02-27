import React from 'react';
import { Helmet } from 'react-helmet-async';

const JsonLd = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

// Organization Schema
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vườn Lá Nhỏ",
    "url": "https://vuonlanho.com",
    "logo": "https://vuonlanho.com/favicon.png",
    "description": "Chuyên cung cấp cây cảnh trong nhà và ngoài trời chất lượng cao",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "401 Lê Lợi, khóm Tân Mỹ",
      "addressLocality": "Sa Đéc",
      "addressRegion": "Đồng Tháp",
      "postalCode": "870000",
      "addressCountry": "VN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-767925665",
      "contactType": "customer service",
      "email": "duonghung171204sd@gmail.com",
      "availableLanguage": ["Vietnamese"]
    },
    "sameAs": [
      "https://facebook.com/vuonlanho",
      "https://instagram.com/vuonlanho"
    ]
  };

  return <JsonLd data={schema} />;
};

// Product Schema
export const ProductSchema = ({ product, currency = 'VND' }) => {
  const getPriceRange = () => {
    if (product.sizes && product.sizes.length > 0) {
      const prices = product.sizes.map(s => s.price);
      return {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
      };
    }
    return { minPrice: product.price, maxPrice: product.price };
  };

  const { minPrice, maxPrice } = getPriceRange();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product._id,
    "brand": {
      "@type": "Brand",
      "name": "Vườn Lá Nhỏ"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://vuonlanho.com/product/${product._id}`,
      "priceCurrency": currency,
      "price": minPrice,
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Vườn Lá Nhỏ"
      }
    }
  };

  // Add aggregateRating if product has reviews
  if (product.rating && product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return <JsonLd data={schema} />;
};

// Breadcrumb Schema
export const BreadcrumbSchema = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://vuonlanho.com${item.url}`
    }))
  };

  return <JsonLd data={schema} />;
};

// Website Schema
export const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vườn Lá Nhỏ",
    "url": "https://vuonlanho.com",
    "description": "Cung cấp cây cảnh trong nhà và ngoài trời chất lượng cao",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vuonlanho.com/collection?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return <JsonLd data={schema} />;
};

export default JsonLd;
