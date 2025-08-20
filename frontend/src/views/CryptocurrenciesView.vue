<template>
  <div class="cryptocurrencies">
    <NavBar />
    
    <div class="crypto-content">
      <div class="crypto-header">
        <h1>Criptomoedas</h1>
        <p>Explore e filtre as principais criptomoedas do mercado</p>
      </div>

      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <input
              v-model="cryptoStore.filters.name"
              type="text"
              placeholder="Buscar por nome..."
              class="filter-input"
              @input="debouncedSearch"
            />
          </div>
          
          <div class="filter-group">
            <input
              v-model="cryptoStore.filters.symbol"
              type="text"
              placeholder="Símbolo (BTC, ETH...)"
              class="filter-input"
              @input="debouncedSearch"
            />
          </div>
          
          <div class="filter-group">
            <select
              v-model="cryptoStore.filters.type"
              class="filter-select"
              @change="handleSearch"
            >
              <option value="">Todos os tipos</option>
              <option value="coin">Coin</option>
              <option value="token">Token</option>
            </select>
          </div>
          
          <button @click="clearFilters" class="clear-btn">
            Limpar Filtros
          </button>
        </div>
      </div>

      <div class="crypto-grid" v-if="!cryptoStore.loading">
        <div
          v-for="crypto in cryptoStore.cryptocurrencies"
          :key="crypto.id"
          class="crypto-card"
          @click="selectCrypto(crypto)"
        >
          <CryptoIcon :symbol="crypto.symbol" />
          <div class="crypto-info">
            <h3>{{ crypto.name }}</h3>
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

      <div v-if="cryptoStore.loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando criptomoedas...</p>
      </div>

      <div v-if="!cryptoStore.loading && cryptoStore.cryptocurrencies.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Nenhuma criptomoeda encontrada</h3>
        <p>Tente ajustar os filtros de busca</p>
      </div>
    </div>

    <CryptoModal
      v-if="cryptoStore.selectedCrypto"
      :crypto="cryptoStore.selectedCrypto"
      @close="cryptoStore.clearSelection"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCryptocurrencyStore } from '@/stores/cryptocurrency'
import NavBar from '@/components/NavBar.vue'
import CryptoModal from '@/components/CryptoModal.vue'
import CryptoIcon from '@/components/CryptoIcon.vue'
import type { Cryptocurrency } from '@/types'

const cryptoStore = useCryptocurrencyStore()

let debounceTimeout: number | null = null

const debouncedSearch = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  debounceTimeout = window.setTimeout(() => {
    handleSearch()
    debounceTimeout = null
  }, 500)
}

const handleSearch = async (): Promise<void> => {
  await cryptoStore.searchCryptocurrencies()
}

const clearFilters = async (): Promise<void> => {
  cryptoStore.clearFilters()
  await cryptoStore.fetchCryptocurrencies()
}

const selectCrypto = (crypto: Cryptocurrency): void => {
  cryptoStore.selectCryptocurrency(crypto)
}

const formatPrice = (price: number): string => {
  if (price === undefined || price === null) return '0.00'
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

onMounted(async () => {
  await cryptoStore.fetchCryptocurrencies()
})
</script>

<style scoped>
.cryptocurrencies {
  min-height: 100vh;
  background: #1a1a1a;
}

.crypto-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.crypto-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.crypto-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.crypto-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.filters-section {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #3a3a3a;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-input,
.filter-select {
  padding: 12px;
  border: 2px solid #444444;
  border-radius: 8px;
  background: #333333;
  color: white;
  font-size: 14px;
  transition: border-color 0.3s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #666666;
}

.clear-btn {
  padding: 12px 20px;
  background: #444444;
  color: white;
  border: 2px solid #555555;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #555555;
  border-color: #666666;
}

.crypto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.crypto-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #3a3a3a;
}

.crypto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  background: #333333;
}

.crypto-info {
  flex: 1;
  margin-left: 15px;
}

.crypto-info h3 {
  margin: 0 0 4px 0;
  color: white;
  font-size: 1.1rem;
}

.crypto-symbol {
  color: #cccccc;
  font-size: 0.9rem;
  font-weight: 500;
}

.crypto-price {
  text-align: right;
  margin-left: 15px;
}

.price-value {
  display: block;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
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

.type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.type-badge.coin {
  background: #e3f2fd;
  color: #1976d2;
}

.type-badge.token {
  background: #f3e5f5;
  color: #7b1fa2;
}

.loading-state {
  text-align: center;
  color: white;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  color: white;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.empty-state p {
  opacity: 0.8;
}
</style>
