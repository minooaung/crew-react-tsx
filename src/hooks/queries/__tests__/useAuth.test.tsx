import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { useLogin, useSignup, useLogout } from '../useAuth'
import authReducer from '../../../store/auth'
import { User, LoginCredentials, SignupData, AuthResponseBase } from '../../../types'

// Mock console methods to avoid noise in tests
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

// Helper to get API base URL for tests
const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create test store
const createTestStore = () => configureStore({
  reducer: {
    auth: authReducer
  }
})

// Create test wrapper with all providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  const store = createTestStore()

  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  )
}

// Mock data
const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'ADMIN',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

const mockAuthResponse: AuthResponseBase = {
  user: mockUser
}

const mockLoginCredentials: LoginCredentials = {
  email: 'john@example.com',
  password: 'password123'
}

const mockSignupData: SignupData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123'
}

// MSW server setup
const server = setupServer()

describe('Authentication Hooks', () => {
  beforeEach(() => {
    server.listen()
    vi.clearAllMocks()
  })

  afterEach(() => {
    server.resetHandlers()
    server.close()
  })

  describe('useLogin', () => {
    it('should successfully login with Laravel backend', async () => {
      // Mock successful login response
      server.use(
        http.post(`${getApiBaseUrl()}/api/login`, () => {
          return HttpResponse.json(mockAuthResponse, { status: 200 })
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogin(), { wrapper })

      // Trigger login mutation
      result.current.mutate(mockLoginCredentials)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockAuthResponse)
      expect(result.current.error).toBeNull()
    })

    it('should successfully login with ASP.NET backend', async () => {
      // Mock environment variable
      vi.stubEnv('VITE_BACKEND_FRAMEWORK', 'ASP.NET')

      server.use(
        http.post(`${getApiBaseUrl()}/api/auth/login`, () => {
          return HttpResponse.json(mockAuthResponse, { status: 200 })
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogin(), { wrapper })

      result.current.mutate(mockLoginCredentials)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockAuthResponse)
      
      // Cleanup
      vi.unstubAllEnvs()
    })

    it('should handle login failure with validation errors', async () => {
      const errorResponse = {
        details: {
          email: ['The email field is required.'],
          password: ['The password field is required.']
        }
      }

      server.use(
        http.post(`${getApiBaseUrl()}/api/login`, () => {
          return HttpResponse.json(errorResponse, { status: 422 })
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogin(), { wrapper })

      result.current.mutate(mockLoginCredentials)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(errorResponse.details)
    })

    it('should handle login failure with unauthorized error', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/login`, () => {
          return HttpResponse.json(
            { error: 'Invalid credentials' }, 
            { status: 401 }
          )
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogin(), { wrapper })

      result.current.mutate(mockLoginCredentials)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual({
        general: ['Invalid credentials']
      })
    })

    it('should handle network errors', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/login`, () => {
          return HttpResponse.error()
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogin(), { wrapper })

      result.current.mutate(mockLoginCredentials)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual({
        general: ['Network error. Please check your connection.']
      })
    })

    it('should dispatch user to Redux store on successful login', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/login`, () => {
          return HttpResponse.json(mockAuthResponse, { status: 200 })
        })
      )

      // Create store and spy on dispatch
      const store = createTestStore()
      const dispatchSpy = vi.spyOn(store, 'dispatch')
      
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false }
        }
      })

      const TestWrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </Provider>
        </BrowserRouter>
      )

      const { result } = renderHook(() => useLogin(), { wrapper: TestWrapper })

      result.current.mutate(mockLoginCredentials)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Verify that the settingUser action was dispatched to Redux store
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'authentication/settingUser',
          payload: mockUser
        })
      )
      
      // Also verify the data is correct
      expect(result.current.data?.user).toEqual(mockUser)
    })
  })

  describe('useSignup', () => {
    it('should successfully signup with Laravel backend', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/signup`, () => {
          return HttpResponse.json(mockAuthResponse, { status: 201 })
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useSignup(), { wrapper })

      result.current.mutate(mockSignupData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockAuthResponse)
      expect(consoleSpy).toHaveBeenCalledWith('Signup successful:', mockUser)
    })

    it('should successfully signup with ASP.NET backend', async () => {
      vi.stubEnv('VITE_BACKEND_FRAMEWORK', 'ASP.NET')

      server.use(
        http.post(`${getApiBaseUrl()}/api/auth/signup`, () => {
          return HttpResponse.json(mockAuthResponse, { status: 201 })
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useSignup(), { wrapper })

      result.current.mutate(mockSignupData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockAuthResponse)
      
      vi.unstubAllEnvs()
    })

    it('should handle signup validation errors', async () => {
      const errorResponse = {
        details: {
          email: ['The email has already been taken.'],
          password: ['The password must be at least 8 characters.'],
          password_confirmation: ['The password confirmation does not match.']
        }
      }

      server.use(
        http.post(`${getApiBaseUrl()}/api/signup`, () => {
          return HttpResponse.json(errorResponse, { status: 422 })
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useSignup(), { wrapper })

      result.current.mutate(mockSignupData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual(errorResponse.details)
    })

    it('should handle server errors during signup', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/signup`, () => {
          return HttpResponse.json(
            { error: 'Database connection failed' }, 
            { status: 500 }
          )
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useSignup(), { wrapper })

      result.current.mutate(mockSignupData)

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual({
        general: ['Something went wrong. Please try again later.']
      })
    })
  })

  describe('useLogout', () => {
    it('should successfully logout with Laravel backend', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/logout`, () => {
          return HttpResponse.json({}, { status: 200 })
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogout(), { wrapper })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.error).toBeNull()
    })

    it('should successfully logout with ASP.NET backend', async () => {
      vi.stubEnv('VITE_BACKEND_FRAMEWORK', 'ASP.NET')

      server.use(
        http.post(`${getApiBaseUrl()}/api/auth/logout`, () => {
          return HttpResponse.json({}, { status: 200 })
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogout(), { wrapper })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.error).toBeNull()
      
      vi.unstubAllEnvs()
    })

    it('should handle logout errors gracefully', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/logout`, () => {
          return HttpResponse.json(
            { error: 'Session already expired' }, 
            { status: 401 }
          )
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogout(), { wrapper })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual({
        general: ['Session already expired']
      })
    })

    it('should dispatch logout action to Redux store on successful logout', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/logout`, () => {
          return HttpResponse.json({}, { status: 200 })
        })
      )

      // Create store and spy on dispatch
      const store = createTestStore()
      const dispatchSpy = vi.spyOn(store, 'dispatch')
      
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false }
        }
      })

      const TestWrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </Provider>
        </BrowserRouter>
      )

      const { result } = renderHook(() => useLogout(), { wrapper: TestWrapper })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Verify that the logout action was dispatched to Redux store
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'authentication/logout'
        })
      )
    })

    it('should handle network errors during logout', async () => {
      server.use(
        http.post(`${getApiBaseUrl()}/api/logout`, () => {
          return HttpResponse.error()
        })
      )

      const wrapper = createWrapper()
      const { result } = renderHook(() => useLogout(), { wrapper })

      result.current.mutate()

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toEqual({
        general: ['Network error. Please check your connection.']
      })
    })
  })

  describe('Hook State Management', () => {
    it('should have correct initial states for all hooks', () => {
      const wrapper = createWrapper()
      
      const { result: loginResult } = renderHook(() => useLogin(), { wrapper })
      const { result: signupResult } = renderHook(() => useSignup(), { wrapper })
      const { result: logoutResult } = renderHook(() => useLogout(), { wrapper })

      // All hooks should start in idle state
      expect(loginResult.current.isIdle).toBe(true)
      expect(loginResult.current.isPending).toBe(false)
      expect(loginResult.current.isError).toBe(false)
      expect(loginResult.current.isSuccess).toBe(false)

      expect(signupResult.current.isIdle).toBe(true)
      expect(signupResult.current.isPending).toBe(false)
      expect(signupResult.current.isError).toBe(false)
      expect(signupResult.current.isSuccess).toBe(false)

      expect(logoutResult.current.isIdle).toBe(true)
      expect(logoutResult.current.isPending).toBe(false)
      expect(logoutResult.current.isError).toBe(false)
      expect(logoutResult.current.isSuccess).toBe(false)
    })
  })
})
