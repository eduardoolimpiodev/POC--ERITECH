import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

let ToastPlugin, toastOptions
try {
  const toastModule = await import('./plugins/toast')
  ToastPlugin = toastModule.ToastPlugin
  toastOptions = toastModule.toastOptions
} catch (error) {
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

if (ToastPlugin && toastOptions) {
  app.use(ToastPlugin, toastOptions)
}

app.mount('#app')
