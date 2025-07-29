<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Token Status</h1>
    <p>Checking stored authentication tokens</p>
    
    <div style="margin: 20px 0;">
      <button @click="checkTokens" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Check Tokens
      </button>
      <button @click="clearTokens" style="margin: 5px; padding: 10px; background: red; color: white;">
        Clear Tokens
      </button>
    </div>
    
    <div v-if="tokenStatus" style="margin: 20px 0;">
      <h3>Token Status:</h3>
      <div style="padding: 15px; margin: 10px 0; border-radius: 4px; background: #f8f9fa; border: 1px solid #dee2e6;">
        <strong>Access Token:</strong> 
        <span :style="{ color: tokenStatus.accessToken ? 'green' : 'red' }">
          {{ tokenStatus.accessToken ? 'Present' : 'Not Found' }}
        </span><br>
        
        <strong>Refresh Token:</strong> 
        <span :style="{ color: tokenStatus.refreshToken ? 'green' : 'red' }">
          {{ tokenStatus.refreshToken ? 'Present' : 'Not Found' }}
        </span><br>
        
        <strong>User Data:</strong> 
        <span :style="{ color: tokenStatus.userData ? 'green' : 'red' }">
          {{ tokenStatus.userData ? 'Present' : 'Not Found' }}
        </span><br>
        
        <strong>Authentication Status:</strong> 
        <span :style="{ color: tokenStatus.isAuthenticated ? 'green' : 'red' }">
          {{ tokenStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}
        </span>
      </div>
      
      <div v-if="tokenStatus.accessToken" style="margin: 20px 0; padding: 15px; background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px;">
        <h4>Token Details:</h4>
        <p><strong>Access Token:</strong> {{ tokenStatus.accessToken.substring(0, 50) }}...</p>
        <p><strong>Refresh Token:</strong> {{ tokenStatus.refreshToken.substring(0, 50) }}...</p>
        <p v-if="tokenStatus.userData"><strong>User:</strong> {{ tokenStatus.userData.username }}</p>
      </div>
    </div>
    
    <div v-if="testResult" style="margin: 20px 0;">
      <h3>Test Registration with Current Tokens:</h3>
      <div :style="{ 
        padding: '15px', 
        margin: '10px 0', 
        borderRadius: '4px',
        backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
        border: testResult.success ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
        color: testResult.success ? '#155724' : '#721c24'
      }">
        <strong>Status:</strong> {{ testResult.success ? 'Success' : 'Failed' }}<br>
        <strong>Response:</strong> {{ testResult.message }}<br>
        <span v-if="testResult.error"><strong>Error:</strong> {{ testResult.error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const tokenStatus = ref(null)
const testResult = ref(null)

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const checkTokens = () => {
  const accessToken = getCookie('accessToken')
  const refreshToken = getCookie('refreshToken')
  const userData = localStorage.getItem('user')
  
  tokenStatus.value = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    userData: userData ? JSON.parse(userData) : null,
    isAuthenticated: !!(accessToken && userData)
  }
  
  console.log('Token Status:', tokenStatus.value)
}

const clearTokens = () => {
  // Clear cookies
  document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
  document.cookie = 'refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
  
  // Clear localStorage
  localStorage.removeItem('user')
  
  tokenStatus.value = null
  testResult.value = null
  
  console.log('Tokens cleared')
}

const testRegistration = async () => {
  if (!tokenStatus.value?.accessToken) {
    testResult.value = {
      success: false,
      message: 'No access token available',
      error: 'Please login first to get authentication tokens'
    }
    return
  }
  
  try {
    const testData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      role_id: 4
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokenStatus.value.accessToken}`
    }
    
    if (tokenStatus.value.refreshToken) {
      headers.Cookie = `refreshToken=${tokenStatus.value.refreshToken}`
    }
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/user', testData, {
      headers,
      timeout: 10000
    })
    
    testResult.value = {
      success: true,
      message: 'Registration test successful',
      response: response.data
    }
    
  } catch (error) {
    testResult.value = {
      success: false,
      message: 'Registration test failed',
      error: error.response?.data?.message || error.message
    }
  }
}

// Auto check tokens on mount
checkTokens()
</script> 