<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Curl Command Tester</h1>
    <p>Testing with exact curl command structure</p>
    
    <div style="margin: 20px 0;">
      <button @click="testExactCurl" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test Exact Curl
      </button>
      <button @click="testWithDifferentTokens" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test with Different Tokens
      </button>
      <button @click="testWithoutCookies" style="margin: 5px; padding: 10px; background: orange; color: white;">
        Test without Cookies
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
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

const testExactCurl = async () => {
  try {
    console.log('Testing with exact curl command...')
    
    // Exact curl command from user
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'wasil',
      password: 'wasil123',
      app_id: 1
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
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testWithDifferentTokens = async () => {
  const testCases = [
    {
      name: 'With app_id: 8',
      data: {
        username: 'wasil',
        password: 'wasil123',
        app_id: 8
      }
    },
    {
      name: 'With nuki credentials',
      data: {
        username: 'nuki',
        password: 'nuki123',
        app_id: 1
      }
    },
    {
      name: 'With nuki credentials and app_id: 8',
      data: {
        username: 'nuki',
        password: 'nuki123',
        app_id: 8
      }
    }
  ]
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.name}`)
      
      const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', testCase.data, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YXNpbCIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUzNzY0NTI1LCJleHAiOjE3NTM3NjU0MjV9._gOtFJoM-ysvOV4ypztQTg0Mkbh615lIOHE4nQpNuBw; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ3YXNpbCIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzUzNzY0NTI1LCJleHAiOjE3NTQzNjkzMjV9.ByTMxw0Tiqbxp67X7187t3edaYftyanrRuUy8ifqfL0'
        }
      })
      
      results.value.push({
        name: testCase.name,
        success: true,
        statusCode: response.status,
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
        response: error.response?.data || error.message,
        error: error.response?.data?.message || error.message
      })
    }
  }
}

const testWithoutCookies = async () => {
  const testCases = [
    {
      name: 'Without cookies - wasil',
      data: {
        username: 'wasil',
        password: 'wasil123',
        app_id: 1
      }
    },
    {
      name: 'Without cookies - nuki',
      data: {
        username: 'nuki',
        password: 'nuki123',
        app_id: 8
      }
    }
  ]
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.name}`)
      
      const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', testCase.data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      results.value.push({
        name: testCase.name,
        success: true,
        statusCode: response.status,
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
        response: error.response?.data || error.message,
        error: error.response?.data?.message || error.message
      })
    }
  }
}
</script> 