import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(router)

// Check authentication before mounting
const checkAuthAndMount = async () => {
  const authStore = useAuthStore()
  const isAuthenticated = await authStore.checkAuth()
  
  console.log('Main.js - Authentication check result:', isAuthenticated)
  
  // If authenticated and on login page, redirect to home
  if (isAuthenticated && window.location.pathname === '/peta/login') {
    console.log('Main.js - Redirecting authenticated user from login to home')
    window.location.href = '/peta/home'
    return
  }
  
  // If authenticated and on root path, redirect to home
  if (isAuthenticated && window.location.pathname === '/peta/') {
    console.log('Main.js - Redirecting authenticated user from root to home')
    window.location.href = '/peta/home'
    return
  }
  
  app.mount('#app')
}

checkAuthAndMount()
