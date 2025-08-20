<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

onMounted(() => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #ffffff;
  background: #1a1a1a;
}

#app {
  min-height: 100vh;
  background: #1a1a1a;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
