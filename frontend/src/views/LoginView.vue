<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Entrar</h1>
        <p>Acesse sua conta Erictel</p>
      </div>

      <div v-if="loginError" class="error-banner">
        {{ loginError }}
      </div>

      <form @submit.prevent="validateAndLogin" class="login-form">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="authStore.loading"
            placeholder="seu@email.com"
            @blur="validateEmail"
            @input="clearErrors"
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
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
            @input="clearErrors"
          />
        </div>

        <button
          type="submit"
          class="login-btn"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="login-status" v-if="loginStatus">
        {{ loginStatus }}
      </div>

      <div class="login-footer">
        <p>
          Não tem uma conta?
          <router-link to="/register" class="register-link">
            Cadastre-se
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types'

const authStore = useAuthStore()

const form = reactive<LoginCredentials>({
  email: '',
  password: ''
})

const emailError = ref('')
const loginError = ref('')
const loginStatus = ref('')

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    emailError.value = 'Por favor, insira um email válido'
    return false
  }
  emailError.value = ''
  return true
}

const clearErrors = () => {
  emailError.value = ''
  loginError.value = ''
}

const validateAndLogin = async () => {
  clearErrors()
  loginStatus.value = ''
  
  if (!validateEmail()) {
    return
  }
  
  if (!form.password || form.password.length < 3) {
    loginError.value = 'A senha deve ter pelo menos 3 caracteres'
    return
  }
  
  loginStatus.value = 'Enviando dados de login...'
  
  try {
    await authStore.login(form)
    loginStatus.value = 'Login bem-sucedido! Redirecionando...'
  } catch (error: any) {
    loginStatus.value = ''
    
    if (error.message?.includes('Network Error')) {
      loginError.value = 'Erro de conexão com o servidor. Verifique se o backend está rodando.'
    } else if (error.response?.status === 401) {
      loginError.value = 'Email ou senha incorretos'
    } else if (error.response?.status === 400) {
      loginError.value = 'Dados inválidos. Verifique seu email e senha.'
    } else {
      loginError.value = error.response?.data?.message || 'Erro ao fazer login. Tente novamente.'
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  padding: 20px;
}

.login-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  border: 1px solid #3a3a3a;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: white;
  margin-bottom: 8px;
  font-size: 2rem;
}

.login-header p {
  color: #cccccc;
  font-size: 1rem;
}

.login-form {
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

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #444444;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  background: #333333;
  color: white;
}

.form-group input:focus {
  outline: none;
  border-color: #666666;
}

.form-group input:disabled {
  background-color: #222222;
  cursor: not-allowed;
  opacity: 0.6;
}

.error-message {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.login-btn {
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

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  text-align: center;
}

.login-footer p {
  color: #cccccc;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.error-banner {
  background-color: rgba(244, 67, 54, 0.1);
  border-left: 4px solid #f44336;
  color: #f44336;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-size: 14px;
}

.login-status {
  margin-top: 15px;
  text-align: center;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
}
</style>
