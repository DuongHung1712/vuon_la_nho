const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Proxy tất cả request bắt đầu bằng /api tới backend service
app.use('/api', createProxyMiddleware({
  target: 'http://backend:4000',
  changeOrigin: true,
}));

// Endpoint test
app.get('/', (req, res) => {
  res.send('API Gateway đang chạy');
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
