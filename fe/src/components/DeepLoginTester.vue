<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Deep Login Tester</h1>
    <p>Comprehensive testing of login API to find tokens</p>
    
    <div style="margin: 20px 0;">
      <div style="margin-bottom: 10px;">
        <label>Username:</label>
        <input v-model="credentials.username" style="margin-left: 10px; padding: 5px;" />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Password:</label>
        <input v-model="credentials.password" type="password" style="margin-left: 10px; padding: 5px;" />
      </div>
      <button @click="testCurlExact" style="margin: 5px; padding: 10px; background: red; color: white;">
        Test Exact Curl
      </button>
      <button @click="testWithCookies" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test with Cookies
      </button>
      <button @click="testResponseHeaders" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test Response Headers
      </button>
      <button @click="testDifferentMethods" style="margin: 5px; padding: 10px; background: orange; color: white;">
        Test Different Methods
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
        <div><strong>Response Headers:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">{{ JSON.stringify(result.headers, null, 2) }}</pre>
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
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const credentials = reactive({
  username: 'wasil',
  password: 'wasil123'
})

const results = ref([])

const testCurlExact = async () => {
  try {
    console.log('Testing with exact curl command structure...')
    
    // Simulate the exact curl command
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: credentials.username,
      password: credentials.password,
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YXNpbCIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUzNzY0NTI1LCJleHAiOjE3NTM3NjU0MjV9._gOtFJoM-ysvOV4ypztQTg0Mkbh615lIOHE4nQpNuBw; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YXNpbCIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUzNzY0NTI1LCJleHAiOjE3NTQzNjkzMjV9.ByTMxw0Tiqbxp67X7187t3edaYftyanrRuUy8ifqfL0'
      }
    })
    
    results.value.push({
      name: 'Exact Curl Command',
      success: true,
      statusCode: response.status,
      headers: response.headers,
      response: response.data,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Exact Curl Command',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testWithCookies = async () => {
  try {
    console.log('Testing with cookies in response...')
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: credentials.username,
      password: credentials.password,
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Check if tokens are in Set-Cookie headers
    const setCookieHeaders = response.headers['set-cookie'] || []
    const accessTokenCookie = setCookieHeaders.find(cookie => cookie.includes('accessToken'))
    const refreshTokenCookie = setCookieHeaders.find(cookie => cookie.includes('refreshToken'))
    
    // Also check for tokens in other headers
    const authorizationHeader = response.headers['authorization']
    const xAccessToken = response.headers['x-access-token']
    const xRefreshToken = response.headers['x-refresh-token']
    
    results.value.push({
      name: 'Test with Cookies',
      success: true,
      statusCode: response.status,
      headers: response.headers,
      response: response.data,
      tokens: {
        accessToken: accessTokenCookie ? 'Found in Set-Cookie' : 
                   authorizationHeader ? 'Found in Authorization' :
                   xAccessToken ? 'Found in X-Access-Token' :
                   response.data.accessToken,
        refreshToken: refreshTokenCookie ? 'Found in Set-Cookie' :
                     xRefreshToken ? 'Found in X-Refresh-Token' :
                     response.data.refreshToken,
        user: response.data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with Cookies',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testResponseHeaders = async () => {
  try {
    console.log('Testing response headers for tokens...')
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: credentials.username,
      password: credentials.password,
      app_id: 8
    })
    
    // Check all headers for tokens
    const allHeaders = response.headers
    const tokenInHeaders = Object.keys(allHeaders).some(key => 
      allHeaders[key] && (
        allHeaders[key].includes('accessToken') || 
        allHeaders[key].includes('refreshToken') ||
        allHeaders[key].includes('Bearer')
      )
    )
    
    results.value.push({
      name: 'Test Response Headers',
      success: true,
      statusCode: response.status,
      headers: response.headers,
      response: response.data,
      tokens: {
        accessToken: tokenInHeaders ? 'Found in headers' : response.data.accessToken,
        refreshToken: tokenInHeaders ? 'Found in headers' : response.data.refreshToken,
        user: response.data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test Response Headers',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testDifferentMethods = async () => {
  const methods = ['POST', 'PUT', 'PATCH']
  
  for (const method of methods) {
    try {
      console.log(`Testing with ${method} method...`)
      
      const response = await axios({
        method: method.toLowerCase(),
        url: 'https://10.15.38.162:3100/api/sso/v1/auth/login',
        data: {
          username: credentials.username,
          password: credentials.password,
          app_id: 8
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      results.value.push({
        name: `Test ${method} Method`,
        success: true,
        statusCode: response.status,
        headers: response.headers,
        response: response.data,
        tokens: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user
        }
      })
      
    } catch (error) {
      results.value.push({
        name: `Test ${method} Method`,
        success: false,
        statusCode: error.response?.status || 'Network Error',
        headers: error.response?.headers || {},
        response: error.response?.data || error.message,
        error: error.response?.data?.message || error.message
      })
    }
  }
}
</script> 