// Utility functions for user-based storage management
import { decryptSurveyData, encryptSurveyData } from '@/utils/encryption'

export const USER_STORAGE_PREFIX = 'tracer-survey-user-'

/**
 * Generate a unique storage key for a user
 */
export const getUserStorageKey = (userId: string): string => {
  return `${USER_STORAGE_PREFIX}${userId}`
}

/**
 * Save survey data for a specific user (encrypted)
 */
export const saveUserSurveyData = (userId: string, surveyData: any) => {
  const key = getUserStorageKey(userId)
  try {
    const dataToSave = {
      ...surveyData,
      lastUpdated: Date.now(),
      userId // Ensure userId is always included
    }
    
    // Encrypt the data before saving
    const encryptedData = encryptSurveyData(dataToSave)
    
    localStorage.setItem(key, encryptedData)
  } catch (error) {
    console.error('Failed to save user survey data:', error)
  }
}

/**
 * Load survey data for a specific user (decrypted)
 */
export const loadUserSurveyData = (userId: string) => {
  const key = getUserStorageKey(userId)
  try {
    const encryptedData = localStorage.getItem(key)
    
    if (encryptedData) {
      // Try to decrypt the data
      const decryptedData = decryptSurveyData(encryptedData)
      
      if (decryptedData) {
        // Verify the data belongs to the current user
        if (decryptedData.userId === userId) {
          return decryptedData
        }
      } else {
        // Fallback: try to parse as JSON (for backward compatibility)
        try {
          const parsed = JSON.parse(encryptedData)
          if (parsed.userId === userId) {
            return parsed
          }
        } catch (fallbackError) {
          // Silent fallback error
        }
      }
    }
  } catch (error) {
    // Silent error handling
  }
  return null
}

/**
 * Clear survey data for a specific user
 */
export const clearUserSurveyData = (userId: string) => {
  const key = getUserStorageKey(userId)
  try {
    localStorage.removeItem(key)
  } catch (error) {
    // Silent error handling
  }
}

/**
 * Get all user IDs that have stored data
 */
export const getAllUserIds = (): string[] => {
  const userIds: string[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(USER_STORAGE_PREFIX)) {
        const userId = key.replace(USER_STORAGE_PREFIX, '')
        userIds.push(userId)
      }
    }
  } catch (error) {
    // Silent error handling
  }
  return userIds
}

/**
 * Clear all user data (for cleanup)
 */
export const clearAllUserData = () => {
  try {
    const userIds = getAllUserIds()
    userIds.forEach(userId => {
      clearUserSurveyData(userId)
    })
  } catch (error) {
    // Silent error handling
  }
}

/**
 * Get storage usage info
 */
export const getStorageInfo = () => {
  const userIds = getAllUserIds()
  const totalSize = userIds.reduce((size, userId) => {
    const key = getUserStorageKey(userId)
    const data = localStorage.getItem(key)
    return size + (data ? data.length : 0)
  }, 0)

  return {
    userCount: userIds.length,
    totalSize,
    userIds
  }
}

/**
 * Clean up old data with timestamp-based user IDs
 */
export const cleanupOldUserData = () => {
  try {
    const allKeys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(USER_STORAGE_PREFIX)) {
        allKeys.push(key)
      }
    }

    allKeys.forEach(key => {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          // If userId contains timestamp (old format), remove it
          if (parsed.userId && parsed.userId.includes('_') && parsed.userId.split('_').length > 2) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // Silent error handling
        }
      }
    })
  } catch (error) {
    // Silent error handling
  }
}
