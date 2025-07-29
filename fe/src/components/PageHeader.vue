<template>
  <div class="page-header">
    <div class="header-content">
      <div class="user-info">
        <span class="username">{{ user?.username || 'User' }}</span>
        <div class="role-info">
          <span class="role-badge" :class="{ 'external': isExternal, 'internal': isInternal }">
            {{ isExternal ? 'External User' : 'Internal User' }}
          </span>
          <span class="role-id">Role ID: {{ user?.role_id || 'Unknown' }}</span>
        </div>
      </div>
      <div class="header-actions">
        <button @click="handleLogout" class="logout-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)
const isExternal = computed(() => authStore.isExternal)
const isInternal = computed(() => authStore.isInternal)

const handleLogout = () => {
  console.log('PageHeader: Logging out...')
  authStore.logout()
  console.log('PageHeader: Logged out, redirecting to login')
  router.push('/login')
}
</script>

<style scoped>
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 15px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.username {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.external {
  background: #ff6b6b;
  color: white;
}

.role-badge.internal {
  background: #4ecdc4;
  color: white;
}

.role-id {
  font-size: 12px;
  color: #666;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .role-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style> 