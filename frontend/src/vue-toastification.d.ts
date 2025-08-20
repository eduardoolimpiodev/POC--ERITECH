declare module 'vue-toastification' {
  import { Plugin } from 'vue'

  export interface ToastOptions {
    position?: string
    timeout?: number
    closeOnClick?: boolean
    pauseOnFocusLoss?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    draggablePercent?: number
    showCloseButtonOnHover?: boolean
    hideProgressBar?: boolean
    closeButton?: string | boolean
    icon?: boolean | string
    rtl?: boolean
  }

  export interface ToastInterface {
    success(message: string, options?: ToastOptions): void
    error(message: string, options?: ToastOptions): void
    info(message: string, options?: ToastOptions): void
    warning(message: string, options?: ToastOptions): void
    default(message: string, options?: ToastOptions): void
    clear(): void
  }

  export function useToast(): ToastInterface

  export const ToastPlugin: Plugin
  export default ToastPlugin
}
