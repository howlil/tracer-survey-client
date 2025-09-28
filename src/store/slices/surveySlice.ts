import type { Question } from '@/types/survey'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '..'

// Survey State Interface
export interface SurveyState {
  // Current Survey Data
  questions: Question[]
  currentQuestionIndex: number
  answers: Record<string, any>
  otherValues: Record<string, string>
  errors: Record<string, string>
  
  // Survey Status
  isSubmitting: boolean
  isCompleted: boolean
  isLoading: boolean
  
  // Survey Metadata
  surveyId: string | null
  surveyTitle: string
  totalQuestions: number
  
  // Navigation
  canGoNext: boolean
  canGoPrevious: boolean
}

// Initial State
const initialState: SurveyState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  otherValues: {},
  errors: {},
  isSubmitting: false,
  isCompleted: false,
  isLoading: false,
  surveyId: null,
  surveyTitle: '',
  totalQuestions: 0,
  canGoNext: false,
  canGoPrevious: false,
}

// Async Thunks
export const loadSurvey = createAsyncThunk(
  'survey/loadSurvey',
  async (surveyId: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/surveys/${surveyId}`)
    if (!response.ok) {
      throw new Error('Failed to load survey')
    }
    return response.json()
  }
)

export const submitSurvey = createAsyncThunk(
  'survey/submitSurvey',
  async (data: { surveyId: string; answers: Record<string, any> }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/surveys/${data.surveyId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.answers),
    })
    if (!response.ok) {
      throw new Error('Failed to submit survey')
    }
    return response.json()
  }
)

// Survey Slice
const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    // Initialize Survey
    initializeSurvey: (state, action: PayloadAction<{ questions: Question[]; surveyId: string; surveyTitle: string }>) => {
      state.questions = action.payload.questions
      state.surveyId = action.payload.surveyId
      state.surveyTitle = action.payload.surveyTitle
      state.totalQuestions = action.payload.questions.length
      state.currentQuestionIndex = 0
      state.answers = {}
      state.otherValues = {}
      state.errors = {}
      state.isCompleted = false
      state.canGoNext = false
      state.canGoPrevious = false
    },

    // Answer Management
    setAnswer: (state, action: PayloadAction<{ questionId: string; value: any }>) => {
      const { questionId, value } = action.payload
      state.answers[questionId] = value
      
      // Clear error for this question
      if (state.errors[questionId]) {
        delete state.errors[questionId]
      }
      
      // Update navigation state
      state.canGoNext = true
    },

    setOtherValue: (state, action: PayloadAction<{ questionId: string; value: string }>) => {
      const { questionId, value } = action.payload
      state.otherValues[questionId] = value
    },

    // Error Management
    setError: (state, action: PayloadAction<{ questionId: string; error: string | null }>) => {
      const { questionId, error } = action.payload
      if (error) {
        state.errors[questionId] = error
      } else {
        delete state.errors[questionId]
      }
    },

    clearErrors: (state) => {
      state.errors = {}
    },

    // Navigation
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.totalQuestions - 1) {
        state.currentQuestionIndex += 1
        state.canGoPrevious = true
        state.canGoNext = false
      }
    },

    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1
        state.canGoNext = true
        if (state.currentQuestionIndex === 0) {
          state.canGoPrevious = false
        }
      }
    },

    goToQuestion: (state, action: PayloadAction<number>) => {
      const targetIndex = action.payload
      if (targetIndex >= 0 && targetIndex < state.totalQuestions) {
        state.currentQuestionIndex = targetIndex
        state.canGoPrevious = targetIndex > 0
        state.canGoNext = targetIndex < state.totalQuestions - 1
      }
    },

    // Survey Status
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },

    setCompleted: (state, action: PayloadAction<boolean>) => {
      state.isCompleted = action.payload
    },

    // Reset Survey
    resetSurvey: (state) => {
      state.currentQuestionIndex = 0
      state.answers = {}
      state.otherValues = {}
      state.errors = {}
      state.isSubmitting = false
      state.isCompleted = false
      state.canGoNext = false
      state.canGoPrevious = false
    },

    // Clear Survey
    clearSurvey: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Load Survey
      .addCase(loadSurvey.pending, (state) => {
        state.isLoading = true
        state.errors = {}
      })
      .addCase(loadSurvey.fulfilled, (state, action) => {
        state.isLoading = false
        state.questions = action.payload.questions
        state.surveyId = action.payload.surveyId
        state.surveyTitle = action.payload.title
        state.totalQuestions = action.payload.questions.length
        state.currentQuestionIndex = 0
        state.answers = {}
        state.otherValues = {}
        state.errors = {}
        state.isCompleted = false
        state.canGoNext = false
        state.canGoPrevious = false
      })
      .addCase(loadSurvey.rejected, (state, action) => {
        state.isLoading = false
        state.errors = { general: action.error.message || 'Failed to load survey' }
      })
      
      // Submit Survey
      .addCase(submitSurvey.pending, (state) => {
        state.isSubmitting = true
        state.errors = {}
      })
      .addCase(submitSurvey.fulfilled, (state) => {
        state.isSubmitting = false
        state.isCompleted = true
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.isSubmitting = false
        state.errors = { general: action.error.message || 'Failed to submit survey' }
      })
  },
})

// Export Actions
export const {
  initializeSurvey,
  setAnswer,
  setOtherValue,
  setError,
  clearErrors,
  nextQuestion,
  previousQuestion,
  goToQuestion,
  setSubmitting,
  setCompleted,
  resetSurvey,
  clearSurvey,
} = surveySlice.actions

// Export Reducer
export default surveySlice.reducer

// Selectors
export const selectCurrentQuestion = (state: RootState) => {
  const { questions, currentQuestionIndex } = state.survey
  return questions[currentQuestionIndex] || null
}

export const selectSurveyProgress = (state: RootState) => {
  const { currentQuestionIndex, totalQuestions } = state.survey
  return {
    current: currentQuestionIndex + 1,
    total: totalQuestions,
    percentage: totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0,
  }
}

export const selectAnsweredQuestions = (state: RootState) => {
  const { answers, questions } = state.survey
  return questions.filter(question => {
    if (question.type === 'rating') {
      return question.ratingItems?.every(item => answers[item.id])
    }
    return answers[question.id] !== undefined
  }).length
}

export const selectCanSubmit = (state: RootState) => {
  const { answers, questions, isSubmitting } = state.survey
  if (isSubmitting) return false
  
  return questions.every(question => {
    if (!question.required) return true
    
    if (question.type === 'rating') {
      return question.ratingItems?.every(item => answers[item.id])
    }
    
    const value = answers[question.id]
    if (Array.isArray(value)) {
      return value.length > 0
    }
    
    return value !== undefined && value !== null && value !== ''
  })
}

export const selectCanGoNext = (state: RootState) => {
  const { answers, currentQuestionIndex, questions, isSubmitting } = state.survey
  if (isSubmitting) return false
  
  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return false
  
  // Check if current question is answered
  if (currentQuestion.type === 'rating') {
    return currentQuestion.ratingItems?.every(item => answers[item.id]) || false
  }
  
  const value = answers[currentQuestion.id]
  if (Array.isArray(value)) {
    return value.length > 0
  }
  
  return value !== undefined && value !== null && value !== ''
}
