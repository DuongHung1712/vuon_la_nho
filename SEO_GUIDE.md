# 📊 Hướng Dẫn SEO - Vườn Lá Nhỏ

## 🎯 Tổng Quan

Website đã được tối ưu SEO với các thành phần sau:

- ✅ React Helmet Async cho meta tags động
- ✅ Structured Data (JSON-LD) cho Google
- ✅ robots.txt và sitemap.xml
- ✅ Open Graph tags cho social media
- ✅ Responsive và mobile-friendly

---

## 📁 Cấu Trúc Files SEO

```
frontend/
├── public/
│   ├── robots.txt          # Hướng dẫn cho search engine crawlers
│   └── sitemap.xml         # Danh sách URLs cho Google
├── src/
│   └── components/
│       ├── SEO.jsx         # Component meta tags động
│       └── StructuredData.jsx  # Rich snippets cho Google
```

---

## 🚀 Cách Sử Dụng SEO Component

### 1. Basic Usage (Home, About, Contact)

```jsx
import SEO from "../components/SEO";

const MyPage = () => {
  return (
    <>
      <SEO
        title="Tiêu đề trang - Vườn Lá Nhỏ"
        description="Mô tả ngắn gọn về trang (150-160 ký tự)"
        keywords="từ khóa 1, từ khóa 2, từ khóa 3"
      />
      {/* Nội dung trang */}
    </>
  );
};
```

### 2. Product Page SEO

```jsx
import SEO from "../components/SEO";
import { ProductSchema } from "../components/StructuredData";

const ProductPage = ({ product }) => {
  return (
    <>
      <SEO
        title={`${product.name} - Vườn Lá Nhỏ`}
        description={product.description}
        ogImage={product.image[0]}
        ogType="product"
      />
      <ProductSchema product={product} />
      {/* Nội dung sản phẩm */}
    </>
  );
};
```

### 3. Structured Data (JSON-LD)

Đã implement sẵn:

- ✅ `OrganizationSchema` - Thông tin doanh nghiệp
- ✅ `WebsiteSchema` - Thông tin website và search
- ✅ `ProductSchema` - Thông tin sản phẩm
- ✅ `BreadcrumbSchema` - Breadcrumb navigation

---

## 📋 Checklist SEO

### ✅ On-Page SEO (Đã hoàn thành)

- [x] Meta title duy nhất cho mỗi trang
- [x] Meta description hấp dẫn (150-160 chars)
- [x] Keywords phù hợp
- [x] H1 tag (Title component)
- [x] Alt text cho images (cần review)
- [x] Canonical URLs
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured Data (JSON-LD)

### ✅ Technical SEO (Đã hoàn thành)

- [x] Mobile responsive
- [x] robots.txt
- [x] sitemap.xml
- [x] Clean URLs
- [x] HTTPS (cần khi deploy)
- [x] Fast loading (React optimized)

### ⏳ Content SEO (Cần làm)

- [ ] Viết content chất lượng cho mỗi sản phẩm
- [ ] Thêm blog/article section
- [ ] Internal linking strategy
- [ ] Image optimization (WebP format)
- [ ] Video content

### 🔄 Off-Page SEO (Cần làm khi deploy)

- [ ] Google Search Console setup
- [ ] Google Analytics setup
- [ ] Google My Business
- [ ] Backlinks strategy
- [ ] Social media integration
- [ ] Local SEO (Google Maps)

---

## 🛠️ Cấu Hình Khi Deploy

### 1. Cập nhật URLs trong các files:

**SEO.jsx** - Line 13:

```jsx
const siteUrl = "https://your-actual-domain.com"; // Thay đổi
```

**StructuredData.jsx** - Multiple locations:

```jsx
"url": "https://your-actual-domain.com"
```

**robots.txt**:

```
Sitemap: https://your-actual-domain.com/sitemap.xml
```

**sitemap.xml** - Update all `<loc>` tags:

```xml
<loc>https://your-actual-domain.com/</loc>
```

### 2. Google Search Console

1. Truy cập: https://search.google.com/search-console
2. Add property với domain của bạn
3. Verify ownership (thêm meta tag hoặc upload file)
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### 3. Google Analytics

1. Tạo GA4 property tại: https://analytics.google.com
2. Thêm tracking code vào `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

---

## 📊 Testing SEO

### Tools để test:

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test structured data

2. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Test performance và Core Web Vitals

3. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Test Open Graph tags

4. **Lighthouse (Chrome DevTools)**
   - Mở DevTools > Lighthouse
   - Run audit cho SEO, Performance, Accessibility

---

## 🎯 Best Practices

### Meta Titles

- ✅ 50-60 ký tự
- ✅ Bao gồm keyword chính
- ✅ Có brand name (Vườn Lá Nhỏ)
- ❌ Không duplicate

### Meta Descriptions

- ✅ 150-160 ký tự
- ✅ Hấp dẫn, có call-to-action
- ✅ Bao gồm keywords tự nhiên
- ❌ Không keyword stuffing

### Images

```jsx
// ✅ Good
<img src="cay-sen-da.jpg" alt="Cây sen đá nhỏ màu xanh lá" />

// ❌ Bad
<img src="image1.jpg" alt="image" />
```

### URLs

```
✅ Good: /product/cay-sen-da-xanh-la
❌ Bad:  /product/123456
```

---

## 🔄 Cập Nhật Sitemap Động

Khi thêm sản phẩm mới, cập nhật `sitemap.xml`:

```xml
<url>
  <loc>https://vuonlanho.com/product/product-id</loc>
  <lastmod>2026-02-27</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

**Hoặc tạo script tự động:**

```javascript
// backend/scripts/generateSitemap.js
// TODO: Create dynamic sitemap generator
```

---

## 📈 Monitoring & Analytics

### Metrics quan trọng:

- Organic traffic
- Keyword rankings
- Click-through rate (CTR)
- Bounce rate
- Page load time
- Core Web Vitals

### Tools:

- Google Search Console
- Google Analytics 4
- Google PageSpeed Insights
- SEMrush / Ahrefs (paid)

---

## 🐛 Common Issues & Solutions

### Issue 1: Meta tags không update khi navigate

**Solution:** Đã sử dụng react-helmet-async với HelmetProvider

### Issue 2: Product images không hiển thị trong social shares

**Solution:** Đảm bảo ogImage là absolute URL

### Issue 3: Google không index trang

**Solution:**

1. Check robots.txt không block
2. Submit sitemap trong Search Console
3. Request indexing manually

---

## 📚 Resources

- [Google Search Central](https://developers.google.com/search)
- [React Helmet Async Docs](https://github.com/staylor/react-helmet-async)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)

---

## ✨ Next Steps

1. ✅ **Đã xong:** Basic SEO setup
2. 🔄 **Đang làm:** Content optimization
3. ⏳ **Sắp làm:** Deploy và config production URLs
4. ⏳ **Sau đó:** Google Search Console + Analytics
5. ⏳ **Cuối cùng:** Local SEO + Backlinks

---

**Liên hệ:** duonghung171204sd@gmail.com  
**Last Updated:** February 27, 2026
