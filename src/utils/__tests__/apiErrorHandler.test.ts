import { describe, it, expect, vi, afterEach } from 'vitest'
import { AxiosError } from 'axios'
import { handleApiError } from '../apiErrorHandler'

// Define the types to match the apiErrorHandler expectations
interface ApiErrorResponse {
  error?: string;
  details?: Record<string, string[]>;
}

// Mock console.error to avoid noise in test output
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('apiErrorHandler', () => {
  afterEach(() => {
    consoleSpy.mockClear()
  })

  it('should handle network errors when no response is available', () => {
    const networkError = new AxiosError<ApiErrorResponse>('Network Error')
    networkError.response = undefined

    const result = handleApiError(networkError)

    expect(result).toEqual({
      general: ['Network error. Please check your connection.']
    })
  })

  it('should handle 401 unauthorized with invalid credentials', () => {
    const error = new AxiosError<ApiErrorResponse>('Unauthorized')
    error.response = {
      status: 401,
      data: { error: 'Invalid credentials' },
      statusText: 'Unauthorized',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Invalid credentials']
    })
  })

  it('should handle 401 session expired', () => {
    const error = new AxiosError<ApiErrorResponse>('Unauthorized')
    error.response = {
      status: 401,
      data: { error: 'Session expired. Please log in again.' },
      statusText: 'Unauthorized',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Session expired. Please log in again.']
    })
  })

  it('should handle 419 CSRF token expiration', () => {
    const error = new AxiosError<ApiErrorResponse>('CSRF Token Expired')
    error.response = {
      status: 419,
      data: { error: 'CSRF token mismatch' },
      statusText: 'CSRF Token Expired',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['CSRF token mismatch']
    })
  })

  it('should handle 403 forbidden with unauthorized action', () => {
    const error = new AxiosError<ApiErrorResponse>('Forbidden')
    error.response = {
      status: 403,
      data: { error: 'Unauthorized action' },
      statusText: 'Forbidden',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Unauthorized Action. You do not have permission to perform this request.']
    })
  })

  it('should handle 403 forbidden with generic access denied', () => {
    const error = new AxiosError<ApiErrorResponse>('Forbidden')
    error.response = {
      status: 403,
      data: { error: 'Access denied' },
      statusText: 'Forbidden',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Access denied']
    })
  })

  it('should handle 404 not found', () => {
    const error = new AxiosError<ApiErrorResponse>('Not Found')
    error.response = {
      status: 404,
      data: {},
      statusText: 'Not Found',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Resource not found.']
    })
  })

  it('should handle 422 validation errors with details', () => {
    const error = new AxiosError<ApiErrorResponse>('Validation Error')
    error.response = {
      status: 422,
      data: {
        details: {
          email: ['The email field is required.'],
          password: ['The password must be at least 8 characters.']
        }
      },
      statusText: 'Unprocessable Entity',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      email: ['The email field is required.'],
      password: ['The password must be at least 8 characters.']
    })
  })

  it('should handle 422 validation errors without details', () => {
    const error = new AxiosError<ApiErrorResponse>('Validation Error')
    error.response = {
      status: 422,
      data: {},
      statusText: 'Unprocessable Entity',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Invalid input.']
    })
  })

  it('should handle 500 server errors and log them', () => {
    const error = new AxiosError<ApiErrorResponse>('Internal Server Error')
    error.response = {
      status: 500,
      data: { error: 'Database connection failed' },
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Something went wrong. Please try again later.']
    })
    expect(consoleSpy).toHaveBeenCalledWith('Server error:', 'Database connection failed')
  })

  it('should handle unexpected status codes', () => {
    const error = new AxiosError<ApiErrorResponse>('Unknown Error')
    error.response = {
      status: 418, // I'm a teapot
      data: { error: 'Unexpected error' },
      statusText: 'Unknown',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Unexpected error occurred.']
    })
    expect(consoleSpy).toHaveBeenCalledWith('Unexpected error:', { error: 'Unexpected error' })
  })

  it('should handle errors without error message in data', () => {
    const error = new AxiosError<ApiErrorResponse>('Unauthorized')
    error.response = {
      status: 401,
      data: {},
      statusText: 'Unauthorized',
      headers: {},
      config: {} as any
    }

    const result = handleApiError(error)

    expect(result).toEqual({
      general: ['Unauthorized: Invalid credentials.']
    })
  })
})
