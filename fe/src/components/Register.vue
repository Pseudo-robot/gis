<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
    <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px;">
          Create Account
        </h2>
        <p style="color: #666;">Register a new account</p>
      </div>
      
      <form @submit.prevent="handleRegister" style="space-y: 20px;">
        <div style="margin-bottom: 20px;">
          <label for="username" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Username</label>
          <input
            id="username"
            v-model="formData.username"
            name="username"
            type="text"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            placeholder="Enter your username"
          />
        </div>
        
        <div style="margin-bottom: 20px;">
          <label for="email" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Email</label>
          <input
            id="email"
            v-model="formData.email"
            name="email"
            type="email"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            placeholder="Enter your email"
          />
        </div>
        
        <div style="margin-bottom: 20px;">
          <label for="password" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Password</label>
          <input
            id="password"
            v-model="formData.password"
            name="password"
            type="password"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            placeholder="Enter your password"
          />
        </div>
        
        <div style="margin-bottom: 20px;">
          <label for="alamat" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Alamat</label>
          <textarea
            id="alamat"
            v-model="formData.alamat"
            name="alamat"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; min-height: 80px; resize: vertical;"
            placeholder="Enter your address"
          ></textarea>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label for="no_hp" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">No. HP</label>
          <input
            id="no_hp"
            v-model="formData.no_hp"
            name="no_hp"
            type="tel"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            placeholder="Enter your phone number"
          />
        </div>

        <div v-if="error" style="margin-bottom: 20px; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c33;">
          {{ error }}
          <div style="margin-top: 10px; font-size: 12px; color: #666;">
            <strong>Debug Info:</strong><br>
            Trying endpoints: /api/sso/v1/user, /api/sso/v1/users, /api/sso/v1/auth/register<br>
            Role ID: 4 (for external users)<br>
            Using stored tokens from login (if available)<br>
            Check browser console for detailed error messages.
          </div>
        </div>

        <div v-if="success" style="margin-bottom: 20px; padding: 15px; background: #efe; border: 1px solid #cfc; border-radius: 4px; color: #3c3;">
          <p style="margin: 0 0 10px 0;">{{ success }}</p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button 
              @click="goToLogin" 
              style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;"
            >
              Go to Login
            </button>
            <button 
              @click="registerAnother" 
              style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;"
            >
              Register Another User
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer;"
          :style="{ opacity: isLoading ? '0.6' : '1', cursor: isLoading ? 'not-allowed' : 'pointer' }"
        >
          {{ isLoading ? 'Creating account...' : 'Register' }}
        </button>
      </form>
      
      <div style="margin-top: 20px; text-align: center;">
        <a href="/peta/login" style="color: #007bff; text-decoration: none; margin-right: 20px;">Already have an account? Sign in</a>
        <a href="/peta/endpoint-tester" style="color: #007bff; text-decoration: none;">Test Endpoints</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const formData = reactive({
  username: '',
  email: '',
  password: '',
  role_id: 4,
  alamat: '',
  no_hp: ''
})

const handleRegister = async () => {
  // Basic validation
  if (!formData.username || !formData.email || !formData.password || !formData.alamat || !formData.no_hp) {
    error.value = 'Please fill in all required fields'
    return
  }
  
  // Phone number validation
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  if (!phoneRegex.test(formData.no_hp)) {
    error.value = 'Please enter a valid Indonesian phone number'
    return
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    error.value = 'Please enter a valid email address'
    return
  }
  
  isLoading.value = true
  error.value = ''
  success.value = ''
  
  // Try different endpoints and data formats
  const attempts = [
    {
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/user',
      data: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id
      }
    },
    {
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/users',
      data: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id
      }
    },
    {
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/auth/register',
      data: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id
      }
    },
    {
      endpoint: 'https://10.15.38.162:3100/api/sso/v1/user',
      data: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id,
        alamat: formData.alamat,
        no_hp: formData.no_hp
      }
    }
  ]
  
  for (let i = 0; i < attempts.length; i++) {
    try {
      const attempt = attempts[i]
      console.log(`Attempt ${i + 1}: ${attempt.endpoint}`)
      console.log('Request data:', attempt.data)
      
      // Get stored tokens from cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(';').shift()
        return null
      }
      
      const accessToken = getCookie('accessToken')
      const refreshToken = getCookie('refreshToken')
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
      
      // Add auth headers if tokens exist
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`
      }
      if (refreshToken) {
        headers.Cookie = `refreshToken=${refreshToken}`
      }
      
      const response = await axios.post(attempt.endpoint, attempt.data, {
        headers,
        timeout: 10000
      })
      
      console.log('Registration response:', response.data)
      success.value = 'Account created successfully! You can now login with your credentials.'
      
      // Clear form
      formData.username = ''
      formData.email = ''
      formData.password = ''
      formData.alamat = ''
      formData.no_hp = ''
      
      break // Exit loop if successful
      
    } catch (err) {
      console.error(`Attempt ${i + 1} failed:`, err.response?.status, err.response?.data)
      
      if (i === attempts.length - 1) {
        // Last attempt failed
        error.value = `Registration failed. All attempts failed. Last error: ${err.response?.status} - ${err.response?.data?.message || 'Unknown error'}`
      }
    }
  }
  
  isLoading.value = false
}

const goToLogin = () => {
  router.push('/login')
}

const registerAnother = () => {
  success.value = ''
  error.value = ''
}
</script> 