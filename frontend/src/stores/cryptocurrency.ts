import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { cryptoService } from '@/services/cryptoService'
import type { Cryptocurrency, CryptocurrencyFilters } from '@/types'

const useToast = () => {
  return {
    success: (message: string) => {},
    error: (message: string) => {},
    info: (message: string) => {},
    warning: (message: string) => {}
  }
}

export const useCryptocurrencyStore = defineStore('cryptocurrency', () => {
  const toast = useToast()

  const cryptocurrencies = ref<Cryptocurrency[]>([])
  const selectedCrypto = ref<Cryptocurrency | null>(null)
  const loading = ref(false)
  const filters = reactive<CryptocurrencyFilters>({
    name: '',
    symbol: '',
    type: ''
  })

  const fetchCryptocurrencies = async (queryParams: CryptocurrencyFilters = {}) => {
    try {
      loading.value = true
      const data = await cryptoService.getCryptocurrencies(queryParams)
      cryptocurrencies.value = data
    } catch (error: any) {
      toast.error('Erro ao carregar criptomoedas')
      throw error
    } finally {
      loading.value = false
    }
  }

  const getTopCryptocurrencies = async (limit: number = 5) => {
    try {
      loading.value = true
      const data = await cryptoService.getTopCryptocurrencies(limit)
      return data
    } catch (error: any) {
      toast.error('Erro ao carregar top criptomoedas')
      throw error
    } finally {
      loading.value = false
    }
  }

  const searchCryptocurrencies = async () => {
    const queryParams: CryptocurrencyFilters = {}
    
    if (filters.name) queryParams.name = filters.name
    if (filters.symbol) queryParams.symbol = filters.symbol
    if (filters.type) queryParams.type = filters.type

    await fetchCryptocurrencies(queryParams)
  }

  const selectCryptocurrency = (crypto: Cryptocurrency) => {
    selectedCrypto.value = crypto
  }

  const clearSelection = () => {
    selectedCrypto.value = null
  }

  const clearFilters = () => {
    filters.name = ''
    filters.symbol = ''
    filters.type = ''
  }

  return {
    cryptocurrencies,
    selectedCrypto,
    loading,
    filters,
    fetchCryptocurrencies,
    getTopCryptocurrencies,
    searchCryptocurrencies,
    selectCryptocurrency,
    clearSelection,
    clearFilters
  }
})
