import api from './api'
import axios from 'axios'
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const loginData = {
        email: credentials.email,
        password: credentials.password
      }
      
      try {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', loginData)
        
        if (response.data && response.data.success && response.data.data) {
          return response.data.data
        } else {
          throw new Error('Formato de resposta inválido')
        }
      } catch (apiError: any) {
        const directResponse = await axios.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', loginData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (directResponse.data && directResponse.data.success && directResponse.data.data) {
          return directResponse.data.data
        } else {
          throw new Error('Formato de resposta direta inválido')
        }
      }
    } catch (error: any) {
      throw error
    }
  },

  async register(data: RegisterData, profileImage?: File | null): Promise<AuthResponse> {
    try {
      if (profileImage) {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('password', data.password)
        if (data.description) {
          formData.append('description', data.description)
        }
        formData.append('profileImage', profileImage)
        
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', formData)
        return response.data.data
      } else {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
        return response.data.data
      }
    } catch (error: any) {
      throw error
    }
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/profile')
    
    const userData = response.data.data
    
    if (userData.profileImage && !userData.profileImage.startsWith('http')) {
      userData.profileImage = `/api/v1${userData.profileImage}`
    }
    
    return userData
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    if (data.email) {
      delete data.email
    }
    
    try {
      const response = await api.patch<ApiResponse<User>>('/users/profile', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data.data
    } catch (apiError: any) {
      const directResponse = await axios.patch<ApiResponse<User>>('/api/v1/users/profile', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      return directResponse.data.data
    }
  },

  async uploadProfileImage(formData: FormData): Promise<{ profileImage: string }> {
    try {
      if (formData.has('file')) {
        const file = formData.get('file') as File
        if (!file) {
          throw new Error('Arquivo inválido')
        }
      } else {
        throw new Error('Campo file não encontrado no FormData')
      }
      
      try {
        const response = await api.post<ApiResponse<{ profileImage: string }>>('/users/profile/image', formData)
        return response.data.data
      } catch (apiError: any) {
        const directResponse = await axios.post<ApiResponse<{ profileImage: string }>>
        (
          '/api/v1/users/profile/image', 
          formData, 
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        return directResponse.data.data
      }
    } catch (error: any) {
      throw error;
    }
  }
}
