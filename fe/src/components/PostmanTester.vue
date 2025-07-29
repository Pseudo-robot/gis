<template>
  <div style="background: white; min-height: 100vh;">
    <PageHeader />
    <div style="padding: 20px;">
      <h1>Postman Tester</h1>
      <p>Testing with exact Postman credentials and structure</p>
    
    <div style="margin: 20px 0;">
      <div style="margin-bottom: 10px;">
        <label>Username:</label>
        <input v-model="credentials.username" style="margin-left: 10px; padding: 5px;" />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Password:</label>
        <input v-model="credentials.password" type="password" style="margin-left: 10px; padding: 5px;" />
      </div>
      <button @click="testPostmanExact" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test Postman Exact
      </button>
      <button @click="testWithNukiCredentials" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test with Nuki Credentials
      </button>
      <button @click="testAllCredentials" style="margin: 5px; padding: 10px; background: orange; color: white;">
        Test All Credentials
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
        <div><strong>Response Time:</strong> {{ result.responseTime }}ms</div>
        <div><strong>Response Size:</strong> {{ result.responseSize }}B</div>
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
import { ref, reactive } from 'vue'
import axios from 'axios'
import PageHeader from './PageHeader.vue'

const credentials = reactive({
  username: 'nuki',
  password: 'nuki123'
})

const results = ref([])

const testPostmanExact = async () => {
  try {
    console.log('Testing with exact Postman structure...')
    const startTime = Date.now()
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: credentials.username,
      password: credentials.password,
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    // Extract Set-Cookie headers
    const setCookies = response.headers['set-cookie'] || []
    
    // Check for tokens in various headers
    const authorizationHeader = response.headers['authorization']
    const xAccessToken = response.headers['x-access-token']
    const xRefreshToken = response.headers['x-refresh-token']
    const accessTokenCookie = setCookies.find(cookie => cookie.includes('accessToken'))
    const refreshTokenCookie = setCookies.find(cookie => cookie.includes('refreshToken'))
    
    results.value.push({
      name: 'Postman Exact Test',
      success: true,
      statusCode: response.status,
      responseTime: responseTime,
      responseSize: JSON.stringify(response.data).length,
      headers: response.headers,
      setCookies: setCookies,
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
      name: 'Postman Exact Test',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      responseTime: 0,
      responseSize: 0,
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testWithNukiCredentials = async () => {
  try {
    console.log('Testing with nuki credentials...')
    const startTime = Date.now()
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    const setCookies = response.headers['set-cookie'] || []
    const authorizationHeader = response.headers['authorization']
    const xAccessToken = response.headers['x-access-token']
    const xRefreshToken = response.headers['x-refresh-token']
    const accessTokenCookie = setCookies.find(cookie => cookie.includes('accessToken'))
    const refreshTokenCookie = setCookies.find(cookie => cookie.includes('refreshToken'))
    
    results.value.push({
      name: 'Nuki Credentials Test',
      success: true,
      statusCode: response.status,
      responseTime: responseTime,
      responseSize: JSON.stringify(response.data).length,
      headers: response.headers,
      setCookies: setCookies,
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
      name: 'Nuki Credentials Test',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      responseTime: 0,
      responseSize: 0,
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testAllCredentials = async () => {
  const testUsers = [
    { username: 'nuki', password: 'nuki123' },
    { username: 'wasil', password: 'wasil123' },
    { username: 'admin', password: 'admin123' },
    { username: 'test', password: 'test123' }
  ]
  
  for (const user of testUsers) {
    try {
      console.log(`Testing with ${user.username}...`)
      const startTime = Date.now()
      
      const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
        username: user.username,
        password: user.password,
        app_id: 8
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      const setCookies = response.headers['set-cookie'] || []
      const authorizationHeader = response.headers['authorization']
      const xAccessToken = response.headers['x-access-token']
      const xRefreshToken = response.headers['x-refresh-token']
      const accessTokenCookie = setCookies.find(cookie => cookie.includes('accessToken'))
      const refreshTokenCookie = setCookies.find(cookie => cookie.includes('refreshToken'))
      
      results.value.push({
        name: `${user.username} Credentials Test`,
        success: true,
        statusCode: response.status,
        responseTime: responseTime,
        responseSize: JSON.stringify(response.data).length,
        headers: response.headers,
        setCookies: setCookies,
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
        name: `${user.username} Credentials Test`,
        success: false,
        statusCode: error.response?.status || 'Network Error',
        responseTime: 0,
        responseSize: 0,
        headers: error.response?.headers || {},
        setCookies: [],
        response: error.response?.data || error.message,
        error: error.response?.data?.message || error.message
      })
    }
  }
}
</script> 