<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Login Tester</h1>
    <p>Testing login and token storage</p>
    
    <div style="margin: 20px 0;">
      <div style="margin-bottom: 10px;">
        <label>Username:</label>
        <input v-model="credentials.username" style="margin-left: 10px; padding: 5px;" />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Password:</label>
        <input v-model="credentials.password" type="password" style="margin-left: 10px; padding: 5px;" />
      </div>
      <button @click="testLogin" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test Login
      </button>
      <button @click="checkCookies" style="margin: 5px; padding: 10px; background: green; color: white;">
        Check Cookies
      </button>
    </div>
    
    <div v-if="loginResult" style="margin: 20px 0;">
      <h3>Login Result:</h3>
      <div :style="{ 
        padding: '15px', 
        margin: '10px 0', 
        borderRadius: '4px',
        backgroundColor: loginResult.success ? '#d4edda' : '#f8d7da',
        border: loginResult.success ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
        color: loginResult.success ? '#155724' : '#721c24'
      }">
        <strong>Success:</strong> {{ loginResult.success ? 'Yes' : 'No' }}<br>
        <span v-if="loginResult.response"><strong>Response:</strong> {{ JSON.stringify(loginResult.response, null, 2) }}</span>
        <span v-if="loginResult.error"><strong>Error:</strong> {{ loginResult.error }}</span>
      </div>
    </div>
    
    <div v-if="cookieStatus" style="margin: 20px 0;">
      <h3>Cookie Status:</h3>
      <div style="padding: 15px; margin: 10px 0; border-radius: 4px; background: #f8f9fa; border: 1px solid #dee2e6;">
        <strong>All Cookies:</strong> {{ cookieStatus.allCookies }}<br>
        <strong>Access Token:</strong> {{ cookieStatus.accessToken || 'Not found' }}<br>
        <strong>Refresh Token:</strong> {{ cookieStatus.refreshToken || 'Not found' }}<br>
        <strong>User Data:</strong> {{ cookieStatus.userData || 'Not found' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const credentials = reactive({
  username: 'wasil',
  password: 'wasil123'
})

const loginResult = ref(null)
const cookieStatus = ref(null)

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const testLogin = async () => {
  try {
    console.log('Testing login with:', credentials)
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: credentials.username,
      password: credentials.password,
      app_id: 8
    })
    
    console.log('Raw login response:', response)
    console.log('Response data:', response.data)
    console.log('Response data type:', typeof response.data)
    console.log('Response data keys:', Object.keys(response.data))
    
    loginResult.value = {
      success: true,
      response: response.data
    }
    
    // Check if tokens are in response
    const { accessToken, refreshToken, user: userData } = response.data
    
    if (accessToken && refreshToken) {
      console.log('Tokens found in response, setting cookies...')
      
      // Set cookies manually
      const expires = new Date()
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000))
      document.cookie = `accessToken=${accessToken};expires=${expires.toUTCString()};path=/`
      
      const refreshExpires = new Date()
      refreshExpires.setTime(refreshExpires.getTime() + (30 * 24 * 60 * 60 * 1000))
      document.cookie = `refreshToken=${refreshToken};expires=${refreshExpires.toUTCString()};path=/`
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData))
      
      console.log('Cookies set, checking...')
      checkCookies()
    } else {
      console.log('No tokens found in response')
      loginResult.value.error = 'No tokens found in response'
    }
    
  } catch (error) {
    console.error('Login error:', error)
    loginResult.value = {
      success: false,
      error: error.response?.data?.message || error.message
    }
  }
}

const checkCookies = () => {
  const accessToken = getCookie('accessToken')
  const refreshToken = getCookie('refreshToken')
  const userData = localStorage.getItem('user')
  
  cookieStatus.value = {
    allCookies: document.cookie,
    accessToken,
    refreshToken,
    userData: userData ? JSON.parse(userData) : null
  }
  
  console.log('Cookie status:', cookieStatus.value)
}
</script> 