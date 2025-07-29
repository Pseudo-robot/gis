<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Alternative Login Tester</h1>
    <p>Testing alternative login approaches and endpoints</p>
    
    <div style="margin: 20px 0;">
      <button @click="testAlternativeEndpoints" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test Alternative Endpoints
      </button>
      <button @click="testWithDifferentData" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test with Different Data
      </button>
      <button @click="testAuthMe" style="margin: 5px; padding: 10px; background: orange; color: white;">
        Test Auth Me
      </button>
      <button @click="testRefreshToken" style="margin: 5px; padding: 10px; background: red; color: white;">
        Test Refresh Token
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
        <div><strong>Endpoint:</strong> {{ result.endpoint }}</div>
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
import { ref } from 'vue'
import axios from 'axios'

const results = ref([])

const testAlternativeEndpoints = async () => {
  const endpoints = [
    '/api/sso/v1/login',
    '/api/sso/v1/sso/login',
    '/api/sso/v1/auth/sso/login',
    '/api/sso/v1/api/auth/login',
    '/api/sso/v1/api/login',
    '/api/sso/v1/api/sso/login',
    '/api/sso/v1/user/login',
    '/api/sso/v1/users/login',
    '/api/sso/v1/auth/user/login'
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`)
      
      const response = await axios.post(`https://10.15.38.162:3100${endpoint}`, {
        username: 'nuki',
        password: 'nuki123',
        app_id: 8
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      results.value.push({
        name: `Alternative Endpoint: ${endpoint}`,
        success: true,
        statusCode: response.status,
        endpoint: endpoint,
        response: response.data,
        tokens: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user
        }
      })
      
    } catch (error) {
      results.value.push({
        name: `Alternative Endpoint: ${endpoint}`,
        success: false,
        statusCode: error.response?.status || 'Network Error',
        endpoint: endpoint,
        response: error.response?.data || error.message,
        error: error.response?.data?.message || error.message
      })
    }
  }
}

const testWithDifferentData = async () => {
  const testCases = [
    {
      name: 'With email instead of username',
      data: {
        email: 'nuki@example.com',
        password: 'nuki123',
        app_id: 8
      }
    },
    {
      name: 'With user_id',
      data: {
        user_id: 'nuki',
        password: 'nuki123',
        app_id: 8
      }
    },
    {
      name: 'With login field',
      data: {
        login: 'nuki',
        password: 'nuki123',
        app_id: 8
      }
    },
    {
      name: 'With user field',
      data: {
        user: 'nuki',
        password: 'nuki123',
        app_id: 8
      }
    },
    {
      name: 'With different app_id',
      data: {
        username: 'nuki',
        password: 'nuki123',
        app_id: 1
      }
    }
  ]
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing with: ${testCase.name}`)
      
      const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', testCase.data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      results.value.push({
        name: testCase.name,
        success: true,
        statusCode: response.status,
        endpoint: '/api/sso/v1/auth/login',
        response: response.data,
        tokens: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user
        }
      })
      
    } catch (error) {
      results.value.push({
        name: testCase.name,
        success: false,
        statusCode: error.response?.status || 'Network Error',
        endpoint: '/api/sso/v1/auth/login',
        response: error.response?.data || error.message,
        error: error.response?.data?.message || error.message
      })
    }
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
      endpoint: '/api/sso/v1/auth/me',
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
      endpoint: '/api/sso/v1/auth/me',
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testRefreshToken = async () => {
  try {
    console.log('Testing refresh token endpoint...')
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/refresh', {
      refreshToken: 'test-refresh-token'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    results.value.push({
      name: 'Refresh Token Test',
      success: true,
      statusCode: response.status,
      endpoint: '/api/sso/v1/auth/refresh',
      response: response.data,
      tokens: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Refresh Token Test',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      endpoint: '/api/sso/v1/auth/refresh',
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}
</script> 