<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
    <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px;">
          Sign in to your account
        </h2>
        <p style="color: #666;">Enter your credentials to access the application</p>
      </div>
      
      <form @submit.prevent="handleLogin" style="space-y: 20px;">
        <div style="margin-bottom: 20px;">
          <label for="username" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Username</label>
          <input
            id="username"
            v-model="credentials.username"
            name="username"
            type="text"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            placeholder="Enter your username"
          />
        </div>
        
        <div style="margin-bottom: 20px;">
          <label for="password" style="display: block; margin-bottom: 5px; color: #333; font-weight: 500;">Password</label>
          <input
            id="password"
            v-model="credentials.password"
            name="password"
            type="password"
            required
            style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            placeholder="Enter your password"
          />
        </div>

        <div v-if="error" style="margin-bottom: 20px; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c33;">
          {{ error }}
        </div>
        
        <div v-if="loginInfo" style="margin-bottom: 20px; padding: 10px; background: #efe; border: 1px solid #cfc; border-radius: 4px; color: #363;">
          <strong>Login Info:</strong><br>
          Authentication: {{ loginInfo.success ? 'Successful' : 'Failed' }}<br>
          Username: {{ loginInfo.user ? loginInfo.user.username : 'Not set' }}<br>
          Role ID: {{ loginInfo.user ? loginInfo.user.role_id : 'Unknown' }}<br>
          Role Type: {{ loginInfo.user ? (loginInfo.user.role_id === 4 ? 'External' : 'Internal') : 'Unknown' }}<br>
          <small>HttpOnly cookies are handled automatically by browser</small>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer;"
          :style="{ opacity: isLoading ? '0.6' : '1', cursor: isLoading ? 'not-allowed' : 'pointer' }"
        >
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
      
      <div style="margin-top: 20px; text-align: center;">
        <a href="/peta/test" style="color: #007bff; text-decoration: none; margin-right: 20px;">Test Login Page</a>
        <a href="/peta/register" style="color: #007bff; text-decoration: none;">Create Account</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const credentials = reactive({
  username: '',
  password: ''
})

const { isLoading, error, login } = authStore
const loginInfo = ref(null)

const handleLogin = async () => {
  const result = await login(credentials)
  if (result.success) {
    // Get login info for display
    loginInfo.value = {
      success: result.success,
      user: result.user
    }
    
    console.log('Login successful, HttpOnly cookies set by server')
    console.log('Login result user data:', result.user)
    console.log('Redirecting to home in 1 second...')
    
    // Show success message briefly before redirect
    setTimeout(() => {
      console.log('Redirecting to home now...')
      router.push('/home')
    }, 1000)
  }
}
</script> 