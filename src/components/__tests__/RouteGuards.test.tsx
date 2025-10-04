import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ProtectedRoute, PublicOnlyRoute } from '../RouteGuards'
import authReducer from '../../store/auth'
import { User } from '../../types'

// Mock Navigate component to track navigation calls
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to, state, replace }: { to: string; state?: any; replace?: boolean }) => {
      mockNavigate({ to, state, replace })
      return <div data-testid="navigate">Navigate to: {to}</div>
    }
  }
})

// Test components
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>
const PublicComponent = () => <div data-testid="public-content">Public Content</div>

// Helper to create store with auth state
const createStoreWithAuth = (user: User | null) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: { user }
    }
  })
}

// Mock user data
const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'ADMIN',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

describe('Route Guards', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('ProtectedRoute', () => {
    it('should render children when user is authenticated', () => {
      const store = createStoreWithAuth(mockUser)

      render(
        <Provider store={store}>
          <BrowserRouter>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </BrowserRouter>
        </Provider>
      )

      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should redirect to login when user is not authenticated', () => {
      const store = createStoreWithAuth(null)

      render(
        <Provider store={store}>
          <BrowserRouter>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </BrowserRouter>
        </Provider>
      )

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      expect(screen.getByTestId('navigate')).toBeInTheDocument()
      expect(screen.getByText('Navigate to: /login')).toBeInTheDocument()
      
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/login',
        state: { from: expect.objectContaining({ pathname: '/' }) },
        replace: true
      })
    })

    it('should preserve the attempted location when redirecting to login', () => {
      const store = createStoreWithAuth(null)

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/dashboard']}>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </MemoryRouter>
        </Provider>
      )

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/login',
        state: { from: expect.objectContaining({ pathname: '/dashboard' }) },
        replace: true
      })
    })

    it('should work with nested routes', () => {
      const store = createStoreWithAuth(mockUser)

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/users/123']}>
            <ProtectedRoute>
              <div data-testid="nested-content">User Profile: 123</div>
            </ProtectedRoute>
          </MemoryRouter>
        </Provider>
      )

      expect(screen.getByTestId('nested-content')).toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle user state changes correctly', () => {
      const store = createStoreWithAuth(null)

      const { rerender } = render(
        <Provider store={store}>
          <BrowserRouter>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </BrowserRouter>
        </Provider>
      )

      // Initially should redirect
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith(expect.objectContaining({
        to: '/login'
      }))

      // Clear mock and update store with authenticated user
      mockNavigate.mockClear()
      const authenticatedStore = createStoreWithAuth(mockUser)

      rerender(
        <Provider store={authenticatedStore}>
          <BrowserRouter>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </BrowserRouter>
        </Provider>
      )

      // Now should render content
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('PublicOnlyRoute', () => {
    it('should render children when user is not authenticated', () => {
      const store = createStoreWithAuth(null)

      render(
        <Provider store={store}>
          <BrowserRouter>
            <PublicOnlyRoute>
              <PublicComponent />
            </PublicOnlyRoute>
          </BrowserRouter>
        </Provider>
      )

      expect(screen.getByTestId('public-content')).toBeInTheDocument()
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should redirect to dashboard when user is authenticated', () => {
      const store = createStoreWithAuth(mockUser)

      render(
        <Provider store={store}>
          <BrowserRouter>
            <PublicOnlyRoute>
              <PublicComponent />
            </PublicOnlyRoute>
          </BrowserRouter>
        </Provider>
      )

      expect(screen.queryByTestId('public-content')).not.toBeInTheDocument()
      expect(screen.getByTestId('navigate')).toBeInTheDocument()
      expect(screen.getByText('Navigate to: /dashboard')).toBeInTheDocument()
      
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/dashboard',
        replace: true
      })
    })

    it('should redirect to intended destination when available in location state', () => {
      const store = createStoreWithAuth(mockUser)

      render(
        <Provider store={store}>
          <MemoryRouter 
            initialEntries={[{
              pathname: '/login',
              state: { from: { pathname: '/users' } }
            }]}
          >
            <PublicOnlyRoute>
              <PublicComponent />
            </PublicOnlyRoute>
          </MemoryRouter>
        </Provider>
      )

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/users',
        replace: true
      })
    })

    it('should handle complex intended destinations', () => {
      const store = createStoreWithAuth(mockUser)

      render(
        <Provider store={store}>
          <MemoryRouter 
            initialEntries={[{
              pathname: '/login',
              state: { from: { pathname: '/organisations/123/edit' } }
            }]}
          >
            <PublicOnlyRoute>
              <PublicComponent />
            </PublicOnlyRoute>
          </MemoryRouter>
        </Provider>
      )

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/organisations/123/edit',
        replace: true
      })
    })

    it('should default to dashboard when location state is malformed', () => {
      const store = createStoreWithAuth(mockUser)

      render(
        <Provider store={store}>
          <MemoryRouter 
            initialEntries={[{
              pathname: '/login',
              state: { from: null } // Malformed state
            }]}
          >
            <PublicOnlyRoute>
              <PublicComponent />
            </PublicOnlyRoute>
          </MemoryRouter>
        </Provider>
      )

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/dashboard',
        replace: true
      })
    })

    it('should work with different user roles', () => {
      const employeeUser: User = {
        ...mockUser,
        id: 2,
        role: 'EMPLOYEE'
      }
      const store = createStoreWithAuth(employeeUser)

      render(
        <Provider store={store}>
          <BrowserRouter>
            <PublicOnlyRoute>
              <PublicComponent />
            </PublicOnlyRoute>
          </BrowserRouter>
        </Provider>
      )

      expect(screen.queryByTestId('public-content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/dashboard',
        replace: true
      })
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle authentication flow correctly', () => {
      // Start with unauthenticated user trying to access protected route
      const store = createStoreWithAuth(null)

      const { rerender } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/dashboard']}>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </MemoryRouter>
        </Provider>
      )

      // Should redirect to login with intended destination
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/login',
        state: { from: expect.objectContaining({ pathname: '/dashboard' }) },
        replace: true
      })

      mockNavigate.mockClear()

      // Now simulate being on login page with authenticated user
      const authenticatedStore = createStoreWithAuth(mockUser)

      rerender(
        <Provider store={authenticatedStore}>
          <MemoryRouter 
            initialEntries={[{
              pathname: '/login',
              state: { from: { pathname: '/dashboard' } }
            }]}
          >
            <PublicOnlyRoute>
              <PublicComponent />
            </PublicOnlyRoute>
          </MemoryRouter>
        </Provider>
      )

      // Should redirect back to intended destination
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/dashboard',
        replace: true
      })
    })

    it('should handle edge case with empty location state', () => {
      const store = createStoreWithAuth(mockUser)

      render(
        <Provider store={store}>
          <MemoryRouter 
            initialEntries={[{
              pathname: '/signup',
              state: {} // Empty state
            }]}
          >
            <PublicOnlyRoute>
              <PublicComponent />
            </PublicOnlyRoute>
          </MemoryRouter>
        </Provider>
      )

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/dashboard',
        replace: true
      })
    })

    it('should work with complex nested component structures', () => {
      const store = createStoreWithAuth(mockUser)

      const ComplexComponent = () => (
        <div>
          <header>Header</header>
          <main data-testid="complex-content">
            <h1>Dashboard</h1>
            <p>Welcome back!</p>
          </main>
          <footer>Footer</footer>
        </div>
      )

      render(
        <Provider store={store}>
          <BrowserRouter>
            <ProtectedRoute>
              <ComplexComponent />
            </ProtectedRoute>
          </BrowserRouter>
        </Provider>
      )

      expect(screen.getByTestId('complex-content')).toBeInTheDocument()
      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle missing Redux state gracefully', () => {
      // Create store without auth state
      const emptyStore = configureStore({
        reducer: {
          auth: authReducer
        }
        // No preloadedState - will use initial state
      })

      render(
        <Provider store={emptyStore}>
          <BrowserRouter>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </BrowserRouter>
        </Provider>
      )

      // Should redirect to login since initial state has user: null
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith(expect.objectContaining({
        to: '/login'
      }))
    })

    it('should handle malformed user data', () => {
      // Create store with malformed user data
      const malformedStore = configureStore({
        reducer: {
          auth: authReducer
        },
        preloadedState: {
          auth: { user: {} as User } // Empty object instead of proper user
        }
      })

      render(
        <Provider store={malformedStore}>
          <BrowserRouter>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </BrowserRouter>
        </Provider>
      )

      // Should still render content since user object exists (truthy)
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})
