import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    path: '/'
  })
}))

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when authenticated', () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
                user: { name: 'Test User', email: 'test@example.com' }
              }
            }
          })
        ],
        stubs: ['router-link']
      }
    })

    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('.user-info').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test User')
    expect(wrapper.find('.logout-button').exists()).toBe(true)
  })

  it('renders correctly when not authenticated', () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: false,
                user: null
              }
            }
          })
        ],
        stubs: ['router-link']
      }
    })

    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('.user-info').exists()).toBe(false)
    expect(wrapper.find('.login-button').exists()).toBe(true)
    expect(wrapper.find('.register-button').exists()).toBe(true)
  })

  it('calls logout when logout button is clicked', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
                user: { name: 'Test User', email: 'test@example.com' }
              }
            }
          })
        ],
        stubs: ['router-link']
      }
    })

    const authStore = useAuthStore()
    authStore.logout = vi.fn()

    const logoutButton = wrapper.find('.logout-button')
    await logoutButton.trigger('click')

    expect(authStore.logout).toHaveBeenCalled()
  })

  it('highlights active navigation item', () => {
    vi.mock('vue-router', () => ({
      useRouter: () => ({
        push: vi.fn()
      }),
      useRoute: () => ({
        path: '/dashboard'
      })
    }))

    const wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                isAuthenticated: true,
                user: { name: 'Test User', email: 'test@example.com' }
              }
            }
          })
        ],
        stubs: ['router-link']
      }
    })

    const navItems = wrapper.findAll('.nav-item')
    const dashboardItem = navItems.find(item => item.attributes('to') === '/dashboard')
    
    expect(dashboardItem.classes()).toContain('active')
  })
})
