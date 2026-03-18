import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/mongodb.js';
import productModel from '../models/productModel.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL chính của trang web (cập nhật khi deploy)
const SITE_URL = process.env.FRONTEND_URL || 'https://vuonlanho.store';

// Đường dẫn lưu file sitemap (thư mục public của frontend)
const SITEMAP_PATH = path.resolve(__dirname, '../../frontend/public/sitemap.xml');

const generateSitemap = async () => {
  try {
    console.log('Connecting to database...');
    // Connect to specific MongoDB DB and then fetch items
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    console.log('Fetching products...');
    const products = await productModel.find({}).select('_id date');
    
    console.log(`Found ${products.length} products.`);

    let sitemapItems = ``;
    
    // Thêm các trang tĩnh (Home, Collection, About, Contact)
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/collection', priority: '0.9', changefreq: 'daily' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/contact', priority: '0.8', changefreq: 'monthly' }
    ];

    staticPages.forEach(page => {
      sitemapItems += `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Thêm các trang sản phẩm động
    products.forEach(product => {
      // Giả sử date là timestamp dạng number hoặc timestamp. Convert về ISO string
      let lastmod = new Date().toISOString(); 
      if (product.date) {
        lastmod = new Date(product.date).toISOString();
      }

      sitemapItems += `
  <url>
    <loc>${SITE_URL}/product/${product._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapItems}
</urlset>
    `;

    // Lưu file vào public của frontend
    fs.writeFileSync(SITEMAP_PATH, sitemapXML.trim());
    console.log(`Success! Sitemap path: ${SITEMAP_PATH}`);

  } catch (error) {
    console.error('Error generating Sitemap:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Start Generator
generateSitemap();
