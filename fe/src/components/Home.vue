<template>
  <div style="background: white; min-height: 100vh;">
    <PageHeader />
    <div style="padding: 40px; max-width: 1200px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 32px; font-weight: bold; color: #333; margin-bottom: 10px;">
          Welcome to GIS Application
        </h1>
        <p style="color: #666; font-size: 18px;">
          You have successfully logged in to the system
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #333; margin-bottom: 20px;">
          User Information
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            <h3 style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 15px;">Account Details</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500; color: #666;">Username:</span>
                <span style="font-weight: 600; color: #333;">{{ authStore.user?.username || 'Not set' }}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500; color: #666;">Role ID:</span>
                <span style="font-weight: 600; color: #333;">{{ authStore.user?.role_id || 'Not set' }}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500; color: #666;">User Type:</span>
                <span style="font-weight: 600; color: #333;">
                  <span :style="{ color: authStore.isExternal ? '#ff6b6b' : '#4ecdc4' }">
                    {{ authStore.isExternal ? 'External User' : 'Internal User' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            <h3 style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 15px;">Authentication Status</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500; color: #666;">Status:</span>
                <span style="font-weight: 600; color: #28a745;">✓ Authenticated</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500; color: #666;">Session:</span>
                <span style="font-weight: 600; color: #28a745;">✓ Active</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500; color: #666;">Authentication:</span>
                <span style="font-weight: 600; color: #28a745;">✓ HttpOnly Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <h2 style="font-size: 24px; font-weight: 600; color: #333; margin-bottom: 20px;">
          Quick Actions
        </h2>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
          <button @click="goToMap" style="padding: 15px 30px; background: #007bff; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 8px;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4-2V5l-4-2m-6 3l4-2m-4 2v10m6-10v10" />
            </svg>
            Open Map Application
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import PageHeader from './PageHeader.vue'

const authStore = useAuthStore()
const router = useRouter()

// Simple computed values for role status
const isExternal = computed(() => authStore.isExternal)
const isInternal = computed(() => authStore.isInternal)

const goToMap = () => {
  router.push('/map')
}
</script> 