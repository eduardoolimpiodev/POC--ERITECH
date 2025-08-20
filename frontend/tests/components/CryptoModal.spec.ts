import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CryptoModal from '@/components/CryptoModal.vue'
import { useCryptocurrencyStore } from '@/stores/cryptocurrency'

describe('CryptoModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when a cryptocurrency is selected', () => {
    const mockCrypto = {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      marketCap: 1000000000,
      volume24h: 50000000,
      change24h: 2.5,
      imageUrl: 'bitcoin.png'
    }

    const wrapper = mount(CryptoModal, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cryptocurrency: {
                selectedCrypto: mockCrypto
              }
            }
          })
        ]
      }
    })

    expect(wrapper.find('.modal').exists()).toBe(true)
    expect(wrapper.find('.modal-title').text()).toContain('Bitcoin')
    expect(wrapper.find('.crypto-symbol').text()).toContain('BTC')
    expect(wrapper.text()).toContain('$50000')
  })

  it('does not render when no cryptocurrency is selected', () => {
    const wrapper = mount(CryptoModal, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cryptocurrency: {
                selectedCrypto: null
              }
            }
          })
        ]
      }
    })

    expect(wrapper.find('.modal').exists()).toBe(false)
  })

  it('calls clearSelection when close button is clicked', async () => {
    const mockCrypto = {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      marketCap: 1000000000,
      volume24h: 50000000,
      change24h: 2.5,
      imageUrl: 'bitcoin.png'
    }

    const wrapper = mount(CryptoModal, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cryptocurrency: {
                selectedCrypto: mockCrypto
              }
            }
          })
        ]
      }
    })

    const cryptoStore = useCryptocurrencyStore()
    cryptoStore.clearSelection = vi.fn()

    const closeButton = wrapper.find('.close-button')
    await closeButton.trigger('click')

    expect(cryptoStore.clearSelection).toHaveBeenCalled()
  })

  it('displays positive change in green and negative change in red', () => {
    const mockCryptoPositive = {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      marketCap: 1000000000,
      volume24h: 50000000,
      change24h: 2.5,
      imageUrl: 'bitcoin.png'
    }

    const wrapperPositive = mount(CryptoModal, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cryptocurrency: {
                selectedCrypto: mockCryptoPositive
              }
            }
          })
        ]
      }
    })

    const changeElement = wrapperPositive.find('.change-value')
    expect(changeElement.classes()).toContain('positive')

    const mockCryptoNegative = {
      ...mockCryptoPositive,
      change24h: -2.5
    }

    const wrapperNegative = mount(CryptoModal, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              cryptocurrency: {
                selectedCrypto: mockCryptoNegative
              }
            }
          })
        ]
      }
    })

    const changeElementNegative = wrapperNegative.find('.change-value')
    expect(changeElementNegative.classes()).toContain('negative')
  })
})
