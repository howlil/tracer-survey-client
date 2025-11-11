/** @format */

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {validatePINAndGetUser} from '@/data/pinDatabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface SurveyAccess {
  tracerStudy: boolean;
  userSurvey: boolean;
}

interface LoginData {
  username: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginData: LoginData;
  surveyAccess: SurveyAccess;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoginData: (data: LoginData) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSurveyAccess: (access: SurveyAccess) => void;
  setLoading: (loading: boolean) => void;
  login: (credentials: {
    username: string;
    password: string;
    surveyType?: 'tracer-study' | 'user-survey';
  }) => Promise<void>;
  loginWithPIN: (data: {
    pin: string;
    captcha: string;
    surveyType: 'tracer-study' | 'user-survey';
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
      setUser: (user) => set({user, isAuthenticated: true, error: null}),
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          surveyAccess: {tracerStudy: false, userSurvey: false},
        }),
      setLoginData: (loginData) => set({loginData}),
      setUsername: (username) =>
        set((state) => ({
          loginData: {...state.loginData, username},
        })),
      setPassword: (password) =>
        set((state) => ({
          loginData: {...state.loginData, password},
        })),
      setError: (error) => set({error}),
      clearError: () => set({error: null}),
      setSurveyAccess: (surveyAccess) => set({surveyAccess}),
      setLoading: (isLoading) => set({isLoading}),
      login: async (credentials) => {
        set({isLoading: true, error: null});
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }

          const data = await response.json();
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            surveyAccess: data.surveyAccess || {
              tracerStudy: false,
              userSurvey: false,
            },
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
            isAuthenticated: false,
          });
          throw error;
        }
      },
      loginWithPIN: async (data) => {
        set({isLoading: true, error: null});
        try {
          const userRecord = validatePINAndGetUser(data.pin, data.surveyType);

          if (!userRecord) {
            throw new Error('PIN tidak valid untuk survey ini');
          }

          set({
            user: {
              id: userRecord.userID,
              name: userRecord.name,
              email: userRecord.email,
              role: 'user',
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
            surveyAccess: {
              tracerStudy: data.surveyType === 'tracer-study',
              userSurvey: data.surveyType === 'user-survey',
            },
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'PIN login failed',
            isAuthenticated: false,
          });
          throw error;
        }
      },
      logout: async () => {
        set({isLoading: true});
        try {
          await fetch('/api/auth/logout', {method: 'POST'});
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            surveyAccess: {tracerStudy: false, userSurvey: false},
          });
        }
      },
      checkAuth: async () => {
        set({isLoading: true});
        try {
          const response = await fetch('/api/auth/me');

          if (!response.ok) {
            throw new Error('Not authenticated');
          }

          const data = await response.json();
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            surveyAccess: data.surveyAccess || {
              tracerStudy: false,
              userSurvey: false,
            },
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            surveyAccess: {tracerStudy: false, userSurvey: false},
          });
        }
      },
    }),
    {
      name: 'auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        surveyAccess: state.surveyAccess,
      }),
    }
  )
);
