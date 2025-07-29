import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'

export const useAuth = () => {
  const authStore = useAuthStore()
  
  // Computed properties for easy access
  const isExternal = computed(() => authStore.isExternal.value)
  const isInternal = computed(() => authStore.isInternal.value)
  const isAuthenticated = computed(() => authStore.isAuthenticated.value)
  const user = computed(() => authStore.user.value)
  
  return {
    // Store methods
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth,
    
    // Reactive state
    isAuthenticated,
    isExternal,
    isInternal,
    user,
    isLoading: authStore.isLoading,
    error: authStore.error
  }
} 