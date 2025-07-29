<template>
  <div class="auth-example">
    <h3>Authentication Status</h3>
    
    <div class="auth-info">
      <p><strong>Username:</strong> {{ user?.username || 'Not logged in' }}</p>
      <p><strong>Role:</strong> 
        <span v-if="isExternal" class="badge external">External User</span>
        <span v-else-if="isInternal" class="badge internal">Internal User</span>
        <span v-else class="badge unknown">Unknown</span>
      </p>
      <p><strong>Authentication Status:</strong> 
        <span v-if="isAuthenticated" class="status authenticated">Authenticated</span>
        <span v-else class="status not-authenticated">Not Authenticated</span>
      </p>
    </div>
    
    <!-- Conditional content based on user role -->
    <div v-if="isExternal" class="external-content">
      <h4>External User Features</h4>
      <p>This content is only visible to external users (role_id: 4)</p>
      <ul>
        <li>Limited access to certain layers</li>
        <li>Basic search functionality</li>
        <li>View-only mode for some features</li>
      </ul>
    </div>
    
    <div v-else-if="isInternal" class="internal-content">
      <h4>Internal User Features</h4>
      <p>This content is only visible to internal users</p>
      <ul>
        <li>Full access to all layers</li>
        <li>Advanced search and filter options</li>
        <li>Edit and administrative functions</li>
        <li>Export and download capabilities</li>
      </ul>
    </div>
    
    <div v-else class="guest-content">
      <h4>Guest Access</h4>
      <p>Please log in to access features</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'

const { isExternal, isInternal, isAuthenticated, user } = useAuth()
</script>

<style scoped>
.auth-example {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.auth-info {
  margin-bottom: 20px;
}

.auth-info p {
  margin: 8px 0;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.badge.external {
  background: #ff6b6b;
  color: white;
}

.badge.internal {
  background: #4ecdc4;
  color: white;
}

.badge.unknown {
  background: #95a5a6;
  color: white;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.authenticated {
  background: #2ecc71;
  color: white;
}

.status.not-authenticated {
  background: #e74c3c;
  color: white;
}

.external-content, .internal-content, .guest-content {
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.external-content {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
}

.internal-content {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
}

.guest-content {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  margin: 5px 0;
}
</style> 