import { ToastPlugin, type ToastOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const toastOptions: ToastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 60,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

export { ToastPlugin, toastOptions }
