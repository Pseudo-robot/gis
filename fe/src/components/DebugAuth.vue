<template>
  <div style="position: fixed; bottom: 10px; left: 10px; z-index: 1000; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid #ddd; max-width: 400px; font-size: 12px;">
    <h4 style="margin: 0 0 10px 0; color: #333;">Debug Auth State</h4>
    
    <div style="margin-bottom: 10px;">
      <strong>AuthStore State:</strong><br>
      User: {{ userDataString }}<br>
      isAuthenticated: {{ authStore.isAuthenticated }}<br>
      isExternal: {{ authStore.isExternal }}<br>
      isInternal: {{ authStore.isInternal }}
    </div>
    
    <div style="margin-bottom: 10px;">
      <strong>SessionStorage:</strong><br>
      Raw: {{ sessionStorageData }}<br>
      Parsed: {{ parsedSessionData }}<br>
      <strong>LocalStorage:</strong><br>
      Raw: {{ localStorageData }}<br>
      Parsed: {{ parsedLocalData }}
    </div>
    
    <div style="margin-bottom: 10px;">
      <strong>Computed Values:</strong><br>
      User: {{ computedUserString }}<br>
      isExternal: {{ isExternal }}<br>
      isInternal: {{ isInternal }}
    </div>
    
    <div style="display: flex; gap: 5px; margin-top: 10px;">
      <button @click="refreshDebug" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">
        Refresh Debug
      </button>
      <button @click="forceRefreshAuth" style="padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">
        Force Refresh Auth
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const sessionStorageData = ref('')
const parsedSessionData = ref('')
const localStorageData = ref('')
const parsedLocalData = ref('')

// Safe JSON stringify functions
const userDataString = computed(() => {
  try {
    const user = authStore.user
    if (!user) return 'null'
    return `{username: "${user.username}", role_id: ${user.role_id}, id: ${user.id}}`
  } catch (e) {
    return 'Error: ' + e.message
  }
})

const computedUserString = computed(() => {
  try {
    const userValue = user.value
    if (!userValue) return 'null'
    return `{username: "${userValue.username}", role_id: ${userValue.role_id}, id: ${userValue.id}}`
  } catch (e) {
    return 'Error: ' + e.message
  }
})

const user = computed(() => authStore.user)
const isExternal = computed(() => authStore.isExternal)
const isInternal = computed(() => authStore.isInternal)

const refreshDebug = () => {
  // Check sessionStorage
  const sessionRawData = sessionStorage.getItem('user')
  sessionStorageData.value = sessionRawData || 'null'
  
  if (sessionRawData) {
    try {
      parsedSessionData.value = JSON.stringify(JSON.parse(sessionRawData))
    } catch (e) {
      parsedSessionData.value = 'Error parsing: ' + e.message
    }
  } else {
    parsedSessionData.value = 'null'
  }
  
  // Check localStorage
  const localRawData = localStorage.getItem('user')
  localStorageData.value = localRawData || 'null'
  
  if (localRawData) {
    try {
      parsedLocalData.value = JSON.stringify(JSON.parse(localRawData))
    } catch (e) {
      parsedLocalData.value = 'Error parsing: ' + e.message
    }
  } else {
    parsedLocalData.value = 'null'
  }
}

const forceRefreshAuth = () => {
  authStore.forceRefreshAuth()
  refreshDebug()
}

onMounted(() => {
  refreshDebug()
})
</script> 