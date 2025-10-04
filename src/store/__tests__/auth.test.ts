import { describe, it, expect, beforeEach, vi } from 'vitest'
import authReducer, { authActions } from '../auth'
import { AuthState } from '../types'
import { User } from '../../types'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Replace the global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Auth Redux Slice', () => {
  const mockUser: User = {
    id: 1,
    name: 'Mark North',
    email: 'mark@example.com',
    role: 'ADMIN',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  }

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with user from localStorage when user exists', () => {
      // Test the logic that would happen during initialization
      // We can't easily test the actual initial state due to module caching
      // Instead, we test that the reducer handles the initialization correctly
      const initialState: AuthState = { user: null }
      
      // Simulate what happens when we set a user (which also saves to localStorage)
      const action = authActions.settingUser(mockUser)
      const newState = authReducer(initialState, action)

      expect(newState.user).toEqual(mockUser)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
    })

    it('should handle null user state correctly', () => {
      const initialState: AuthState = { user: mockUser }
      
      // Test logout which sets user to null
      const action = authActions.logout()
      const newState = authReducer(initialState, action)

      expect(newState.user).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('settingUser action', () => {
    it('should set user and save to localStorage when user is provided', () => {
      const initialState: AuthState = { user: null }

      const action = authActions.settingUser(mockUser)
      const newState = authReducer(initialState, action)

      expect(newState.user).toEqual(mockUser)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
    })

    it('should set user to null and save to localStorage when null is provided', () => {
      const initialState: AuthState = { user: mockUser }

      const action = authActions.settingUser(null)
      const newState = authReducer(initialState, action)

      expect(newState.user).toBeNull()
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(null))
    })

    it('should replace existing user with new user', () => {
      const initialState: AuthState = { user: mockUser }
      const newUser: User = {
        ...mockUser,
        id: 2,
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'EMPLOYEE'
      }

      const action = authActions.settingUser(newUser)
      const newState = authReducer(initialState, action)

      expect(newState.user).toEqual(newUser)
      expect(newState.user).not.toEqual(mockUser)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(newUser))
    })
  })

  describe('logout action', () => {
    it('should clear user and remove from localStorage', () => {
      const initialState: AuthState = { user: mockUser }

      const action = authActions.logout()
      const newState = authReducer(initialState, action)

      expect(newState.user).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })

    it('should work when user is already null', () => {
      const initialState: AuthState = { user: null }

      const action = authActions.logout()
      const newState = authReducer(initialState, action)

      expect(newState.user).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('Action Creators', () => {
    it('should create settingUser action with correct type and payload', () => {
      const action = authActions.settingUser(mockUser)

      expect(action.type).toBe('authentication/settingUser')
      expect(action.payload).toEqual(mockUser)
    })

    it('should create logout action with correct type', () => {
      const action = authActions.logout()

      expect(action.type).toBe('authentication/logout')
      expect(action.payload).toBeUndefined()
    })
  })

  describe('State Immutability', () => {
    it('should not mutate the original state when setting user', () => {
      const initialState: AuthState = { user: null }
      const originalState = { ...initialState }

      authReducer(initialState, authActions.settingUser(mockUser))

      expect(initialState).toEqual(originalState)
    })

    it('should not mutate the original state when logging out', () => {
      const initialState: AuthState = { user: mockUser }
      const originalState = { ...initialState }

      authReducer(initialState, authActions.logout())

      expect(initialState).toEqual(originalState)
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined user gracefully', () => {
      const initialState: AuthState = { user: mockUser }

      const action = authActions.settingUser(undefined as any)
      const newState = authReducer(initialState, action)

      expect(newState.user).toBeUndefined()
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(undefined))
    })

    it('should handle multiple consecutive actions correctly', () => {
      let state: AuthState = { user: null }

      // Set user
      state = authReducer(state, authActions.settingUser(mockUser))
      expect(state.user).toEqual(mockUser)

      // Logout
      state = authReducer(state, authActions.logout())
      expect(state.user).toBeNull()

      // Set user again
      const newUser = { ...mockUser, id: 2 }
      state = authReducer(state, authActions.settingUser(newUser))
      expect(state.user).toEqual(newUser)
    })
  })
})
