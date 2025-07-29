<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
    <div style="text-align: center;">
      <div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
      <p style="color: #666; font-size: 16px;">Loading application...</p>
    </div>
  </div>
</template>

<script setup>
// Loading component
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 