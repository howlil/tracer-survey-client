import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import surveyReducer from './slices/surveySlice'

export const store = configureStore({
  reducer: {
    survey: surveyReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
