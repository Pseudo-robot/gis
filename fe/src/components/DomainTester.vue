<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Domain Tester</h1>
    <p>Testing with different domains and CORS settings</p>
    
    <div style="margin: 20px 0;">
      <button @click="testWithLocalhost" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test with Localhost
      </button>
      <button @click="testWithIP" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test with IP
      </button>
      <button @click="testWithDifferentPort" style="margin: 5px; padding: 10px; background: orange; color: white;">
        Test with Different Port
      </button>
      <button @click="testWithProxy" style="margin: 5px; padding: 10px; background: red; color: white;">
        Test with Proxy
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
        <div><strong>URL:</strong> {{ result.url }}</div>
        <div><strong>Set-Cookie Headers:</strong> {{ result.setCookies ? result.setCookies.length : 0 }} found</div>
        <div><strong>Response Body:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">{{ JSON.stringify(result.response, null, 2) }}</pre>
        <div v-if="result.error"><strong>Error:</strong> {{ result.error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const results = ref([])

const testWithLocalhost = async () => {
  try {
    console.log('Testing with localhost...')
    
    const response = await axios.post('http://localhost:3100/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const setCookies = response.headers['set-cookie'] || []
    console.log('Set-Cookie headers with localhost:', setCookies)
    
    results.value.push({
      name: 'Test with Localhost',
      success: true,
      statusCode: response.status,
      url: 'http://localhost:3100/api/sso/v1/auth/login',
      headers: response.headers,
      setCookies: setCookies,
      response: response.data
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with Localhost',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      url: 'http://localhost:3100/api/sso/v1/auth/login',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testWithIP = async () => {
  try {
    console.log('Testing with IP...')
    
    const response = await axios.post('http://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const setCookies = response.headers['set-cookie'] || []
    console.log('Set-Cookie headers with IP:', setCookies)
    
    results.value.push({
      name: 'Test with IP',
      success: true,
      statusCode: response.status,
      url: 'http://10.15.38.162:3100/api/sso/v1/auth/login',
      headers: response.headers,
      setCookies: setCookies,
      response: response.data
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with IP',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      url: 'http://10.15.38.162:3100/api/sso/v1/auth/login',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testWithDifferentPort = async () => {
  try {
    console.log('Testing with different port...')
    
    const response = await axios.post('https://10.15.38.162:3000/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const setCookies = response.headers['set-cookie'] || []
    console.log('Set-Cookie headers with different port:', setCookies)
    
    results.value.push({
      name: 'Test with Different Port',
      success: true,
      statusCode: response.status,
      url: 'https://10.15.38.162:3000/api/sso/v1/auth/login',
      headers: response.headers,
      setCookies: setCookies,
      response: response.data
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with Different Port',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      url: 'https://10.15.38.162:3000/api/sso/v1/auth/login',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}

const testWithProxy = async () => {
  try {
    console.log('Testing with proxy...')
    
    const response = await axios.post('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      username: 'nuki',
      password: 'nuki123',
      app_id: 8
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
        'Referer': 'http://localhost:3000'
      }
    })
    
    const setCookies = response.headers['set-cookie'] || []
    console.log('Set-Cookie headers with proxy:', setCookies)
    
    results.value.push({
      name: 'Test with Proxy',
      success: true,
      statusCode: response.status,
      url: 'https://10.15.38.162:3100/api/sso/v1/auth/login',
      headers: response.headers,
      setCookies: setCookies,
      response: response.data
    })
    
  } catch (error) {
    results.value.push({
      name: 'Test with Proxy',
      success: false,
      statusCode: error.response?.status || 'Network Error',
      url: 'https://10.15.38.162:3100/api/sso/v1/auth/login',
      headers: error.response?.headers || {},
      setCookies: [],
      response: error.response?.data || error.message,
      error: error.response?.data?.message || error.message
    })
  }
}
</script> 