import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cryptoService } from '@/services/cryptoService'
import api from '@/services/api'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('Crypto Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call getCryptocurrencies endpoint correctly', async () => {
    const mockParams = { name: 'Bitcoin' }
    const mockCryptos = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000 }
    ]
    const mockResponse = { data: mockCryptos }
    
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await cryptoService.getCryptocurrencies(mockParams)

    expect(api.get).toHaveBeenCalledWith('/cryptocurrencies', { params: mockParams })
    expect(result).toEqual(mockCryptos)
  })

  it('should call getTopCryptocurrencies endpoint correctly', async () => {
    const mockLimit = 3
    const mockCryptos = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000 },
      { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3000 },
      { id: '3', name: 'Cardano', symbol: 'ADA', price: 2 }
    ]
    const mockResponse = { data: mockCryptos }
    
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await cryptoService.getTopCryptocurrencies(mockLimit)

    expect(api.get).toHaveBeenCalledWith(`/cryptocurrencies/top/${mockLimit}`)
    expect(result).toEqual(mockCryptos)
  })

  it('should call searchCryptocurrencies endpoint correctly', async () => {
    const mockQuery = 'BTC'
    const mockCryptos = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 50000 }
    ]
    const mockResponse = { data: mockCryptos }
    
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await cryptoService.searchCryptocurrencies(mockQuery)

    expect(api.get).toHaveBeenCalledWith('/cryptocurrencies/search', {
      params: { q: mockQuery }
    })
    expect(result).toEqual(mockCryptos)
  })
})
