<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Login Endpoint Tester</h1>
    <p>Testing different login endpoints to find the correct one</p>
    
    <div style="margin: 20px 0;">
      <div style="margin-bottom: 10px;">
        <label>Username:</label>
        <input v-model="credentials.username" style="margin-left: 10px; padding: 5px;" />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Password:</label>
        <input v-model="credentials.password" type="password" style="margin-left: 10px; padding: 5px;" />
      </div>
      <button @click="testAllEndpoints" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test All Endpoints
      </button>
      <button @click="testWithHeaders" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test with Headers
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.endpoint }}</h4>
        <div><strong>Status:</strong> {{ result.success ? 'Success' : 'Failed' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
        <div><strong>Response:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">{{ JSON.stringify(result.response, null, 2) }}</pre>
        <div v-if="result.error"><strong>Error:</strong> {{ result.error }}</div>
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

const endpoints = [
  '/auth/login',
  '/login', 
  '/sso/login',
  '/auth/sso/login',
  '/api/auth/login',
  '/api/login',
  '/api/sso/login'
]

const testAllEndpoints = async () => {
  results.value = []
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`)
      
      const response = await axios.post(`https://10.15.38.162:3100/api/sso/v1${endpoint}`, {
        username: credentials.username,
        password: credentials.password,
        app_id: 8
      })
      
      results.value.push({
        endpoint,
        success: true,
        statusCode: response.status,
        response: response.data
      })
      
      console.log(`Success for ${endpoint}:`, response.data)
      
    } catch (error) {
      results.value.push({
        endpoint,
        success: false,
        statusCode: error.response?.status || 'Network Error',
        error: error.response?.data?.message || error.message,
        response: error.response?.data || null
      })
      
      console.log(`Failed for ${endpoint}:`, error.response?.data || error.message)
    }
  }
}

const testWithHeaders = async () => {
  results.value = []
  
  // Test with different headers
  const testCases = [
    {
      name: 'With Content-Type and Accept',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    },
    {
      name: 'With Authorization Bearer',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    },
    {
      name: 'With Cookie',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'accessToken=test; refreshToken=test'
      }
    }
  ]
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing with headers: ${testCase.name}`)
      
      const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
        username: credentials.username,
        password: credentials.password,
        app_id: 8
      }, {
        headers: testCase.headers
      })
      
      results.value.push({
        endpoint: `auth/login (${testCase.name})`,
        success: true,
        statusCode: response.status,
        response: response.data
      })
      
    } catch (error) {
      results.value.push({
        endpoint: `auth/login (${testCase.name})`,
        success: false,
        statusCode: error.response?.status || 'Network Error',
        error: error.response?.data?.message || error.message,
        response: error.response?.data || null
      })
    }
  }
}
</script> 