import { reactive, ref, watch } from 'vue'
import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://10.15.38.162:3100/api/sso/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Helper function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// Helper function to set cookie
const setCookie = (name, value, days = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  console.log(`Setting cookie: ${name}=${value}`)
  console.log('All cookies:', document.cookie)
}

// Helper function to delete cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // For HttpOnly cookies, the browser automatically includes them in requests
    // We don't need to manually add Authorization header
    // The server will handle authentication via HttpOnly cookies
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = getCookie('refreshToken')
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', {
            refreshToken: refreshToken
          })
          
          const { accessToken } = response.data
          setCookie('accessToken', accessToken)
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, redirect to login
          deleteCookie('accessToken')
          deleteCookie('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/peta/login'
          return Promise.reject(refreshError)
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export const useAuthStore = () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const isExternal = ref(false)
  const isInternal = ref(false)
  
    // Watch for changes in user data (for debugging if needed)
  // watch(user, (newUser) => {
  //   console.log('useAuthStore: User data changed:', newUser)
  // }, { deep: true })

  const login = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Try different endpoints and see what we get
      console.log('Trying login endpoint...')
      
      let response
      try {
        response = await api.post('/auth/login', {
          username: credentials.username,
          password: credentials.password,
          app_id: 8
        })
        console.log('Success with /auth/login')
      } catch (err) {
        console.log('Failed with /auth/login, trying /login...')
        try {
          response = await api.post('/login', {
            username: credentials.username,
            password: credentials.password,
            app_id: 8
          })
          console.log('Success with /login')
        } catch (err2) {
          console.log('Failed with /login, trying /sso/login...')
          response = await api.post('/sso/login', {
            username: credentials.username,
            password: credentials.password,
            app_id: 8
          })
          console.log('Success with /sso/login')
        }
      }
      
      console.log('Login response:', response.data)
      console.log('Response data type:', typeof response.data)
      console.log('Response data keys:', Object.keys(response.data))
      
      // Since API sends HttpOnly cookies, we can't access them directly from JavaScript
      // But we can check if login was successful and set authentication state
      console.log('API sent HttpOnly cookies, login successful')
      
      // For HttpOnly cookies, we rely on the API response to determine success
      // and let the browser handle the cookies automatically
      
      // Set authentication state based on successful login
      isAuthenticated.value = true
      
      // Create user data from credentials (since API doesn't return user data)
      const userData = {
        username: credentials.username,
        role_id: 4, // Default to external user
        id: Date.now() // Temporary ID
      }
      
      // Set user data immediately
      user.value = userData
      isAuthenticated.value = true
      
      // Store in sessionStorage for this browser session only
      sessionStorage.setItem('user', JSON.stringify(userData))
      // Also store in localStorage for debugging
      localStorage.setItem('user', JSON.stringify(userData))
      
      console.log('Login: User data set:', userData)
      console.log('Login: User data saved to sessionStorage')
      console.log('Login: isAuthenticated set to true')
      console.log('Login: Current user.value:', user.value)
      console.log('Login: Role status - isExternal:', isExternal.value, 'isInternal:', isInternal.value)
      
      // Set role status based on user data
      if (userData.role_id === 4) {
        isExternal.value = true
        isInternal.value = false
      } else {
        isExternal.value = false
        isInternal.value = true
      }
      
      console.log('Authentication state set, HttpOnly cookies handled by browser')
      
      return { 
        success: true,
        user: userData
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    console.log('authStore: Starting logout process...')
    
    // Clear local state
    user.value = null
    isAuthenticated.value = false
    isExternal.value = false
    isInternal.value = false
    error.value = null
    
    // Clear storage
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')
    
    console.log('authStore: Logout completed - all state cleared')
    console.log('authStore: Final state - user:', user.value, 'isAuthenticated:', isAuthenticated.value)
  }

  const checkAuth = async () => {
    // Check if we have user data in sessionStorage (for this browser session)
    let userData = sessionStorage.getItem('user')
    console.log('checkAuth: Raw sessionStorage data:', userData)
    
    // If not in sessionStorage, try localStorage for debugging
    if (!userData) {
      userData = localStorage.getItem('user')
      console.log('checkAuth: Raw localStorage data:', userData)
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('checkAuth: Parsed user data:', parsedUser)
        
        // Set user data and authentication status
        user.value = parsedUser
        isAuthenticated.value = true
        
        console.log('checkAuth: After setting user.value:', user.value)
        console.log('checkAuth: After setting isAuthenticated:', isAuthenticated.value)
        
        // Set role status based on user data
        if (parsedUser.role_id === 4) {
          isExternal.value = true
          isInternal.value = false
        } else {
          isExternal.value = false
          isInternal.value = true
        }
        
        console.log('checkAuth: User authenticated from sessionStorage', user.value)
        console.log('checkAuth: Role status - isExternal:', isExternal.value, 'isInternal:', isInternal.value)
        console.log('checkAuth: Final authStore state - user:', user.value, 'isAuthenticated:', isAuthenticated.value)
        return true
      } catch (e) {
        console.log('checkAuth: Error parsing user data from sessionStorage', e)
        sessionStorage.removeItem('user')
        return false
      }
    }
    
    console.log('checkAuth: No user data found in sessionStorage')
    return false
  }

  const getToken = () => {
    return getCookie('accessToken')
  }
  
  const forceRefreshAuth = () => {
    console.log('forceRefreshAuth: Current state before refresh')
    console.log('  user:', user.value)
    console.log('  isAuthenticated:', isAuthenticated.value)
    console.log('  isExternal:', isExternal.value)
    console.log('  isInternal:', isInternal.value)
    
    // Force check auth again
    checkAuth()
    
    console.log('forceRefreshAuth: Current state after refresh')
    console.log('  user:', user.value)
    console.log('  isAuthenticated:', isAuthenticated.value)
    console.log('  isExternal:', isExternal.value)
    console.log('  isInternal:', isInternal.value)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isExternal,
    isInternal,
    login,
    logout,
    checkAuth,
    forceRefreshAuth,
    getToken,
    api
  }
} 