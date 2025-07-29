<template>
  <div style="background: white; min-height: 100vh;">
    <PageHeader />
    <div style="padding: 20px;">
      <h1>Token Discovery Tester</h1>
      <p>Discovering where tokens might be located</p>
    
    <div style="margin: 20px 0;">
      <button @click="testSetCookieHeaders" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test Set-Cookie Headers
      </button>
      <button @click="testResponseHeaders" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test All Response Headers
      </button>
      <button @click="testAfterLogin" style="margin: 5px; padding: 10px; background: orange; color: white;">
        Test After Login
      </button>
      <button @click="testAuthMe" style="margin: 5px; padding: 10px; background: red; color: white;">
        Test Auth Me
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
        <div><strong>All Headers:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">{{ JSON.stringify(result.headers, null, 2) }}</pre>
        <div><strong>Set-Cookie Headers:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">{{ JSON.stringify(result.setCookies, null, 2) }}</pre>
        <div><strong>Response Body:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">{{ JSON.stringify(result.response, null, 2) }}</pre>
        <div v-if="result.error"><strong>Error:</strong> {{ result.error }}</div>
        <div v-if="result.tokens"><strong>Tokens Found:</strong></div>
        <ul v-if="result.tokens">
          <li>Access Token: {{ result.tokens.accessToken || 'Not found' }}</li>
          <li>Refresh Token: {{ result.tokens.refreshToken || 'Not found' }}</li>
          <li>User: {{ result.tokens.user ? 'Found' : 'Not found' }}</li>
        </ul>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import PageHeader from './PageHeader.vue'

const results = ref([])

const testSetCookieHeaders = async () => {
  try {
    console.log('Testing Set-Cookie headers...')
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Extract Set-Cookie headers
    const setCookies = response.headers['set-cookie'] || []
    console.log('Set-Cookie headers:', setCookies)
    
    // Check for tokens in cookies
    const accessTokenCookie = setCookies.find(cookie => 
      cookie.includes('accessToken') || cookie.includes('access_token') || cookie.includes('token')
    )
    const refreshTokenCookie = setCookies.find(cookie => 
      cookie.includes('refreshToken') || cookie.includes('refresh_token')
    )
    
    results.value.push({
      name: 'Set-Cookie Headers Test',
      success: true,
      statusCode: response.status,
      headers: response.headers,
      setCookies: setCookies,
      response: response.data,
      tokens: {
        accessToken: accessTokenCookie ? `Found in Set-Cookie: ${accessTokenCookie}` : 'Not found',
        refreshToken: refreshTokenCookie ? `Found in Set-Cookie: ${refreshTokenCookie}` : 'Not found',
        user: response.data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Set-Cookie Headers Test',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testResponseHeaders = async () => {
  try {
    console.log('Testing all response headers...')
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Check all headers for tokens
    const allHeaders = response.headers
    const tokenHeaders = {}
    
    Object.keys(allHeaders).forEach(key => {
      const value = allHeaders[key]
      if (value && (
        value.includes('accessToken') || 
        value.includes('refreshToken') ||
        value.includes('token') ||
        value.includes('Bearer') ||
        value.includes('Authorization')
      )) {
        tokenHeaders[key] = value
      }
    })
    
    results.value.push({
      name: 'All Response Headers Test',
      success: true,
      statusCode: response.status,
      headers: response.headers,
      setCookies: response.headers['set-cookie'] || [],
      response: response.data,
      tokens: {
        accessToken: Object.keys(tokenHeaders).length > 0 ? `Found in headers: ${JSON.stringify(tokenHeaders)}` : 'Not found',
        refreshToken: Object.keys(tokenHeaders).length > 0 ? `Found in headers: ${JSON.stringify(tokenHeaders)}` : 'Not found',
        user: response.data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'All Response Headers Test',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testAfterLogin = async () => {
  try {
    console.log('Testing after login...')
    
    // First, do login
    const loginResponse = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Then try to get user info or tokens
    const userResponse = await axios.get('https://10.15.38.162:3100/api/sso/v1/auth/me', {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': document.cookie
      }
    })
    
    results.value.push({
      name: 'After Login Test',
      success: true,
      statusCode: userResponse.status,
      headers: userResponse.headers,
      setCookies: userResponse.headers['set-cookie'] || [],
      response: userResponse.data,
      tokens: {
        accessToken: userResponse.data.accessToken,
        refreshToken: userResponse.data.refreshToken,
        user: userResponse.data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'After Login Test',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testAuthMe = async () => {
  try {
    console.log('Testing /auth/me endpoint...')
    
    const response = await axios.get('https://10.15.38.162:3100/api/sso/v1/auth/me', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    results.value.push({
      name: 'Auth Me Test',
      success: true,
      statusCode: response.status,
      headers: response.headers,
      setCookies: response.headers['set-cookie'] || [],
      response: response.data,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Auth Me Test',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}
</script> 