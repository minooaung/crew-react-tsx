import { describe, it, expect } from 'vitest'
import notificationReducer, { notiActions } from '../notification'
import { NotificationState } from '../types'

describe('Notification Redux Slice', () => {
  const initialState: NotificationState = {
    notificationMessage: null
  }

  describe('Initial State', () => {
    it('should return the initial state', () => {
      const result = notificationReducer(undefined, { type: 'unknown' })
      expect(result).toEqual(initialState)
    })

    it('should have null notification message initially', () => {
      const result = notificationReducer(undefined, { type: 'unknown' })
      expect(result.notificationMessage).toBeNull()
    })
  })

  describe('settingNotiMessage Action', () => {
    it('should set notification message when string is provided', () => {
      const message = 'User successfully logged in!'
      const action = notiActions.settingNotiMessage(message)
      const result = notificationReducer(initialState, action)

      expect(result.notificationMessage).toBe(message)
    })

    it('should set notification message to null when null is provided', () => {
      const stateWithMessage: NotificationState = {
        notificationMessage: 'Previous message'
      }
      
      const action = notiActions.settingNotiMessage(null)
      const result = notificationReducer(stateWithMessage, action)

      expect(result.notificationMessage).toBeNull()
    })

    it('should clear notification message when null is provided', () => {
      const stateWithMessage: NotificationState = {
        notificationMessage: 'Error: Something went wrong'
      }
      
      const action = notiActions.settingNotiMessage(null)
      const result = notificationReducer(stateWithMessage, action)

      expect(result.notificationMessage).toBeNull()
    })

    it('should handle empty string notification', () => {
      const action = notiActions.settingNotiMessage('')
      const result = notificationReducer(initialState, action)

      expect(result.notificationMessage).toBe('')
    })

    it('should handle long notification messages', () => {
      const longMessage = 'This is a very long notification message that might be used for detailed error descriptions or success confirmations in the application'
      const action = notiActions.settingNotiMessage(longMessage)
      const result = notificationReducer(initialState, action)

      expect(result.notificationMessage).toBe(longMessage)
    })
  })

  describe('Action Creators', () => {
    it('should create settingNotiMessage action with string payload', () => {
      const message = 'Test notification'
      const expectedAction = {
        type: 'notification/settingNotiMessage',
        payload: message
      }

      expect(notiActions.settingNotiMessage(message)).toEqual(expectedAction)
    })

    it('should create settingNotiMessage action with null payload', () => {
      const expectedAction = {
        type: 'notification/settingNotiMessage',
        payload: null
      }

      expect(notiActions.settingNotiMessage(null)).toEqual(expectedAction)
    })
  })

  describe('State Immutability', () => {
    it('should not mutate the original state', () => {
      const originalState: NotificationState = {
        notificationMessage: 'Original message'
      }
      const stateCopy = { ...originalState }
      
      const action = notiActions.settingNotiMessage('New message')
      const result = notificationReducer(originalState, action)

      // Original state should remain unchanged
      expect(originalState).toEqual(stateCopy)
      // Result should be different from original
      expect(result).not.toBe(originalState)
      expect(result.notificationMessage).toBe('New message')
    })

    it('should return new state object on each action', () => {
      const action1 = notiActions.settingNotiMessage('Message 1')
      const result1 = notificationReducer(initialState, action1)
      
      const action2 = notiActions.settingNotiMessage('Message 2')
      const result2 = notificationReducer(result1, action2)

      expect(result1).not.toBe(result2)
      expect(result1.notificationMessage).toBe('Message 1')
      expect(result2.notificationMessage).toBe('Message 2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple consecutive null assignments', () => {
      let currentState = initialState
      
      // Set a message first
      currentState = notificationReducer(currentState, notiActions.settingNotiMessage('Test'))
      expect(currentState.notificationMessage).toBe('Test')
      
      // Clear it multiple times
      currentState = notificationReducer(currentState, notiActions.settingNotiMessage(null))
      expect(currentState.notificationMessage).toBeNull()
      
      currentState = notificationReducer(currentState, notiActions.settingNotiMessage(null))
      expect(currentState.notificationMessage).toBeNull()
    })

    it('should handle special characters in notification messages', () => {
      const specialMessage = '🎉 Success! User @john_doe has been created with 100% completion! 🚀'
      const action = notiActions.settingNotiMessage(specialMessage)
      const result = notificationReducer(initialState, action)

      expect(result.notificationMessage).toBe(specialMessage)
    })
  })
})
