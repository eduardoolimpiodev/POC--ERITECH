import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCryptocurrencyStore } from '@/stores/cryptocurrency'
import { cryptoService } from '@/services/cryptoService'

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  })
}))

vi.mock('@/services/cryptoService', () => ({
  cryptoService: {
    getCryptocurrencies: vi.fn(),
    getTopCryptocurrencies: vi.fn(),
    searchCryptocurrencies: vi.fn()
  }
}))

describe('Cryptocurrency Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with correct state', () => {
    const store = useCryptocurrencyStore()
    expect(store.cryptocurrencies).toEqual([])
    expect(store.selectedCrypto).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.filters).toEqual({
      name: '',
      symbol: '',
      type: ''
    })
  })

  it('should fetch cryptocurrencies successfully', async () => {
    const mockCryptos = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000 },
      { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3000 }
    ]
    
    vi.mocked(cryptoService.getCryptocurrencies).mockResolvedValue(mockCryptos)

    const store = useCryptocurrencyStore()
    await store.fetchCryptocurrencies()

    expect(cryptoService.getCryptocurrencies).toHaveBeenCalled()
    expect(store.cryptocurrencies).toEqual(mockCryptos)
    expect(store.loading).toBe(false)
  })

  it('should handle fetch cryptocurrencies error', async () => {
    const mockError = new Error('Failed to fetch cryptocurrencies')
    
    vi.mocked(cryptoService.getCryptocurrencies).mockRejectedValue(mockError)

    const store = useCryptocurrencyStore()
    
    await expect(store.fetchCryptocurrencies()).rejects.toThrow()
    
    expect(cryptoService.getCryptocurrencies).toHaveBeenCalled()
    expect(store.cryptocurrencies).toEqual([])
    expect(store.loading).toBe(false)
  })

  it('should fetch top cryptocurrencies successfully', async () => {
    const mockTopCryptos = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000 },
      { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3000 }
    ]
    
    vi.mocked(cryptoService.getTopCryptocurrencies).mockResolvedValue(mockTopCryptos)

    const store = useCryptocurrencyStore()
    const result = await store.getTopCryptocurrencies(2)

    expect(cryptoService.getTopCryptocurrencies).toHaveBeenCalledWith(2)
    expect(result).toEqual(mockTopCryptos)
  })

  it('should search cryptocurrencies with filters', async () => {
    const mockCryptos = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000 }
    ]
    
    vi.mocked(cryptoService.getCryptocurrencies).mockResolvedValue(mockCryptos)

    const store = useCryptocurrencyStore()
    store.filters.name = 'Bitcoin'
    await store.searchCryptocurrencies()

    expect(cryptoService.getCryptocurrencies).toHaveBeenCalledWith({ name: 'Bitcoin' })
    expect(store.cryptocurrencies).toEqual(mockCryptos)
  })

  it('should select cryptocurrency correctly', () => {
    const mockCrypto = { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000 }
    
    const store = useCryptocurrencyStore()
    store.selectCryptocurrency(mockCrypto)

    expect(store.selectedCrypto).toEqual(mockCrypto)
  })

  it('should clear selection correctly', () => {
    const mockCrypto = { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000 }
    
    const store = useCryptocurrencyStore()
    store.selectCryptocurrency(mockCrypto)
    store.clearSelection()

    expect(store.selectedCrypto).toBeNull()
  })

  it('should clear filters correctly', () => {
    const store = useCryptocurrencyStore()
    store.filters.name = 'Bitcoin'
    store.filters.symbol = 'BTC'
    store.filters.type = 'crypto'
    
    store.clearFilters()

    expect(store.filters).toEqual({
      name: '',
      symbol: '',
      type: ''
    })
  })
})
