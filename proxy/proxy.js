const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

const app = express ();

const corsOptions = {
  origin: '*', // Mengizinkan semua origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], // Semua metode HTTP yang diizinkan
  allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
  credentials: true, // Mengizinkan pengiriman cookies dan otentikasi
};

//const app = express();
// Sertifikat SSL lokal
//const sslOptions = {
//    key: fs.readFileSync('./key.pem'),
//    cert: fs.readFileSync('./cert.pem')
//};

app.use(cors(corsOptions));


// Proxy untuk route API
app.use('/', createProxyMiddleware({
    target: 'http://localhost:9200', // Ganti dengan alamat backend yang sesuai
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^api': '/', // Menghapus '/api/rtlh' jika diperlukan
}}));

// Proxy untuk route API
app.use('/map', createProxyMiddleware({
    target: 'http://localhost:9100', // Ganti dengan alamat backend yang sesuai
    changeOrigin: true,
    secure: false,
    pathRewrite: {
        '^/map': '/', // Menghapus '/api/rtlh' jika diperlukan
}}));

// Mulai server Express
//https.createServer(sslOptions, app).listen(9000, () => {
app.listen (9000, () => {
    console.log('✅ HTTPS Proxy server running on https://127.0.0.1:9000');
});
