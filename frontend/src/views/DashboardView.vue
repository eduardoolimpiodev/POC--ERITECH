<template>
  <div class="dashboard">
    <NavBar />
    
    <div class="dashboard-content">
      <div class="welcome-section">
        <h1>Bem-vindo, {{ authStore.user?.name || 'Usuário' }}!</h1>
        <p>Gerencie suas criptomoedas e perfil</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-info">
            <h3>Perfil</h3>
            <p>{{ authStore.user?.email }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>Criptomoedas</h3>
            <p>{{ topCryptos.length }} disponíveis</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>Status</h3>
            <p>Ativo</p>
          </div>
        </div>
      </div>

      <div class="actions-section">
        <h2>Ações Rápidas</h2>
        <div class="actions-grid">
          <router-link to="/cryptocurrencies" class="action-card">
            <div class="action-icon">🪙</div>
            <h3>Ver Criptomoedas</h3>
            <p>Explore todas as criptomoedas disponíveis</p>
          </router-link>

          <router-link to="/profile" class="action-card">
            <div class="action-icon">⚙️</div>
            <h3>Editar Perfil</h3>
            <p>Atualize suas informações pessoais</p>
          </router-link>
        </div>
      </div>

      <div class="crypto-preview">
        <h2>Top Criptomoedas</h2>
        <div class="crypto-list" v-if="!cryptoStore.loading">
          <div
            v-for="crypto in topCryptos"
            :key="crypto.id"
            class="crypto-item"
            @click="goToCryptocurrencies"
          >
            <CryptoIcon :symbol="crypto.symbol" size="small" />
            <div class="crypto-details">
              <h4>{{ crypto.name }}</h4>
              <span class="crypto-symbol">{{ crypto.symbol }}</span>
            </div>
            <div class="crypto-price">
              <span class="price-value">${{ formatPrice(crypto.price_usd) }}</span>
              <span class="price-change" :class="{ 
                'positive': crypto.percent_change_24h > 0, 
                'negative': crypto.percent_change_24h < 0 
              }">
                {{ crypto.percent_change_24h > 0 ? '+' : '' }}{{ crypto.percent_change_24h.toFixed(2) }}%
              </span>
            </div>
          </div>
        </div>

        <div v-if="cryptoStore.loading" class="loading">
          <div class="spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCryptocurrencyStore } from '@/stores/cryptocurrency'
import NavBar from '@/components/NavBar.vue'
import CryptoIcon from '@/components/CryptoIcon.vue'
import type { Cryptocurrency } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const cryptoStore = useCryptocurrencyStore()

const topCryptos = ref<Cryptocurrency[]>([])

const goToCryptocurrencies = () => {
  router.push('/cryptocurrencies')
}

const formatPrice = (price: number): string => {
  if (price === undefined || price === null) return '0.00'
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

onMounted(async () => {
  try {
    topCryptos.value = await cryptoStore.getTopCryptocurrencies(5)
  } catch (error) {
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #1a1a1a;
}

.dashboard-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.welcome-section p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #3a3a3a;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  color: white;
  margin: 0 0 4px 0;
  font-size: 1.1rem;
}

.stat-info p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
}

.actions-section {
  margin-bottom: 40px;
}

.actions-section h2 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  color: white;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid #3a3a3a;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.action-card h3 {
  margin: 0 0 8px 0;
  color: white;
  font-size: 1.3rem;
}

.action-card p {
  margin: 0;
  color: #cccccc;
  line-height: 1.5;
}

.crypto-preview {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #3a3a3a;
}

.crypto-preview h2 {
  color: white;
  margin: 0 0 20px 0;
  font-size: 1.8rem;
}

.crypto-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.crypto-item {
  background: #333333;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 1px solid #444444;
}

.crypto-item:hover {
  background: #3a3a3a;
}

.crypto-details {
  flex: 1;
  margin-left: 16px;
}

.crypto-details h4 {
  margin: 0 0 4px 0;
  color: white;
  font-size: 1rem;
}

.crypto-symbol {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.crypto-price {
  text-align: right;
}

.price-value {
  display: block;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 2px;
}

.price-change {
  font-size: 0.85rem;
  font-weight: 500;
}

.price-change.positive {
  color: #4caf50;
}

.price-change.negative {
  color: #f44336;
}

.loading {
  text-align: center;
  color: white;
  padding: 40px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
