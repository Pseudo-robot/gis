<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Response Structure Tester</h1>
    <p>Testing different response structure possibilities</p>
    
    <div style="margin: 20px 0;">
      <button @click="testResponseStructures" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test Response Structures
      </button>
      <button @click="testWithCurlData" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test with Curl Data
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Tokens Found:</strong></div>
        <ul>
          <li>accessToken: {{ result.accessToken ? 'Found' : 'Not found' }}</li>
          <li>refreshToken: {{ result.refreshToken ? 'Found' : 'Not found' }}</li>
          <li>user: {{ result.user ? 'Found' : 'Not found' }}</li>
        </ul>
        <div><strong>Response:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">{{ JSON.stringify(result.response, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const results = ref([])

const testResponseStructures = async () => {
  results.value = []
  
  // Test different possible response structures
  const testStructures = [
    {
      name: 'Direct tokens in response',
      response: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: { id: 1, username: 'test' }
      }
    },
    {
      name: 'Tokens in data property',
      response: {
        data: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: { id: 1, username: 'test' }
        }
      }
    },
    {
      name: 'Tokens in result property',
      response: {
        result: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: { id: 1, username: 'test' }
        }
      }
    },
    {
      name: 'Tokens in payload property',
      response: {
        payload: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: { id: 1, username: 'test' }
        }
      }
    },
    {
      name: 'Different token names',
      response: {
        token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        user: { id: 1, username: 'test' }
      }
    },
    {
      name: 'JWT token name',
      response: {
        jwt: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: { id: 1, username: 'test' }
      }
    },
    {
      name: 'Current API response (just message)',
      response: {
        message: 'Login successful'
      }
    }
  ]
  
  for (const test of testStructures) {
    const { accessToken, refreshToken, user } = test.response
    const dataAccessToken = test.response.data?.accessToken
    const dataRefreshToken = test.response.data?.refreshToken
    const dataUser = test.response.data?.user
    const resultAccessToken = test.response.result?.accessToken
    const resultRefreshToken = test.response.result?.refreshToken
    const resultUser = test.response.result?.user
    const payloadAccessToken = test.response.payload?.accessToken
    const payloadRefreshToken = test.response.payload?.refreshToken
    const payloadUser = test.response.payload?.user
    const token = test.response.token
    const refresh_token = test.response.refresh_token
    const jwt = test.response.jwt
    
    results.value.push({
      name: test.name,
      success: !!(accessToken || dataAccessToken || resultAccessToken || payloadAccessToken || token || jwt),
      response: test.response,
      accessToken: accessToken || dataAccessToken || resultAccessToken || payloadAccessToken || token || jwt,
      refreshToken: refreshToken || dataRefreshToken || resultRefreshToken || payloadRefreshToken || refresh_token,
      user: user || dataUser || resultUser || payloadUser
    })
  }
}

const testWithCurlData = async () => {
  results.value = []
  
  try {
    // Test with the exact curl command structure
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'wasil',
      password: 'wasil123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YXNpbCIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUzNzY0NTI1LCJleHAiOjE3NTM3NjU0MjV9._gOtFJoM-ysvOV4ypztQTg0Mkbh615lIOHE4nQpNuBw; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YXNpbCIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUzNzY0NTI1LCJleHAiOjE3NTQzNjkzMjV9.ByTMxw0Tiqbxp67X7187t3edaYftyanrRuUy8ifqfL0'
      }
    })
    
    results.value.push({
      name: 'Curl Command Test',
      success: true,
      response: response.data,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: response.data.user
    })
    
  } catch (error) {
    results.value.push({
      name: 'Curl Command Test',
      success: false,
      response: error.response?.data || error.message,
      accessToken: null,
      refreshToken: null,
      user: null
    })
  }
}
</script> 