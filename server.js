const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const https = require('https');
const cors = require('cors');



const corsOptions = {
  origin: '*', // Mengizinkan semua origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], // Semua metode HTTP yang diizinkan
  allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
  credentials: true, // Mengizinkan pengiriman cookies dan otentikasi
};

const app = express();
// Sertifikat SSL lokal
const sslOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

app.use(cors(corsOptions));


// Proxy untuk route API
app.use('/api/rtlh', createProxyMiddleware({
    target: 'http://localhost:5000', // Ganti dengan alamat backend yang sesuai
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^/api/rtlh': '/api', // Menghapus '/api/rtlh' jika diperlukan
    }
}));

app.use('/api/sso', createProxyMiddleware({
    target: 'http://127.0.0.1:5300',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^/': '/', 
    }
}));

app.use('/api/web', createProxyMiddleware({
    target: 'http://localhost:5100', // Ganti dengan alamat backend yang sesuai
    changeOrigin: true,
    secure: true,
    pathRewrite: {
        '^/api/web': '/api/web', // Menghapus '/api/web' jika diperlukan
    }
}));

// Proxy untuk file statis dan Next.js
app.use('/_next', createProxyMiddleware({
  target: 'http://localhost:7000/_next', // Server Next.js untuk menangani file _next
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/_next': '/_next',  // Menjaga jalur path yang benar untuk file Next.js
  }
}));

app.use('/images', createProxyMiddleware({
  target: 'http://localhost:7000/images', // Server Next.js untuk menangani gambar
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/images': '/images',  // Menjaga jalur path yang benar untuk folder gambar
  }
}));


app.use('/web', createProxyMiddleware({
  target: 'http://localhost:7000', // Server Next.js untuk menangani gambar
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/': '/',  // Menjaga jalur path yang benar untuk folder gambar
  }
}));

app.use('/sso/_next', createProxyMiddleware({
  target: 'http://localhost:7500/sso/_next',
  changeOrigin: true,
  secure: true, // sesuaikan ya
  pathRewrite: {
    '^/sso/_next': '/_next',
  },
}));

app.use('/sso', createProxyMiddleware({
  target: 'http://localhost:7500/sso',
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/': '',
  }, 
}));

// Mulai server Express
https.createServer(sslOptions, app).listen(3100, () => {
    console.log('✅ HTTPS Proxy server running on https://127.0.0.1:3100');
});
