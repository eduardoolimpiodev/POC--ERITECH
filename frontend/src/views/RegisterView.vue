<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>Cadastrar</h1>
        <p>Crie sua conta Erictel</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            :disabled="authStore.loading"
            placeholder="Seu nome completo"
          />
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="authStore.loading"
            placeholder="seu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="authStore.loading"
            placeholder="Sua senha"
          />
        </div>

        <div class="form-group">
          <label for="description">Experiência/Descrição</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            :disabled="authStore.loading"
            placeholder="Conte um pouco sobre sua experiência..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="profileImage">Imagem de Perfil (opcional)</label>
          <div class="image-upload-container">
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              :disabled="authStore.loading"
              class="image-input"
            />
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview da imagem" />
              <button type="button" @click="removeImage" class="remove-image-btn">×</button>
            </div>
            <div v-else class="image-placeholder">
              <span>📷</span>
              <p>Clique para adicionar uma foto</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="register-btn"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>

      <div class="register-footer">
        <p>
          Já tem uma conta?
          <router-link to="/login" class="login-link">
            Entrar
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { RegisterData } from '@/types'

const authStore = useAuthStore()
const imagePreview = ref<string | null>(null)
const selectedImage = ref<File | null>(null)

const form = reactive<RegisterData>({
  name: '',
  email: '',
  password: '',
  description: ''
})

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor, selecione apenas arquivos de imagem (JPEG, PNG, GIF)')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB')
      return
    }
    
    selectedImage.value = file
    
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
  const input = document.getElementById('profileImage') as HTMLInputElement
  if (input) input.value = ''
}

const handleRegister = async () => {
  try {
    await authStore.register(form, selectedImage.value)
  } catch (error) {
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  padding: 20px;
} 

.register-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  border: 1px solid #3a3a3a;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  color: white;
  margin-bottom: 8px;
  font-size: 2rem;
}

.register-header p {
  color: #cccccc;
  font-size: 1rem;
}

.register-form {
  margin-bottom: 20px;
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
  min-height: 80px;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.register-footer {
  text-align: center;
}

.register-footer p {
  color: #cccccc;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

.image-upload-container {
  position: relative;
  border: 2px dashed #444444;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: border-color 0.3s;
  cursor: pointer;
  background: #333333;
}

.image-upload-container:hover {
  border-color: #666666;
}

.image-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-placeholder {
  color: #cccccc;
}

.image-placeholder span {
  font-size: 2rem;
  display: block;
  margin-bottom: 8px;
}

.image-placeholder p {
  margin: 0;
  font-size: 0.9rem;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #667eea;
}

.remove-image-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.remove-image-btn:hover {
  background: #ff3742;
}
</style>
