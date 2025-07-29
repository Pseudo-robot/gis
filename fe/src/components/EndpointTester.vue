<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Endpoint Tester</h1>
    <p>Testing different registration endpoints to find the correct one</p>
    
    <div style="margin: 20px 0;">
      <button @click="testEndpoints" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test All Endpoints
      </button>
      <button @click="clearResults" style="margin: 5px; padding: 10px; background: gray; color: white;">
        Clear Results
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" 
           :style="{ 
             padding: '10px', 
             margin: '5px 0', 
             borderRadius: '4px',
             backgroundColor: result.success ? '#d4edda' : '#f8d7da',
             border: result.success ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
             color: result.success ? '#155724' : '#721c24'
           }">
        <strong>{{ result.endpoint }}</strong><br>
        Status: {{ result.status }}<br>
        Success: {{ result.success ? 'Yes' : 'No' }}<br>
        <span v-if="result.error">Error: {{ result.error }}</span>
      </div>
    </div>
    
    <div v-if="workingEndpoint" style="margin: 20px 0; padding: 15px; background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px;">
      <h4>✅ Working Endpoint Found!</h4>
      <p><strong>{{ workingEndpoint }}</strong></p>
      <p>Use this endpoint in your registration form.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const results = ref([])
const workingEndpoint = ref('')

const endpoints = [
  'https://10.15.38.162:3100/api/sso/v1/user',
  'https://10.15.38.162:3100/api/sso/v1/users',
  'https://10.15.38.162:3100/api/sso/v1/auth/register'
]

const testData = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'test123',
  role_id: 4,
  alamat: 'Test Address',
  no_hp: '081234567890'
}

const testEndpoints = async () => {
  results.value = []
  workingEndpoint.value = ''
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`)
      const response = await axios.post(endpoint, testData)
      
      results.value.push({
        endpoint,
        status: response.status,
        success: true,
        data: response.data
      })
      
      if (!workingEndpoint.value) {
        workingEndpoint.value = endpoint
      }
      
    } catch (error) {
      results.value.push({
        endpoint,
        status: error.response?.status || 'No response',
        success: false,
        error: error.response?.data?.message || error.message
      })
    }
  }
}

const clearResults = () => {
  results.value = []
  workingEndpoint.value = ''
}
</script> 