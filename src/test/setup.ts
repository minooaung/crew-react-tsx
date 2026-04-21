import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock environment variables for tests
// Use actual env vars if available, otherwise use defaults
const testEnv = {
  VITE_BACKEND_FRAMEWORK: import.meta.env?.VITE_BACKEND_FRAMEWORK || 'laravel',
  VITE_API_BASE_URL: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000'
}

Object.defineProperty(import.meta, 'env', {
  value: testEnv,
  writable: true
})

// Mock window.location.href setter to prevent navigation errors in tests
// Keep other location properties intact for MSW to work properly
const originalLocation = window.location
const mockLocationHref = vi.fn()

Object.defineProperty(window, 'location', {
  value: {
    ...originalLocation,
    href: originalLocation.href,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true
})

// Override the href setter specifically
Object.defineProperty(window.location, 'href', {
  set: mockLocationHref,
  get: () => originalLocation.href,
  configurable: true
})

// Mock console.warn to suppress React Router future flag warnings
const originalConsoleWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes?.('React Router Future Flag Warning')) {
    return // Suppress React Router warnings
  }
  originalConsoleWarn(...args)
}
