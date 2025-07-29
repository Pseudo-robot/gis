<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Native Fetch Tester</h1>
    <p>Testing login with native fetch API</p>
    
    <div style="margin: 20px 0;">
      <div style="margin-bottom: 10px;">
        <label>Username:</label>
        <input v-model="credentials.username" style="margin-left: 10px; padding: 5px;" />
      </div>
      <div style="margin-bottom: 10px;">
        <label>Password:</label>
        <input v-model="credentials.password" type="password" style="margin-left: 10px; padding: 5px;" />
      </div>
      <button @click="testNativeFetch" style="margin: 5px; padding: 10px; background: blue; color: white;">
        Test Native Fetch
      </button>
      <button @click="testWithCredentials" style="margin: 5px; padding: 10px; background: green; color: white;">
        Test with Credentials
      </button>
      <button @click="testWithMode" style="margin: 5px; padding: 10px; background: orange; color: white;">
        Test with Mode
      </button>
    </div>
    
    <div v-if="results.length > 0" style="margin: 20px 0;">
      <h3>Test Results:</h3>
      <div v-for="(result, index) in results" :key="index" style="margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
        <h4>{{ result.name }}</h4>
        <div><strong>Success:</strong> {{ result.success ? 'Yes' : 'No' }}</div>
        <div><strong>Status Code:</strong> {{ result.statusCode }}</div>
        <div><strong>Response Headers:</strong></div>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">{{ JSON.stringify(result.headers, null, 2) }}</pre>
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
import { ref, reactive } from 'vue'

const credentials = reactive({
  username: 'wasil',
  password: 'wasil123'
})

const results = ref([])

const testNativeFetch = async () => {
  try {
    console.log('Testing with native fetch...')
    
    const response = await fetch('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        app_id: 8
      })
    })
    
    const data = await response.json()
    const headers = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    results.value.push({
      name: 'Native Fetch Test',
      success: response.ok,
      statusCode: response.status,
      headers: headers,
      response: data,
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Native Fetch Test',
      success: false,
      statusCode: 'Network Error',
      headers: {},
      response: error.message,
      error: error.message
    })
  }
}

const testWithCredentials = async () => {
  try {
    console.log('Testing with credentials include...')
    
    const response = await fetch('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        app_id: 8
      })
    })
    
    const data = await response.json()
    const headers = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    results.value.push({
      name: 'Fetch with Credentials Include',
      success: response.ok,
      statusCode: response.status,
      headers: headers,
      response: data,
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Fetch with Credentials Include',
      success: false,
      statusCode: 'Network Error',
      headers: {},
      response: error.message,
      error: error.message
    })
  }
}

const testWithMode = async () => {
  try {
    console.log('Testing with cors mode...')
    
    const response = await fetch('https://10.15.38.162:3100/api/sso/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        app_id: 8
      })
    })
    
    const data = await response.json()
    const headers = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    results.value.push({
      name: 'Fetch with CORS Mode',
      success: response.ok,
      statusCode: response.status,
      headers: headers,
      response: data,
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user
      }
    })
    
  } catch (error) {
    results.value.push({
      name: 'Fetch with CORS Mode',
      success: false,
      statusCode: 'Network Error',
      headers: {},
      response: error.message,
      error: error.message
    })
  }
}
</script> 