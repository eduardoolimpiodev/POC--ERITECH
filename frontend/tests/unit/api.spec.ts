import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import api from '@/services/api'

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: vi.fn()
        },
        response: {
          use: vi.fn()
        }
      }
    }))
  }
}))

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('should create axios instance with correct configuration', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '/api/v1',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })

  it('should set up request interceptor', () => {
    const axiosInstance = axios.create()
    expect(axiosInstance.interceptors.request.use).toHaveBeenCalled()
  })

  it('should set up response interceptor', () => {
    const axiosInstance = axios.create()
    expect(axiosInstance.interceptors.response.use).toHaveBeenCalled()
  })
})
