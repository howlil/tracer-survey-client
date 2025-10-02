import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/authSlice'
import builderReducer from './slices/builderSlice'
import surveyReducer from './slices/surveySlice'

// Auth persist config
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated', 'surveyAccess'],
}

// Survey persist config (will be updated when user logs in)
const surveyPersistConfig = {
  key: 'survey',
  storage,
  whitelist: ['answers', 'otherValues', 'currentQuestionIndex', 'isCompleted'],
}

// Builder persist config
const builderPersistConfig = {
  key: 'builder',
  storage,
  whitelist: ['questions', 'pages', 'currentPageIndex', 'activeQuestionId', 'packageMeta'],
}

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  survey: persistReducer(surveyPersistConfig, surveyReducer),
  builder: persistReducer(builderPersistConfig, builderReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
