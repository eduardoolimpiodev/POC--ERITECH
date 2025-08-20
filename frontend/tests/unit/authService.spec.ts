import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '@/services/authService'
import api from '@/services/api'

vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn()
  }
}))

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call login endpoint correctly', async () => {
    const mockCredentials = { email: 'test@example.com', password: 'password' }
    const mockResponse = { data: { access_token: 'token', user: { id: '1', name: 'Test User' } } }
    
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await authService.login(mockCredentials)

    expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials)
    expect(result).toEqual(mockResponse.data)
  })

  it('should call register endpoint correctly', async () => {
    const mockData = { name: 'Test User', email: 'test@example.com', password: 'password' }
    const mockResponse = { data: { access_token: 'token', user: { id: '1', name: 'Test User' } } }
    
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await authService.register(mockData)

    expect(api.post).toHaveBeenCalledWith('/auth/register', mockData)
    expect(result).toEqual(mockResponse.data)
  })

  it('should call getProfile endpoint correctly', async () => {
    const mockResponse = { data: { id: '1', name: 'Test User', email: 'test@example.com' } }
    
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await authService.getProfile()

    expect(api.get).toHaveBeenCalledWith('/users/profile')
    expect(result).toEqual(mockResponse.data)
  })

  it('should call updateProfile endpoint correctly', async () => {
    const mockData = { name: 'Updated Name' }
    const mockResponse = { data: { id: '1', name: 'Updated Name', email: 'test@example.com' } }
    
    vi.mocked(api.patch).mockResolvedValue(mockResponse)

    const result = await authService.updateProfile(mockData)

    expect(api.patch).toHaveBeenCalledWith('/users/profile', mockData)
    expect(result).toEqual(mockResponse.data)
  })

  it('should call uploadProfileImage endpoint correctly', async () => {
    const mockFormData = new FormData()
    mockFormData.append('file', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg')
    
    const mockResponse = { data: { profileImage: 'image-url.jpg' } }
    
    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await authService.uploadProfileImage(mockFormData)

    expect(api.post).toHaveBeenCalledWith('/users/profile/image', mockFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    expect(result).toEqual(mockResponse.data)
  })
})
