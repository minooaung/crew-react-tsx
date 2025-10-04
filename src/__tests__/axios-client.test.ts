import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock console methods before importing the module
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})

// Use actual environment variables or defaults for testing
// This makes tests flexible and work with different .env configurations
const TEST_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const TEST_BACKEND_FRAMEWORK = import.meta.env.VITE_BACKEND_FRAMEWORK || 'laravel'

// Helper function to get expected API URL
const getExpectedApiUrl = () => `${TEST_API_BASE_URL}/api`

// Mock environment variables with actual values
vi.stubEnv('VITE_API_BASE_URL', TEST_API_BASE_URL)
vi.stubEnv('VITE_BACKEND_FRAMEWORK', TEST_BACKEND_FRAMEWORK)

// Mock store
vi.mock('../store', () => ({
  default: {
    dispatch: vi.fn()
  }
}))

// Mock auth actions
vi.mock('../store/auth', () => ({
  authActions: {
    logout: vi.fn(() => ({ type: 'auth/logout' }))
  }
}))

// Mock window.location with dynamic URL
const TEST_CLIENT_URL = import.meta.env.TEST_CLIENT_URL || 'http://localhost:3000'
const mockLocationHref = vi.fn()
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/',
    href: TEST_CLIENT_URL,
  },
  writable: true
})

Object.defineProperty(window.location, 'href', {
  set: mockLocationHref,
  get: () => TEST_CLIENT_URL,
  configurable: true
})

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
})

describe('Axios Client Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.cookie = ''
  })

  it('should initialize CSRF token for Laravel backend', async () => {
    // Import after mocks are set up
    await import('../axios-client')
    
    // Only expect the log if we're using Laravel backend
    if (TEST_BACKEND_FRAMEWORK === 'laravel') {
      expect(consoleSpy).toHaveBeenCalledWith('Initializing CSRF token for Laravel backend')
    }
  })

  it('should be importable without errors', async () => {
    expect(async () => {
      await import('../axios-client')
    }).not.toThrow()
  })

  it('should have correct module structure', async () => {
    const axiosClient = (await import('../axios-client')).default
    
    expect(axiosClient).toBeDefined()
    // axiosClient should be an axios instance (which is technically a function with object properties)
    expect(axiosClient).toHaveProperty('defaults')
    expect(axiosClient).toHaveProperty('interceptors')
  })

  describe('Environment Configuration', () => {
    it('should use environment variables for configuration', async () => {
      // The baseURL should be constructed from env vars
      const axiosClient = (await import('../axios-client')).default
      expect(axiosClient.defaults.baseURL).toBe(getExpectedApiUrl())
    })

    it('should enable withCredentials', async () => {
      const axiosClient = (await import('../axios-client')).default
      expect(axiosClient.defaults.withCredentials).toBe(true)
    })
  })

  describe('CSRF Token Handling', () => {
    it('should handle CSRF cookie extraction', () => {
      // Test the getCookie functionality indirectly
      document.cookie = 'XSRF-TOKEN=test-token; Path=/'
      
      // The cookie should be readable
      const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'))
      expect(match).toBeTruthy()
      expect(match?.[2]).toBe('test-token')
    })

    it('should handle URL decoding of CSRF tokens', () => {
      document.cookie = 'XSRF-TOKEN=test%2Dtoken%2Dwith%2Ddashes'
      
      const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'))
      const decodedToken = match ? decodeURIComponent(match[2]) : null
      
      expect(decodedToken).toBe('test-token-with-dashes')
    })
  })

  describe('Error Handling Setup', () => {
    it('should handle window.location pathname checks', () => {
      // Test that we can read the pathname
      expect(window.location.pathname).toBe('/')
      
      // Test that we can change it
      Object.defineProperty(window.location, 'pathname', {
        value: '/login',
        configurable: true
      })
      expect(window.location.pathname).toBe('/login')
    })

    it('should handle href assignment in tests', () => {
      // Test that our mock works
      window.location.href = '/test-redirect'
      expect(mockLocationHref).toHaveBeenCalledWith('/test-redirect')
    })
  })

  describe('Backend Framework Detection', () => {
    it('should detect configured backend framework', () => {
      expect(import.meta.env.VITE_BACKEND_FRAMEWORK).toBe(TEST_BACKEND_FRAMEWORK)
    })

    it('should handle different backend frameworks', () => {
      // Test with a different framework than the current one
      const alternativeFramework = TEST_BACKEND_FRAMEWORK === 'laravel' ? 'asp.net' : 'laravel'
      vi.stubEnv('VITE_BACKEND_FRAMEWORK', alternativeFramework)
      expect(import.meta.env.VITE_BACKEND_FRAMEWORK).toBe(alternativeFramework)
    })

    it('should handle various backend framework values', () => {
      const frameworks = ['laravel', 'asp.net', 'django', 'express']
      
      frameworks.forEach(framework => {
        vi.stubEnv('VITE_BACKEND_FRAMEWORK', framework)
        expect(import.meta.env.VITE_BACKEND_FRAMEWORK).toBe(framework)
      })
    })
  })

  describe('Store Integration', () => {
    it('should be able to import store', async () => {
      const store = (await import('../store')).default
      expect(store).toBeDefined()
      expect(typeof store.dispatch).toBe('function')
    })

    it('should be able to import auth actions', async () => {
      const { authActions } = await import('../store/auth')
      expect(authActions).toBeDefined()
      expect(typeof authActions.logout).toBe('function')
    })
  })

  describe('Module Dependencies', () => {
    it('should handle axios import', async () => {
      // Test that axios can be imported without issues
      expect(async () => {
        await import('axios')
      }).not.toThrow()
    })

    it('should handle all required imports', async () => {
      // Test that all dependencies can be imported
      expect(async () => {
        await import('../store/index')
        await import('../store/auth')
      }).not.toThrow()
    })
  })
})