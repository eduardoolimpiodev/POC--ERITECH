import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  })
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

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    uploadProfileImage: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('should initialize with correct state', () => {
    const store = useAuthStore()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should login successfully', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    const mockToken = 'mock-token'
    const mockCredentials = { email: 'test@example.com', password: 'password' }
    
    vi.mocked(authService.login).mockResolvedValue({
      access_token: mockToken,
      user: mockUser
    })

    const store = useAuthStore()
    await store.login(mockCredentials)

    expect(authService.login).toHaveBeenCalledWith(mockCredentials)
    expect(store.token).toBe(mockToken)
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken)
  })

  it('should handle login error', async () => {
    const mockCredentials = { email: 'test@example.com', password: 'wrong-password' }
    const mockError = new Error('Invalid credentials')
    
    vi.mocked(authService.login).mockRejectedValue(mockError)

    const store = useAuthStore()
    
    await expect(store.login(mockCredentials)).rejects.toThrow()
    
    expect(authService.login).toHaveBeenCalledWith(mockCredentials)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should logout correctly', () => {
    const store = useAuthStore()
    
    store.token = 'mock-token'
    store.user = { id: '1', name: 'Test User', email: 'test@example.com' }
    localStorageMock.setItem('token', 'mock-token')
    
    store.logout()
    
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
  })

  it('should fetch user profile successfully', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    
    vi.mocked(authService.getProfile).mockResolvedValue(mockUser)

    const store = useAuthStore()
    await store.fetchUserProfile()

    expect(authService.getProfile).toHaveBeenCalled()
    expect(store.user).toEqual(mockUser)
  })

  it('should update user profile successfully', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    const updatedUser = { ...mockUser, name: 'Updated Name' }
    
    vi.mocked(authService.updateProfile).mockResolvedValue(updatedUser)

    const store = useAuthStore()
    await store.updateProfile({ name: 'Updated Name' })

    expect(authService.updateProfile).toHaveBeenCalledWith({ name: 'Updated Name' })
    expect(store.user).toEqual(updatedUser)
  })
})
