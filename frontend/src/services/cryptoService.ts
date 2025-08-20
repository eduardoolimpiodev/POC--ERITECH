import api from './api'
import type { Cryptocurrency, CryptocurrencyFilters } from '@/types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
}

export const cryptoService = {
  async getCryptocurrencies(params?: CryptocurrencyFilters): Promise<Cryptocurrency[]> {
    const response = await api.get<ApiResponse<Cryptocurrency[]>>('/cryptocurrencies', { params })
    return response.data.data
  },

  async getTopCryptocurrencies(limit: number = 5): Promise<Cryptocurrency[]> {
    const response = await api.get<ApiResponse<Cryptocurrency[]>>('/cryptocurrencies/top', {
      params: { limit }
    })
    return response.data.data
  },

  async searchCryptocurrencies(query: string): Promise<Cryptocurrency[]> {
    const response = await api.get<ApiResponse<Cryptocurrency[]>>('/cryptocurrencies/search', {
      params: { q: query }
    })
    return response.data.data
  }
}
