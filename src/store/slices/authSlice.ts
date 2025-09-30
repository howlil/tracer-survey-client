import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { validatePINAndGetUser } from '@/data/pinDatabase'

// Auth State Interface
export interface AuthState {
  // User Info
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
  } | null
  
  // Auth Status
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Login State
  loginData: {
    username: string
    password: string
  }
  
  // Survey Access
  surveyAccess: {
    tracerStudy: boolean
    userSurvey: boolean
  }
}

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginData: {
    username: '',
    password: '',
  },
  surveyAccess: {
    tracerStudy: false,
    userSurvey: false,
  },
}

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string; surveyType?: 'tracer-study' | 'user-survey' }) => {
    // TODO: Replace with actual API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }
    
    return response.json()
  }
)

export const loginWithPIN = createAsyncThunk(
  'auth/loginWithPIN',
  async (data: { pin: string; captcha: string; surveyType: 'tracer-study' | 'user-survey' }) => {
    // Validasi PIN dengan survey type yang sesuai
    const userRecord = validatePINAndGetUser(data.pin, data.surveyType)
    
    if (!userRecord) {
      throw new Error('PIN tidak valid untuk survey ini')
    }
    
    // Return user data dengan survey access yang sesuai
    return {
      user: {
        id: userRecord.userID,
        name: userRecord.name,
        email: userRecord.email,
        role: 'user' as const
      },
      surveyAccess: {
        tracerStudy: data.surveyType === 'tracer-study',
        userSurvey: data.surveyType === 'user-survey'
      }
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // TODO: Replace with actual API call
    await fetch('/api/auth/logout', {
      method: 'POST',
    })
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    // TODO: Replace with actual API call
    const response = await fetch('/api/auth/me')
    
    if (!response.ok) {
      throw new Error('Not authenticated')
    }
    
    return response.json()
  }
)

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login Form Management
    setLoginData: (state, action: PayloadAction<{ username: string; password: string }>) => {
      state.loginData = action.payload
    },

    setUsername: (state, action: PayloadAction<string>) => {
      state.loginData.username = action.payload
    },

    setPassword: (state, action: PayloadAction<string>) => {
      state.loginData.password = action.payload
    },

    // Error Management
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = null
    },

    // Survey Access
    setSurveyAccess: (state, action: PayloadAction<{ tracerStudy: boolean; userSurvey: boolean }>) => {
      state.surveyAccess = action.payload
    },

    // Manual Login (for demo purposes)
    setUser: (state, action: PayloadAction<{ id: string; name: string; email: string; role: 'admin' | 'user' }>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },

    // Manual Logout
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.surveyAccess = {
        tracerStudy: false,
        userSurvey: false,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.surveyAccess = action.payload.surveyAccess || {
          tracerStudy: false,
          userSurvey: false,
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
        state.isAuthenticated = false
      })
      
      // PIN Login
      .addCase(loginWithPIN.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithPIN.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.surveyAccess = action.payload.surveyAccess || {
          tracerStudy: false,
          userSurvey: false,
        }
      })
      .addCase(loginWithPIN.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'PIN login failed'
        state.isAuthenticated = false
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.surveyAccess = {
          tracerStudy: false,
          userSurvey: false,
        }
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Logout failed'
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        state.surveyAccess = action.payload.surveyAccess || {
          tracerStudy: false,
          userSurvey: false,
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.surveyAccess = {
          tracerStudy: false,
          userSurvey: false,
        }
      })
  },
})

// Export Actions
export const {
  setLoginData,
  setUsername,
  setPassword,
  setError,
  clearError,
  setSurveyAccess,
  setUser,
  clearUser,
} = authSlice.actions

// Export Reducer
export default authSlice.reducer

// Selectors
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectIsLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error
export const selectLoginData = (state: RootState) => state.auth.loginData
export const selectSurveyAccess = (state: RootState) => state.auth.surveyAccess
