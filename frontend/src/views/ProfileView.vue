<template>
  <div class="profile">
    <NavBar />
    
    <div class="profile-content">
      <div class="profile-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais</p>
      </div>

      <div class="profile-card">
        <div class="profile-image-section">
          <div class="image-container">
            
            <img
              v-if="authStore.user?.profileImage"
              :src="getImageUrl(authStore.user.profileImage)"
              alt="Foto do perfil"
              class="profile-image"
              @error="handleImageError"
            />
            <div v-else class="default-avatar">
              {{ getInitials(authStore.user?.name) }}
            </div>
          </div>
          
          <div class="image-actions">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              style="display: none"
            />
            <button @click="fileInput?.click()" class="upload-btn">
              Alterar Foto
            </button>
          </div>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="profile-form">
          <div class="form-group">
            <label for="name">Nome Completo</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              :disabled="authStore.loading"
            />
          </div>

          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              readonly
              title="O e-mail não pode ser alterado"
              class="readonly-field"
            />
          </div>

          <div class="form-group">
            <label for="description">Experiência/Descrição</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              placeholder="Conte um pouco sobre sua experiência..."
              :disabled="authStore.loading"
            ></textarea>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="save-btn"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
            
            <button
              type="button"
              @click="handleCancel"
              class="cancel-btn"
              :disabled="authStore.loading"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import NavBar from '@/components/NavBar.vue'
import type { User } from '@/types'

const useToast = () => {
  return {
    success: (_message: string) => {},
    error: (_message: string) => {},
    info: (_message: string) => {},
    warning: (_message: string) => {}
  }
}

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
}

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const fileInput = ref<HTMLInputElement>()

const form = reactive({
  name: '',
  email: '',
  description: ''
})

const getInitials = (name?: string): string => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return ''
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  return `http://localhost:3001${imagePath}`
}

const handleImageError = (event: Event) => {
  toast.error('Não foi possível carregar a imagem de perfil')
  ;(event.target as HTMLImageElement).src = ''
  if (authStore.user) {
    authStore.user.profileImage = ''
  }
}

const resetForm = (): void => {
  if (authStore.user) {
    form.name = authStore.user.name || ''
    form.email = authStore.user.email || ''
    form.description = authStore.user.description || ''
  }
}

const handleCancel = (): void => {
  resetForm()
  router.push('/dashboard')
}

const handleUpdateProfile = async (): Promise<void> => {
  try {
    const filteredData = {
      name: form.name,
      description: form.description
    }
    await authStore.updateProfile(filteredData)
  } catch (error: any) {
    if (error.response?.status === 400) {
      toast.error('Dados inválidos. Verifique os campos do formulário.')
    } else if (error.response?.status === 401) {
      toast.error('Sessão expirada. Faça login novamente.')
      setTimeout(() => authStore.logout(), 2000)
    } else if (error.message.includes('Network Error')) {
      toast.error('Erro de conexão com o servidor. Verifique se o backend está rodando.')
    } else {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.')
    }
  }
}

const handleImageUpload = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('A imagem deve ter no máximo 5MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    toast.error('O arquivo selecionado não é uma imagem')
    return
  }

  try {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const img = new Image()
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            
            if (!ctx) {
              toast.error('Erro ao processar a imagem')
              return
            }
            
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9)
            
            const response = await fetch(jpegDataUrl)
            const blob = await response.blob()
            const jpegFile = new File([blob], `profile-${Date.now()}.jpeg`, { type: 'image/jpeg' })
            
            const formData = new FormData()
            formData.append('file', jpegFile)
            
            const uploadResponse = await axios.post<ApiResponse<{ profileImage: string }>>(
              'http://localhost:3001/api/v1/users/profile/image',
              formData,
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
              }
            )
            
            uploadResponse.data.data.profileImage
            
            await authStore.fetchUserProfile()
            toast.success('Imagem do perfil atualizada com sucesso!')
          } catch (error) {
            toast.error('Erro ao processar a imagem')
          }
        }
        
        img.src = e.target?.result as string
      } catch (error) {
        toast.error('Erro ao carregar a imagem')
      }
    }
    
    reader.readAsDataURL(file)
  } catch (error: any) {
    if (error.response?.status === 400) {
      toast.error('Formato de imagem inválido ou tamanho excedido (máx. 5MB)')
    } else if (error.response?.status === 401) {
      toast.error('Sessão expirada. Faça login novamente.')
      setTimeout(() => authStore.logout(), 2000)
    } else if (error.message.includes('Network Error')) {
      toast.error('Erro de conexão com o servidor. Verifique se o backend está rodando.')
    } else {
      toast.error(error.response?.data?.message || 'Erro ao fazer upload da imagem. Tente novamente.')
    }
  }
}

watch(
  () => authStore.user,
  (newUser: User | null) => {
    if (newUser) {
      resetForm()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (authStore.user) {
    resetForm()
  }
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: #1a1a1a;
}

.profile-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.profile-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.profile-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.profile-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid #3a3a3a;
}

.profile-image-section {
  text-align: center;
  margin-bottom: 30px;
}

.image-container {
  margin-bottom: 15px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e1e5e9;
}

.default-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto;
}

.upload-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background: #5a6fd8;
}

.profile-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: white;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #444444;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  font-family: inherit;
  background: #333333;
  color: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #666666;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #222222;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 30px;
}

.save-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  padding: 12px 24px;
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #d1d5db;
}

.cancel-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.readonly-field {
  background-color: #222222;
  opacity: 0.8;
  cursor: not-allowed;
  border-color: #3a3a3a;
}
</style>
