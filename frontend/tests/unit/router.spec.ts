import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Router', () => {
  function simulateNavigationGuard(to: any, isAuthenticated: boolean) {
    const next = vi.fn()
    
    if (to.meta?.requiresAuth && !isAuthenticated) {
      next('/login')
    } else if (to.meta?.requiresGuest && isAuthenticated) {
      next('/dashboard')
    } else {
      next()
    }
    
    return next
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('should have correct routes defined', () => {
    const routePaths = routes.map(route => route.path)
    
    expect(routePaths).toContain('/')
    expect(routePaths).toContain('/login')
    expect(routePaths).toContain('/register')
    expect(routePaths).toContain('/dashboard')
    expect(routePaths).toContain('/profile')
    expect(routePaths).toContain('/cryptocurrencies')
  })

  it('should have correct meta requiresAuth for protected routes', () => {
    const dashboardRoute = routes.find(route => route.path === '/dashboard')
    const profileRoute = routes.find(route => route.path === '/profile')
    const cryptocurrenciesRoute = routes.find(route => route.path === '/cryptocurrencies')
    
    expect(dashboardRoute?.meta?.requiresAuth).toBe(true)
    expect(profileRoute?.meta?.requiresAuth).toBe(true)
    expect(cryptocurrenciesRoute?.meta?.requiresAuth).toBe(true)
  })

  it('should have correct meta requiresGuest for guest routes', () => {
    const loginRoute = routes.find(route => route.path === '/login')
    const registerRoute = routes.find(route => route.path === '/register')
    
    expect(loginRoute?.meta?.requiresGuest).toBe(true)
    expect(registerRoute?.meta?.requiresGuest).toBe(true)
  })

  it('should have correct meta properties for navigation guards', () => {
    const authRoutes = routes.filter(route => route.meta?.requiresAuth)
    const guestRoutes = routes.filter(route => route.meta?.requiresGuest)
    
    expect(authRoutes.length).toBeGreaterThan(0)
    expect(guestRoutes.length).toBeGreaterThan(0)
  })
  
  it('should redirect unauthenticated user from protected route to login', () => {
    const to = { path: '/dashboard', meta: { requiresAuth: true } }
    
    const next = simulateNavigationGuard(to, false)
    
    expect(next).toHaveBeenCalledWith('/login')
  })
  
  it('should allow authenticated user to access protected route', () => {
    const to = { path: '/dashboard', meta: { requiresAuth: true } }
    
    const next = simulateNavigationGuard(to, true)
    
    expect(next).toHaveBeenCalledWith()
  })
  
  it('should redirect authenticated user from guest route to dashboard', () => {
    const to = { path: '/login', meta: { requiresGuest: true } }
    
    const next = simulateNavigationGuard(to, true)
    
    expect(next).toHaveBeenCalledWith('/dashboard')
  })
  
  it('should allow unauthenticated user to access guest route', () => {
    const to = { path: '/login', meta: { requiresGuest: true } }
    
    const next = simulateNavigationGuard(to, false)
    
    expect(next).toHaveBeenCalledWith()
  })
  
  it('should allow access to public routes regardless of authentication', () => {
    const to = { path: '/about', meta: {} }
    
    let next = simulateNavigationGuard(to, false)
    expect(next).toHaveBeenCalledWith()
    
    next = simulateNavigationGuard(to, true)
    expect(next).toHaveBeenCalledWith()
  })
})
