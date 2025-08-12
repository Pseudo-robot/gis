import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/gis-fe',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: 9100,
    https: false,
    hmr: {
      port: 9200,
      host: 'localhost',
      protocol: 'wss'
    },
    proxy: {
      '/api/peta': {
        target: 'https://localhost:9200/api', // Ganti dengan URL backend Anda
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/admin': {
        target: 'https://localhost:9200', // GIS backend
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending request to:', proxyReq.path);
          });
        }
      },
      '/auth': {
        target: 'https://localhost:9200', // GIS backend
        changeOrigin: true,
        secure: false
      }
    }
  }
})
