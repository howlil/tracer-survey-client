import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/authSlice'
import surveyReducer from './slices/surveySlice'

// Auth persist config (separate from user data)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated', 'surveyAccess'], // Only persist essential auth data
}

// Survey persist config (will be created dynamically based on user)
const createSurveyPersistConfig = (userId: string) => ({
  key: `survey-${userId}`,
  storage,
  whitelist: ['answers', 'otherValues', 'currentQuestionIndex', 'isCompleted'], // Persist survey progress
})

// Root persist config
export const createPersistConfig = (userId?: string) => {
  const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    survey: userId 
      ? persistReducer(createSurveyPersistConfig(userId), surveyReducer)
      : surveyReducer,
  })

  return {
    rootReducer,
    authPersistConfig,
    surveyPersistConfig: userId ? createSurveyPersistConfig(userId) : null,
  }
}

// Helper function to clear user-specific data
export const clearUserData = (userId: string) => {
  const userKey = `tracer-survey-${userId}`
  const surveyKey = `survey-${userId}`
  
  // Clear from localStorage
  localStorage.removeItem(`persist:${userKey}`)
  localStorage.removeItem(`persist:${surveyKey}`)
}

// Helper function to get all user keys from localStorage
export const getAllUserKeys = () => {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('persist:tracer-survey-') || key?.startsWith('persist:survey-')) {
      keys.push(key)
    }
  }
  return keys
}
