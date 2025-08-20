import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import type { User, LoginCredentials, RegisterData } from '@/types'

const useToast = () => {
  return {
    success: (_message: string) => {},
    error: (_message: string) => {},
    info: (_message: string) => {},
    warning: (_message: string) => {}
  }
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const toast = useToast()

  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const initializeAuth = async () => {
    if (token.value) {
      try {
        await fetchUserProfile()
      } catch (error) {
        logout()
      }
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(credentials.email)) {
        throw new Error('Formato de email inválido')
      }
      
      let response;
      try {
        response = await authService.login(credentials)
      } catch (apiError: any) {
        throw apiError
      }
      
      if (!response) {
        throw new Error('Resposta vazia recebida do servidor')
      }
      
      if (!response.access_token) {
        throw new Error('Token não recebido do servidor')
      }
      
      token.value = response.access_token
      user.value = response.user
      localStorage.setItem('token', response.access_token)
      
      toast.success('Login realizado com sucesso!')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Email ou senha incorretos')
      } else if (error.response?.status === 400) {
        toast.error('Dados inválidos. Verifique seu email e senha.')
      } else if (error.message === 'Formato de email inválido') {
        toast.error('Formato de email inválido')
      } else if (error.message.includes('Network Error')) {
        toast.error('Erro de conexão com o servidor. Verifique se o backend está rodando.')
      } else {
        toast.error(error.response?.data?.message || 'Erro ao fazer login. Tente novamente.')
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterData, profileImage?: File | null) => {
    try {
      loading.value = true
      const response = await authService.register(data, profileImage)
      token.value = response.access_token
      user.value = response.user
      localStorage.setItem('token', response.access_token)
      toast.success('Cadastro realizado com sucesso!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer cadastro')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchUserProfile = async () => {
    try {
      const profile = await authService.getProfile()
      user.value = profile
    } catch (error: any) {
      toast.error('Erro ao carregar perfil do usuário')
      throw error
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      loading.value = true
      
      const updateData = {
        name: data.name,
        description: data.description
      }
      
      user.value = await authService.updateProfile(updateData)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil')
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
    toast.info('Logout realizado com sucesso!')
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    initializeAuth,
    login,
    register,
    fetchUserProfile,
    updateProfile,
    logout
  }
})
