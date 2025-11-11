/** @format */

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {Question} from '@/types/survey';
import {loadUserSurveyData, saveUserSurveyData} from '@/store/userStorage';

interface SurveyState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, unknown>;
  otherValues: Record<string, string>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  surveyId: string | null;
  surveyTitle: string;
  totalQuestions: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentUserId: string | null;
  initializeSurvey: (data: {
    questions: Question[];
    surveyId: string;
    surveyTitle: string;
    userId?: string;
    preserveData?: boolean;
  }) => void;
  setUserId: (userId: string) => void;
  loadUserData: (userId: string) => void;
  setAnswer: (data: {questionId: string; value: unknown}) => void;
  setOtherValue: (data: {questionId: string; value: string}) => void;
  setError: (data: {questionId: string; error: string | null}) => void;
  clearErrors: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  setSubmitting: (submitting: boolean) => void;
  setCompleted: (completed: boolean) => void;
  resetSurvey: () => void;
  clearSurvey: () => void;
  loadSurvey: (surveyId: string) => Promise<void>;
  submitSurvey: (data: {
    surveyId: string;
    answers: Record<string, unknown>;
  }) => Promise<void>;
}

const initialState = {
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
  currentUserId: null,
};

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      ...initialState,
      initializeSurvey: (data) =>
        set(() => {
          if (data.preserveData) {
            return {
              questions: data.questions,
              surveyId: data.surveyId,
              surveyTitle: data.surveyTitle,
              totalQuestions: data.questions.length,
              currentUserId: data.userId || null,
            };
          }
          return {
            questions: data.questions,
            surveyId: data.surveyId,
            surveyTitle: data.surveyTitle,
            totalQuestions: data.questions.length,
            currentUserId: data.userId || null,
            currentQuestionIndex: 0,
            answers: {},
            otherValues: {},
            errors: {},
            isCompleted: false,
            canGoNext: false,
            canGoPrevious: false,
          };
        }),
      setUserId: (currentUserId) => set({currentUserId}),
      loadUserData: (userId) =>
        set(() => {
          const userData = loadUserSurveyData(userId);

          if (userData && userData.userId === userId) {
            return {
              answers: userData.answers || {},
              otherValues: userData.otherValues || {},
              currentQuestionIndex: userData.currentQuestionIndex || 0,
              isCompleted: userData.isCompleted || false,
              currentUserId: userId,
              canGoNext: Object.keys(userData.answers || {}).length > 0,
              canGoPrevious: (userData.currentQuestionIndex || 0) > 0,
            };
          }
          return {
            answers: {},
            otherValues: {},
            currentQuestionIndex: 0,
            isCompleted: false,
            canGoNext: false,
            canGoPrevious: false,
          };
        }),
      setAnswer: (data) =>
        set((state) => {
          const newAnswers = {...state.answers, [data.questionId]: data.value};
          const newErrors = {...state.errors};
          delete newErrors[data.questionId];

          if (state.currentUserId) {
            const surveyData = {
              answers: newAnswers,
              otherValues: state.otherValues,
              currentQuestionIndex: state.currentQuestionIndex,
              isCompleted: state.isCompleted,
              surveyId: state.surveyId,
              surveyTitle: state.surveyTitle,
            };
            saveUserSurveyData(state.currentUserId, surveyData);
          }

          return {
            answers: newAnswers,
            errors: newErrors,
            canGoNext: true,
          };
        }),
      setOtherValue: (data) =>
        set((state) => {
          const newOtherValues = {
            ...state.otherValues,
            [data.questionId]: data.value,
          };

          if (state.currentUserId) {
            const surveyData = {
              answers: state.answers,
              otherValues: newOtherValues,
              currentQuestionIndex: state.currentQuestionIndex,
              isCompleted: state.isCompleted,
              surveyId: state.surveyId,
              surveyTitle: state.surveyTitle,
            };
            saveUserSurveyData(state.currentUserId, surveyData);
          }

          return {otherValues: newOtherValues};
        }),
      setError: (data) =>
        set((state) => {
          const newErrors = {...state.errors};
          if (data.error) {
            newErrors[data.questionId] = data.error;
          } else {
            delete newErrors[data.questionId];
          }
          return {errors: newErrors};
        }),
      clearErrors: () => set({errors: {}}),
      nextQuestion: () =>
        set((state) => {
          if (state.currentQuestionIndex < state.totalQuestions - 1) {
            return {
              currentQuestionIndex: state.currentQuestionIndex + 1,
              canGoPrevious: true,
              canGoNext: false,
            };
          }
          return state;
        }),
      previousQuestion: () =>
        set((state) => {
          if (state.currentQuestionIndex > 0) {
            return {
              currentQuestionIndex: state.currentQuestionIndex - 1,
              canGoNext: true,
              canGoPrevious: state.currentQuestionIndex - 1 > 0,
            };
          }
          return state;
        }),
      goToQuestion: (targetIndex) =>
        set((state) => {
          if (targetIndex >= 0 && targetIndex < state.totalQuestions) {
            return {
              currentQuestionIndex: targetIndex,
              canGoPrevious: targetIndex > 0,
              canGoNext: targetIndex < state.totalQuestions - 1,
            };
          }
          return state;
        }),
      setSubmitting: (isSubmitting) => set({isSubmitting}),
      setCompleted: (isCompleted) => set({isCompleted}),
      resetSurvey: () =>
        set({
          currentQuestionIndex: 0,
          answers: {},
          otherValues: {},
          errors: {},
          isSubmitting: false,
          isCompleted: false,
          canGoNext: false,
          canGoPrevious: false,
        }),
      clearSurvey: () => set(initialState),
      loadSurvey: async (surveyId) => {
        set({isLoading: true, errors: {}});
        try {
          const response = await fetch(`/api/surveys/${surveyId}`);
          if (!response.ok) {
            throw new Error('Failed to load survey');
          }
          const data = await response.json();
          set({
            isLoading: false,
            questions: data.questions,
            surveyId: data.surveyId,
            surveyTitle: data.title,
            totalQuestions: data.questions.length,
            currentQuestionIndex: 0,
            answers: {},
            otherValues: {},
            errors: {},
            isCompleted: false,
            canGoNext: false,
            canGoPrevious: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            errors: {
              general:
                error instanceof Error
                  ? error.message
                  : 'Failed to load survey',
            },
          });
        }
      },
      submitSurvey: async (data) => {
        set({isSubmitting: true, errors: {}});
        try {
          const response = await fetch(`/api/surveys/${data.surveyId}/submit`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data.answers),
          });
          if (!response.ok) {
            throw new Error('Failed to submit survey');
          }
          set({isSubmitting: false, isCompleted: true});
        } catch (error) {
          set({
            isSubmitting: false,
            errors: {
              general:
                error instanceof Error
                  ? error.message
                  : 'Failed to submit survey',
            },
          });
        }
      },
    }),
    {
      name: 'survey',
      partialize: (state) => ({
        answers: state.answers,
        otherValues: state.otherValues,
        currentQuestionIndex: state.currentQuestionIndex,
        isCompleted: state.isCompleted,
      }),
    }
  )
);

export const selectCurrentQuestion = () => {
  const state = useSurveyStore.getState();
  return state.questions[state.currentQuestionIndex] || null;
};

export const selectSurveyProgress = () => {
  const state = useSurveyStore.getState();
  return {
    current: state.currentQuestionIndex + 1,
    total: state.totalQuestions,
    percentage:
      state.totalQuestions > 0
        ? ((state.currentQuestionIndex + 1) / state.totalQuestions) * 100
        : 0,
  };
};

export const selectAnsweredQuestions = () => {
  const state = useSurveyStore.getState();
  return state.questions.filter((question) => {
    if (question.type === 'rating') {
      return question.ratingItems?.every((item) => state.answers[item.id]);
    }
    return state.answers[question.id] !== undefined;
  }).length;
};

export const selectCanSubmit = () => {
  const state = useSurveyStore.getState();
  if (state.isSubmitting) return false;

  return state.questions.every((question) => {
    if (!question.required) return true;

    if (question.type === 'rating') {
      return question.ratingItems?.every((item) => state.answers[item.id]);
    }

    const value = state.answers[question.id];
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined && value !== null && value !== '';
  });
};

export const selectCanGoNext = () => {
  const state = useSurveyStore.getState();
  if (state.isSubmitting) return false;

  const currentQuestion = state.questions[state.currentQuestionIndex];
  if (!currentQuestion) return false;

  if (currentQuestion.type === 'rating') {
    return (
      currentQuestion.ratingItems?.every((item) => state.answers[item.id]) ||
      false
    );
  }

  const value = state.answers[currentQuestion.id];
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== '';
};
