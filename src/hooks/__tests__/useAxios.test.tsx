import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { useAxios } from '../useAxios'
import authReducer from '../../store/auth'
import * as apiErrorHandler from '../../utils/apiErrorHandler'

// Mock dependencies
vi.mock('../../axios-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

vi.mock('../../utils/apiErrorHandler', () => ({
  handleApiError: vi.fn()
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const mockNavigate = vi.fn()
const mockAxiosClient = await import('../../axios-client')

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/',
  },
  writable: true
})

describe('useAxios Hook', () => {
  const createTestStore = () => configureStore({
    reducer: {
      auth: authReducer
    }
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const store = createTestStore()
    return (
      <BrowserRouter>
        <Provider store={store}>
          {children}
        </Provider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window.location, 'pathname', {
      value: '/',
      configurable: true
    })
  })

  describe('HTTP Methods', () => {
    it('should provide get method', () => {
      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      expect(typeof result.current.get).toBe('function')
    })

    it('should provide post method', () => {
      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      expect(typeof result.current.post).toBe('function')
    })

    it('should provide put method', () => {
      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      expect(typeof result.current.put).toBe('function')
    })

    it('should provide delete method', () => {
      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      expect(typeof result.current.delete).toBe('function')
    })
  })

  describe('Successful Requests', () => {
    it('should call axiosClient.get for get requests', async () => {
      const mockResponse = { data: { message: 'success' } }
      vi.mocked(mockAxiosClient.default.get).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      const response = await result.current.get('/test-url')
      
      expect(mockAxiosClient.default.get).toHaveBeenCalledWith('/test-url', undefined)
      expect(response).toBe(mockResponse)
    })

    it('should call axiosClient.post for post requests', async () => {
      const mockResponse = { data: { id: 1 } }
      const testData = { name: 'test' }
      vi.mocked(mockAxiosClient.default.post).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      const response = await result.current.post('/test-url', testData)
      
      expect(mockAxiosClient.default.post).toHaveBeenCalledWith('/test-url', testData, undefined)
      expect(response).toBe(mockResponse)
    })

    it('should call axiosClient.put for put requests', async () => {
      const mockResponse = { data: { updated: true } }
      const testData = { name: 'updated' }
      vi.mocked(mockAxiosClient.default.put).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      const response = await result.current.put('/test-url', testData)
      
      expect(mockAxiosClient.default.put).toHaveBeenCalledWith('/test-url', testData, undefined)
      expect(response).toBe(mockResponse)
    })

    it('should call axiosClient.delete for delete requests', async () => {
      const mockResponse = { data: { deleted: true } }
      vi.mocked(mockAxiosClient.default.delete).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      const response = await result.current.delete('/test-url')
      
      expect(mockAxiosClient.default.delete).toHaveBeenCalledWith('/test-url', undefined)
      expect(response).toBe(mockResponse)
    })
  })

  describe('Request Configuration', () => {
    it('should pass config to get requests', async () => {
      const mockResponse = { data: {} }
      const config = { headers: { 'Custom-Header': 'value' } }
      vi.mocked(mockAxiosClient.default.get).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await result.current.get('/test-url', config)
      
      expect(mockAxiosClient.default.get).toHaveBeenCalledWith('/test-url', config)
    })

    it('should pass config to post requests', async () => {
      const mockResponse = { data: {} }
      const testData = { name: 'test' }
      const config = { headers: { 'Custom-Header': 'value' } }
      vi.mocked(mockAxiosClient.default.post).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await result.current.post('/test-url', testData, config)
      
      expect(mockAxiosClient.default.post).toHaveBeenCalledWith('/test-url', testData, config)
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors using handleApiError', async () => {
      const mockError = new AxiosError('Test error')
      mockError.response = {
        status: 400,
        data: { error: 'Bad request' },
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      }

      const formattedError = { general: ['Bad request'] }
      vi.mocked(apiErrorHandler.handleApiError).mockReturnValue(formattedError)
      vi.mocked(mockAxiosClient.default.get).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await expect(result.current.get('/test-url')).rejects.toBe(formattedError)
      expect(apiErrorHandler.handleApiError).toHaveBeenCalledWith(mockError)
    })

    it('should dispatch logout and navigate on 401 error outside login page', async () => {
      Object.defineProperty(window.location, 'pathname', {
        value: '/dashboard',
        configurable: true
      })

      const mockError = new AxiosError('Unauthorized')
      mockError.response = {
        status: 401,
        data: { error: 'Unauthorized' },
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any
      }

      const formattedError = { general: ['Unauthorized'] }
      vi.mocked(apiErrorHandler.handleApiError).mockReturnValue(formattedError)
      vi.mocked(mockAxiosClient.default.get).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await expect(result.current.get('/test-url')).rejects.toBe(formattedError)
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('should not dispatch logout on 401 error on login page', async () => {
      Object.defineProperty(window.location, 'pathname', {
        value: '/login',
        configurable: true
      })

      const mockError = new AxiosError('Unauthorized')
      mockError.response = {
        status: 401,
        data: { error: 'Invalid credentials' },
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any
      }

      const formattedError = { general: ['Invalid credentials'] }
      vi.mocked(apiErrorHandler.handleApiError).mockReturnValue(formattedError)
      vi.mocked(mockAxiosClient.default.get).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await expect(result.current.get('/test-url')).rejects.toBe(formattedError)
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle non-401 errors without logout', async () => {
      const mockError = new AxiosError('Server Error')
      mockError.response = {
        status: 500,
        data: { error: 'Internal Server Error' },
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any
      }

      const formattedError = { general: ['Server error'] }
      vi.mocked(apiErrorHandler.handleApiError).mockReturnValue(formattedError)
      vi.mocked(mockAxiosClient.default.post).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await expect(result.current.post('/test-url', {})).rejects.toBe(formattedError)
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle errors without response', async () => {
      const mockError = new AxiosError('Network Error')
      // No response property

      const formattedError = { general: ['Network error'] }
      vi.mocked(apiErrorHandler.handleApiError).mockReturnValue(formattedError)
      vi.mocked(mockAxiosClient.default.put).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await expect(result.current.put('/test-url', {})).rejects.toBe(formattedError)
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Type Safety', () => {
    it('should handle typed responses for get requests', async () => {
      interface TestResponse {
        id: number
        name: string
      }

      const mockResponse = { data: { id: 1, name: 'test' } }
      vi.mocked(mockAxiosClient.default.get).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      const response = await result.current.get<TestResponse>('/test-url')
      
      expect(response.data.id).toBe(1)
      expect(response.data.name).toBe('test')
    })

    it('should handle typed request data for post requests', async () => {
      interface TestData {
        name: string
        email: string
      }

      const mockResponse = { data: { success: true } }
      const testData: TestData = { name: 'John', email: 'john@example.com' }
      vi.mocked(mockAxiosClient.default.post).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await result.current.post<any, TestData>('/test-url', testData)
      
      expect(mockAxiosClient.default.post).toHaveBeenCalledWith('/test-url', testData, undefined)
    })
  })

  describe('All HTTP Methods Error Handling', () => {
    it('should handle errors in put requests', async () => {
      const mockError = new AxiosError('Put Error')
      mockError.response = {
        status: 422,
        data: { error: 'Validation failed' },
        statusText: 'Unprocessable Entity',
        headers: {},
        config: {} as any
      }

      const formattedError = { general: ['Validation failed'] }
      vi.mocked(apiErrorHandler.handleApiError).mockReturnValue(formattedError)
      vi.mocked(mockAxiosClient.default.put).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await expect(result.current.put('/test-url', {})).rejects.toBe(formattedError)
    })

    it('should handle errors in delete requests', async () => {
      const mockError = new AxiosError('Delete Error')
      mockError.response = {
        status: 404,
        data: { error: 'Not found' },
        statusText: 'Not Found',
        headers: {},
        config: {} as any
      }

      const formattedError = { general: ['Not found'] }
      vi.mocked(apiErrorHandler.handleApiError).mockReturnValue(formattedError)
      vi.mocked(mockAxiosClient.default.delete).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAxios(), { wrapper: TestWrapper })
      
      await expect(result.current.delete('/test-url')).rejects.toBe(formattedError)
    })
  })
})
