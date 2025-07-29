<template>
  <div id="app">
    <LoadingApp v-if="isLoading" />
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import LoadingApp from './components/LoadingApp.vue'

const isLoading = ref(true)
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  // Check authentication immediately using authStore
  const isAuthenticated = await authStore.checkAuth()
  
  console.log('App mounted - isAuthenticated:', isAuthenticated)
  
  // If not authenticated and not on login or register page, redirect to login
  if (!isAuthenticated && window.location.pathname !== '/peta/login' && window.location.pathname !== '/peta/register') {
    console.log('Redirecting to login from App.vue')
    window.location.href = '/peta/login'
    return
  }
  
  // If authenticated and on login page, redirect to home
  if (isAuthenticated && window.location.pathname === '/peta/login') {
    console.log('Redirecting to home from App.vue')
    window.location.href = '/peta/home'
    return
  }
  
  // If authenticated and on root path, redirect to home
  if (isAuthenticated && window.location.pathname === '/peta/') {
    console.log('Redirecting to home from App.vue (root path)')
    window.location.href = '/peta/home'
    return
  }
  
  // Continue with normal flow
  setTimeout(() => {
    authStore.checkAuth()
    isLoading.value = false
  }, 500)
})
</script>
