<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Cookie Debugger</h1>
    <p>Debugging cookie issues and testing different approaches</p>
    
    <div style="margin: 20px 0;">
      <button @click="testWithCredentials" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test with Credentials
      </button>
      <button @click="testWithCurlData" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test with Curl Data
      </button>
      <button @click="testWithFetch" style="margin: 5px; padding: 10px; background: orange; color: white;">
        Test with Fetch
      </button>
      <button @click="testWithCredentialsInclude" style="margin: 5px; padding: 10px; background: red; color: white;">
        Test with Credentials Include
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
        <div><strong>Set-Cookie Headers:</strong> {{ result.setCookies ? result.setCookies.length : 0 }} found</div>
        <div><strong>All Headers:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">{{ JSON.stringify(result.headers, null, 2) }}</pre>
        <div><strong>Response Body:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">{{ JSON.stringify(result.response, null, 2) }}</pre>
        <div v-if="result.error"><strong>Error:</strong> {{ result.error }}</div>
        <div v-if="result.cookies"><strong>Cookies Found:</strong></div>
        <ul v-if="result.cookies">
          <li v-for="cookie in result.cookies" :key="cookie">{{ cookie }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const results = ref([])

const testWithCredentials = async () => {
  try {
    console.log('Testing with credentials...')
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const setCookies = response.headers['set-cookie'] || []
    console.log('Set-Cookie headers:', setCookies)
    
    results.value.push({
      name: 'Test with Credentials',
      success: true,
      statusCode: response.status,
      headers: response.headers,
      setCookies: setCookies,
      response: response.data,
      cookies: setCookies
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with Credentials',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testWithCurlData = async () => {
  try {
    console.log('Testing with curl data...')
    
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
    
    const setCookies = response.headers['set-cookie'] || []
    console.log('Set-Cookie headers with curl data:', setCookies)
    
    results.value.push({
      name: 'Test with Curl Data',
      success: true,
      statusCode: response.status,
      headers: response.headers,
      setCookies: setCookies,
      response: response.data,
      cookies: setCookies
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with Curl Data',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testWithFetch = async () => {
  try {
    console.log('Testing with fetch...')
    
    const response = await fetch('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'nuki',
        password: 'nuki123',
        app_id: 8
      })
    })
    
    const data = await response.json()
    const headers = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    const setCookies = headers['set-cookie'] || []
    console.log('Set-Cookie headers with fetch:', setCookies)
    
    results.value.push({
      name: 'Test with Fetch',
      success: response.ok,
      statusCode: response.status,
      headers: headers,
      setCookies: setCookies,
      response: data,
      cookies: setCookies
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with Fetch',
      success: false,
      statusCode: 'Network Error',
      headers: {},
      setCookies: [],
      response: error.message,
      error: error.message
    })
  }
}

const testWithCredentialsInclude = async () => {
  try {
    console.log('Testing with credentials include...')
    
    const response = await fetch('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: 'nuki',
        password: 'nuki123',
        app_id: 8
      })
    })
    
    const data = await response.json()
    const headers = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    const setCookies = headers['set-cookie'] || []
    console.log('Set-Cookie headers with credentials include:', setCookies)
    
    results.value.push({
      name: 'Test with Credentials Include',
      success: response.ok,
      statusCode: response.status,
      headers: headers,
      setCookies: setCookies,
      response: data,
      cookies: setCookies
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with Credentials Include',
      success: false,
      statusCode: 'Network Error',
      headers: {},
      setCookies: [],
      response: error.message,
      error: error.message
    })
  }
}
</script> 