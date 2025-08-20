import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                loading: false
              }
            }
          })
        ]
      }
    })

    expect(wrapper.find('h1').text()).toContain('Login')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('updates form data when inputs change', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    expect((emailInput.element as HTMLInputElement).value).toBe('test@example.com')
    expect((passwordInput.element as HTMLInputElement).value).toBe('password123')
  })

  it('calls login action when form is submitted', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })

    const authStore = useAuthStore()
    authStore.login = vi.fn().mockResolvedValue(undefined)

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await form.trigger('submit.prevent')

    expect(authStore.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('shows loading state when submitting', async () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                loading: true
              }
            }
          })
        ]
      }
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })
})
