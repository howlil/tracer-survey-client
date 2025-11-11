/** @format */

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {nanoid} from 'nanoid';
import type {
  BuilderQuestion,
  BuilderState,
  QuestionType,
} from '@/types/builder';
import type {Question} from '@/types/survey';

function createDefaultQuestion(type: QuestionType): Question {
  const id = nanoid();
  switch (type) {
    case 'text':
      return {
        id,
        type,
        label: 'Pertanyaan',
        required: false,
        placeholder: '',
        inputType: 'text',
        variant: 'text',
      };
    case 'textarea':
      return {
        id,
        type,
        label: 'Pertanyaan',
        required: false,
        placeholder: '',
        rows: 3,
      };
    case 'single':
      return {
        id,
        type,
        label: 'Pilih salah satu',
        required: false,
        options: [
          {value: 'a', label: 'Opsi A'},
          {value: 'b', label: 'Opsi B'},
        ],
        layout: 'vertical',
      };
    case 'multiple':
      return {
        id,
        type,
        label: 'Pilih beberapa',
        required: false,
        options: [
          {value: 'a', label: 'Opsi A'},
          {value: 'b', label: 'Opsi B'},
        ],
        layout: 'vertical',
      };
    case 'combobox':
      return {
        id,
        type,
        label: 'Pilih dari daftar',
        required: false,
        comboboxItems: [
          {
            id: nanoid(),
            label: 'Item',
            options: [
              {value: 'a', label: 'Opsi A'},
              {value: 'b', label: 'Opsi B'},
            ],
          },
        ],
        layout: 'vertical',
      };
    case 'rating':
      return {
        id,
        type,
        label: 'Beri penilaian',
        required: false,
        ratingItems: [{id: nanoid(), label: 'Aspek'}],
        ratingOptions: [
          {value: '1', label: '1'},
          {value: '2', label: '2'},
          {value: '3', label: '3'},
          {value: '4', label: '4'},
          {value: '5', label: '5'},
        ],
      };
    default:
      return {id, type: 'text', label: 'Pertanyaan', required: false};
  }
}

interface BuilderStoreState extends BuilderState {
  addQuestion: (type: QuestionType) => void;
  createQuestionVersion: (questionData: Partial<Question>) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageMeta: (data: {
    index?: number;
    title?: string;
    description?: string;
  }) => void;
  setActiveQuestion: (id: string | undefined) => void;
  updateQuestion: (data: {id: string; patch: Partial<Question>}) => void;
  removeQuestion: (id: string) => void;
  removeQuestionVersion: (id: string) => void;
  reorderCurrentPageQuestions: (data: {from: number; to: number}) => void;
  replaceQuestionInCurrentPage: (data: {
    oldQuestionId: string;
    newQuestionId: string;
  }) => void;
  reorderQuestions: (data: {from: number; to: number}) => void;
  setPackageMeta: (data: Partial<BuilderState['packageMeta']>) => void;
  resetBuilder: () => void;
  markSaved: () => void;
}

const initialState: BuilderState = {
  questions: [],
  pages: [{id: nanoid(), title: 'Halaman 1', description: '', questionIds: []}],
  currentPageIndex: 0,
  activeQuestionId: undefined,
  isDirty: false,
  packageMeta: {
    version: 1,
  },
};

export const useBuilderStore = create<BuilderStoreState>()(
  persist(
    (set) => ({
      ...initialState,
      addQuestion: (type) =>
        set((state) => {
          const base = createDefaultQuestion(type);
          const order = state.questions.length;
          const currentPageQuestionCount =
            state.pages[state.currentPageIndex].questionIds.length;
          const questionCode = `Q${currentPageQuestionCount + 1}`;
          const withMeta: BuilderQuestion = {
            ...base,
            order,
            status: 'new',
            questionCode,
            version: '2024',
          } as BuilderQuestion;

          const newQuestions = [...state.questions, withMeta];
          const newPages = state.pages.map((page, idx) =>
            idx === state.currentPageIndex
              ? {...page, questionIds: [...page.questionIds, withMeta.id]}
              : page
          );

          return {
            questions: newQuestions,
            pages: newPages,
            activeQuestionId: withMeta.id,
            isDirty: true,
          };
        }),
      createQuestionVersion: (questionData) =>
        set((state) => {
          const order = state.questions.length;
          const withMeta: BuilderQuestion = {
            ...(questionData as Question),
            order,
            status: 'new',
          } as BuilderQuestion;

          return {
            questions: [...state.questions, withMeta],
            isDirty: true,
          };
        }),
      nextPage: () =>
        set((state) => {
          if (state.currentPageIndex < state.pages.length - 1) {
            return {currentPageIndex: state.currentPageIndex + 1};
          }
          const newPage = {
            id: nanoid(),
            title: `Halaman ${state.pages.length + 1}`,
            description: '',
            questionIds: [],
          };
          return {
            pages: [...state.pages, newPage],
            currentPageIndex: state.pages.length,
          };
        }),
      prevPage: () =>
        set((state) => ({
          currentPageIndex:
            state.currentPageIndex > 0 ? state.currentPageIndex - 1 : 0,
        })),
      setPageMeta: (data) =>
        set((state) => {
          const idx = data.index ?? state.currentPageIndex;
          const newPages = state.pages.map((page, i) => {
            if (i === idx) {
              return {
                ...page,
                ...(data.title !== undefined && {title: data.title}),
                ...(data.description !== undefined && {
                  description: data.description,
                }),
              };
            }
            return page;
          });
          return {pages: newPages, isDirty: true};
        }),
      setActiveQuestion: (id) => set({activeQuestionId: id}),
      updateQuestion: (data) =>
        set((state) => {
          const newQuestions = state.questions.map((q) => {
            if (q.id === data.id) {
              return {
                ...q,
                ...data.patch,
                status: q.status === 'new' ? 'new' : 'edited',
              } as BuilderQuestion;
            }
            return q;
          });
          return {questions: newQuestions, isDirty: true};
        }),
      removeQuestion: (id) =>
        set((state) => {
          const newQuestions = state.questions
            .filter((q) => q.id !== id)
            .map((q, i) => ({...q, order: i}));
          const newPages = state.pages.map((p) => ({
            ...p,
            questionIds: p.questionIds.filter((qid) => qid !== id),
          }));
          return {
            questions: newQuestions,
            pages: newPages,
            activeQuestionId:
              state.activeQuestionId === id
                ? undefined
                : state.activeQuestionId,
            isDirty: true,
          };
        }),
      removeQuestionVersion: (id) =>
        set((state) => {
          const questionToRemove = state.questions.find((q) => q.id === id);
          if (!questionToRemove) return state;

          const questionCode = (questionToRemove as BuilderQuestion)
            .questionCode;
          let alternativeVersion = null;
          if (questionCode) {
            alternativeVersion = state.questions.find(
              (q) =>
                (q as BuilderQuestion).questionCode === questionCode &&
                q.id !== id
            );
          }

          const currentPage = state.pages[state.currentPageIndex];
          const newPages = [...state.pages];
          let newActiveQuestionId = state.activeQuestionId;

          if (currentPage) {
            if (alternativeVersion && state.activeQuestionId === id) {
              const questionIndex = currentPage.questionIds.findIndex(
                (qid) => qid === id
              );
              if (questionIndex !== -1) {
                const newQuestionIds = [...currentPage.questionIds];
                newQuestionIds[questionIndex] = alternativeVersion.id;
                newPages[state.currentPageIndex] = {
                  ...currentPage,
                  questionIds: newQuestionIds,
                };
                newActiveQuestionId = alternativeVersion.id;
              }
            } else {
              newPages[state.currentPageIndex] = {
                ...currentPage,
                questionIds: currentPage.questionIds.filter(
                  (qid) => qid !== id
                ),
              };
            }
          }

          const newQuestions = state.questions
            .filter((q) => q.id !== id)
            .map((q, i) => ({...q, order: i}));

          if (state.activeQuestionId === id && !alternativeVersion) {
            newActiveQuestionId = undefined;
          }

          return {
            questions: newQuestions,
            pages: newPages,
            activeQuestionId: newActiveQuestionId,
            isDirty: true,
          };
        }),
      reorderCurrentPageQuestions: (data) =>
        set((state) => {
          const {from, to} = data;
          const page = state.pages[state.currentPageIndex];
          if (
            !page ||
            from < 0 ||
            to < 0 ||
            from >= page.questionIds.length ||
            to >= page.questionIds.length
          ) {
            return state;
          }

          const newQuestionIds = [...page.questionIds];
          const [moved] = newQuestionIds.splice(from, 1);
          newQuestionIds.splice(to, 0, moved);

          const newPages = state.pages.map((p, idx) =>
            idx === state.currentPageIndex
              ? {...p, questionIds: newQuestionIds}
              : p
          );

          return {pages: newPages, isDirty: true};
        }),
      replaceQuestionInCurrentPage: (data) =>
        set((state) => {
          const page = state.pages[state.currentPageIndex];
          if (!page) return state;

          const index = page.questionIds.findIndex(
            (id) => id === data.oldQuestionId
          );
          if (index === -1) return state;

          const newQuestionIds = [...page.questionIds];
          newQuestionIds[index] = data.newQuestionId;

          const newPages = state.pages.map((p, idx) =>
            idx === state.currentPageIndex
              ? {...p, questionIds: newQuestionIds}
              : p
          );

          return {pages: newPages, isDirty: true};
        }),
      reorderQuestions: (data) =>
        set((state) => {
          const {from, to} = data;
          if (
            from < 0 ||
            to < 0 ||
            from >= state.questions.length ||
            to >= state.questions.length
          ) {
            return state;
          }

          const newQuestions = [...state.questions];
          const [moved] = newQuestions.splice(from, 1);
          newQuestions.splice(to, 0, moved);

          return {
            questions: newQuestions.map((q, i) => ({...q, order: i})),
            isDirty: true,
          };
        }),
      setPackageMeta: (data) =>
        set((state) => ({
          packageMeta: {...state.packageMeta, ...data},
          isDirty: true,
        })),
      resetBuilder: () => set(initialState),
      markSaved: () =>
        set((state) => ({
          isDirty: false,
          questions: state.questions.map((q) => ({...q, status: 'saved'})),
        })),
    }),
    {
      name: 'builder',
      partialize: (state) => ({
        questions: state.questions,
        pages: state.pages,
        currentPageIndex: state.currentPageIndex,
        activeQuestionId: state.activeQuestionId,
        packageMeta: state.packageMeta,
      }),
    }
  )
);
