<template>
  <div style="padding: 20px; background: white; min-height: 100vh;">
    <h1>Login Test</h1>
    <div style="margin: 20px 0;">
      <input v-model="username" placeholder="Username" style="margin: 5px; padding: 10px;" />
      <input v-model="password" type="password" placeholder="Password" style="margin: 5px; padding: 10px;" />
      <button @click="testLogin" style="margin: 5px; padding: 10px; background: blue; color: white;">Login</button>
    </div>
    <div v-if="message" style="margin: 10px; padding: 10px; background: #f0f0f0;">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const password = ref('')
const message = ref('')
const authStore = useAuthStore()

const testLogin = async () => {
  try {
    const result = await authStore.login({
      username: username.value,
      password: password.value
    })
    
    if (result.success) {
      message.value = 'Login successful!'
    } else {
      message.value = `Login failed: ${result.error}`
    }
  } catch (error) {
    message.value = `Error: ${error.message}`
  }
}
</script> 