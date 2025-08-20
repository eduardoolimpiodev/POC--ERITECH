<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/dashboard" class="brand-link">
          Erictel Challenge
        </router-link>
      </div>

      <div class="nav-menu" :class="{ active: isMenuOpen }">
        <router-link to="/dashboard" class="nav-link">
          Dashboard
        </router-link>
        <router-link to="/cryptocurrencies" class="nav-link">
          Criptomoedas
        </router-link>
        <router-link to="/profile" class="nav-link">
          Perfil
        </router-link>
      </div>

      <div class="nav-actions">
        <div class="user-info">
          <span class="user-name">{{ authStore.user?.name || 'Usuário' }}</span>
          <div class="user-avatar">
            <img
              v-if="authStore.user?.profileImage"
              :src="getImageUrl(authStore.user.profileImage)"
              alt="Avatar"
              class="avatar-image"
            />
            <div v-else class="default-avatar">
              {{ getInitials(authStore.user?.name) }}
            </div>
          </div>
        </div>
        
        <button @click="handleLogout" class="logout-btn">
          Sair
        </button>
      </div>

      <button @click="toggleMenu" class="mobile-toggle">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isMenuOpen = ref(false)

const getInitials = (name?: string): string => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return ''
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `http://localhost:3001${imagePath}`
}

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = (): void => {
  authStore.logout()
}
</script>

<style scoped>
.navbar {
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-brand .brand-link {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: white;
  border-radius: 1px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.user-avatar {
  width: 40px;
  height: 40px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.default-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.logout-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.mobile-toggle span {
  width: 25px;
  height: 3px;
  background: white;
  margin: 3px 0;
  transition: 0.3s;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(102, 126, 234, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 20px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-actions {
    gap: 15px;
  }

  .user-name {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-toggle.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }

  .mobile-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .mobile-toggle.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }
}
</style>
