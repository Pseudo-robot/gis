<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Detailed Endpoint Tester</h1>
    <p>Testing registration endpoints with different data formats</p>
    
    <div style="margin: 20px 0;">
      <button @click="testAllEndpoints" style="margin: 5px; padding: 10px; background: blue; color: white;">
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
             padding: '15px', 
             margin: '10px 0', 
             borderRadius: '4px',
             backgroundColor: result.success ? '#d4edda' : '#f8d7da',
             border: result.success ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
             color: result.success ? '#155724' : '#721c24'
           }">
        <strong>{{ result.endpoint }}</strong><br>
        <strong>Data Format:</strong> {{ result.dataFormat }}<br>
        <strong>Status:</strong> {{ result.status }}<br>
        <strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}<br>
        <span v-if="result.error"><strong>Error:</strong> {{ result.error }}</span>
        <span v-if="result.response"><strong>Response:</strong> {{ JSON.stringify(result.response) }}</span>
      </div>
    </div>
    
    <div v-if="workingEndpoint" style="margin: 20px 0; padding: 15px; background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px;">
      <h4>✅ Working Endpoint Found!</h4>
      <p><strong>Endpoint:</strong> {{ workingEndpoint.endpoint }}</p>
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
  role_id: 4,
  alamat: 'Test Address',
  no_hp: '081234567890'
}

const testAllEndpoints = async () => {
  results.value = []
  workingEndpoint.value = ''
  
  const testCases = [
    {
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/user',
      data: { 
        username: testData.username,
        email: testData.email,
        password: testData.password,
        role_id: testData.role_id
      },
      dataFormat: 'minimal data (no alamat, no_hp)'
    },
    {
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/user',
      data: { ...testData },
      dataFormat: 'full data (with alamat, no_hp)'
    }
  ]
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.endpoint} with ${testCase.dataFormat}`)
      console.log('Request data:', testCase.data)
      
      const response = await axios.post(testCase.endpoint, testCase.data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YXNpbCIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUzNzY0NzU0LCJleHAiOjE3NTQzNjk1NTR9.gQ5PnOsMR4Jh9mF5W-3TUvr0_qiYW6WTNeiym05c-GI'
        },
        timeout: 10000
      })
      
      results.value.push({
        endpoint: testCase.endpoint,
        dataFormat: testCase.dataFormat,
        status: response.status,
        success: true,
        response: response.data
      })
      
      if (!workingEndpoint.value) {
        workingEndpoint.value = {
          endpoint: testCase.endpoint,
          dataFormat: testCase.dataFormat
        }
      }
      
    } catch (error) {
      results.value.push({
        endpoint: testCase.endpoint,
        dataFormat: testCase.dataFormat,
        status: error.response?.status || 'No response',
        success: false,
        error: error.response?.data?.message || error.message,
        response: error.response?.data
      })
    }
  }
}

const clearResults = () => {
  results.value = []
  workingEndpoint.value = ''
}
</script> 