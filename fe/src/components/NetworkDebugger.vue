<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Network Debugger</h1>
    <p>Testing registration endpoints and analyzing network responses</p>
    
    <div style="margin: 20px 0;">
      <button @click="testEndpoints" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test All Endpoints
      </button>
      <button @click="testWithAuth" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test With Auth Cookie
      </button>
      <button @click="clearResults" style="margin: 5px; padding: 10px; background: gray; color: white;">
        Clear Results
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" 
           :style="{ 
             padding: '15px', 
             margin: '10px 0', 
             borderRadius: '4px',
             backgroundColor: result.success ? '#d4edda' : '#f8d7da',
             border: result.success ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
             color: result.success ? '#155724' : '#721c24'
           }">
        <strong>Endpoint:</strong> {{ result.endpoint }}<br>
        <strong>Method:</strong> {{ result.method }}<br>
        <strong>Status:</strong> {{ result.status }}<br>
        <strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}<br>
        <strong>Data Sent:</strong> {{ JSON.stringify(result.data) }}<br>
        <span v-if="result.error"><strong>Error:</strong> {{ result.error }}</span>
        <span v-if="result.response"><strong>Response:</strong> {{ JSON.stringify(result.response) }}</span>
        <span v-if="result.headers"><strong>Headers:</strong> {{ JSON.stringify(result.headers) }}</span>
      </div>
    </div>
    
    <div v-if="workingEndpoint" style="margin: 20px 0; padding: 15px; background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px;">
      <h4>✅ Working Endpoint Found!</h4>
      <p><strong>Endpoint:</strong> {{ workingEndpoint.endpoint }}</p>
      <p><strong>Method:</strong> {{ workingEndpoint.method }}</p>
      <p><strong>Data Format:</strong> {{ workingEndpoint.dataFormat }}</p>
      <p>Use this configuration in your registration form.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const results = ref([])
const workingEndpoint = ref('')

const testData = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'test123',
  role_id: 4
}

const testEndpoints = async () => {
  results.value = []
  workingEndpoint.value = ''
  
  const endpoints = [
    'https://10.15.38.162:3100/api/sso/v1/user',
    'https://10.15.38.162:3100/api/sso/v1/users',
    'https://10.15.38.162:3100/api/sso/v1/auth/register',
    'https://10.15.38.162:3100/api/sso/v1/register',
    'https://10.15.38.162:3100/api/sso/v1/auth/signup'
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`)
      
      const response = await axios.post(endpoint, testData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      })
      
      results.value.push({
        endpoint,
        method: 'POST',
        status: response.status,
        success: true,
        data: testData,
        response: response.data,
        headers: response.headers
      })
      
      if (!workingEndpoint.value) {
        workingEndpoint.value = {
          endpoint,
          method: 'POST',
          dataFormat: 'minimal'
        }
      }
      
    } catch (error) {
      results.value.push({
        endpoint,
        method: 'POST',
        status: error.response?.status || 'No response',
        success: false,
        data: testData,
        error: error.response?.data?.message || error.message,
        response: error.response?.data,
        headers: error.response?.headers
      })
    }
  }
}

const testWithAuth = async () => {
  results.value = []
  workingEndpoint.value = ''
  
  const testDataWithAuth = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'test123',
    role_id: 4
  }
  
  try {
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/user', testDataWithAuth, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YXNpbCIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUzNzY0NzU0LCJleHAiOjE3NTQzNjk1NTR9.gQ5PnOsMR4Jh9mF5W-3TUvr0_qiYW6WTNeiym05c-GI'
      },
      timeout: 10000
    })
    
    results.value.push({
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/user',
      method: 'POST',
      status: response.status,
      success: true,
      data: testDataWithAuth,
      response: response.data,
      headers: response.headers
    })
    
    workingEndpoint.value = {
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/user',
      method: 'POST',
      dataFormat: 'with auth cookie'
    }
    
  } catch (error) {
    results.value.push({
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/user',
      method: 'POST',
      status: error.response?.status || 'No response',
      success: false,
      data: testDataWithAuth,
      error: error.response?.data?.message || error.message,
      response: error.response?.data,
      headers: error.response?.headers
    })
  }
}

const clearResults = () => {
  results.value = []
  workingEndpoint.value = ''
}
</script> 