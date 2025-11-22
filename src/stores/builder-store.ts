/** @format */

import {create} from 'zustand';
import {v4 as uuidv4} from 'uuid';
import type {
  BuilderQuestion,
  BuilderState,
  QuestionType,
} from '@/types/builder';
import type {Question} from '@/types/survey';

function createDefaultQuestion(type: QuestionType): Question {
  const id = uuidv4();
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
          {value: uuidv4(), label: 'Opsi A'},
          {value: uuidv4(), label: 'Opsi B'},
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
          {value: uuidv4(), label: 'Opsi A'},
          {value: uuidv4(), label: 'Opsi B'},
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
            id: uuidv4(),
            label: 'Item',
            options: [
              {value: uuidv4(), label: 'Opsi A'},
              {value: uuidv4(), label: 'Opsi B'},
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
        ratingItems: [{id: uuidv4(), label: 'Aspek'}],
        ratingOptions: [
          {value: uuidv4(), label: '1'},
          {value: uuidv4(), label: '2'},
          {value: uuidv4(), label: '3'},
          {value: uuidv4(), label: '4'},
          {value: uuidv4(), label: '5'},
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
  updatePages: (pages: BuilderState['pages']) => void;
  loadQuestionsFromAPI: (
    questions: BuilderQuestion[],
    pages: BuilderState['pages']
  ) => void;
  addChildQuestion: (
    parentId: string,
    questionData: Partial<Question> & {type: QuestionType}
  ) => void;
}

const createInitialState = (): BuilderState => ({
  questions: [],
  pages: [{id: uuidv4(), title: 'Halaman 1', description: '', questionIds: []}],
  currentPageIndex: 0,
  activeQuestionId: undefined,
  isDirty: false,
  packageMeta: {
    version: 1,
  },
});

const initialState = createInitialState();

export const useBuilderStore = create<BuilderStoreState>()((set) => ({
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
        id: uuidv4(),
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
          state.activeQuestionId === id ? undefined : state.activeQuestionId,
        isDirty: true,
      };
    }),
  removeQuestionVersion: (id) =>
    set((state) => {
      const questionToRemove = state.questions.find((q) => q.id === id);
      if (!questionToRemove) return state;

      const questionCode = (questionToRemove as BuilderQuestion).questionCode;
      let alternativeVersion = null;
      if (questionCode) {
        alternativeVersion = state.questions.find(
          (q) =>
            (q as BuilderQuestion).questionCode === questionCode && q.id !== id
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
            questionIds: currentPage.questionIds.filter((qid) => qid !== id),
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
        idx === state.currentPageIndex ? {...p, questionIds: newQuestionIds} : p
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
        idx === state.currentPageIndex ? {...p, questionIds: newQuestionIds} : p
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
  resetBuilder: () => set(createInitialState()),
  markSaved: () =>
    set((state) => ({
      isDirty: false,
      questions: state.questions.map((q) => ({...q, status: 'saved'})),
    })),
  updatePages: (newPages) =>
    set(() => ({
      pages: newPages,
      isDirty: true,
    })),
  loadQuestionsFromAPI: (newQuestions, newPages) =>
    set(() => ({
      questions: newQuestions,
      pages: newPages,
      currentPageIndex: 0,
      activeQuestionId:
        newQuestions.length > 0 ? newQuestions[0].id : undefined,
      isDirty: false,
    })),
  addChildQuestion: (parentId, questionData) =>
    set((state) => {
      const parentQ = state.questions.find((q) => q.id === parentId);
      if (!parentQ) return state;

      const order = state.questions.length;
      const base = createDefaultQuestion(questionData.type);
      const childId = questionData.id || uuidv4();
      const parentExtQ = parentQ as BuilderQuestion;

      const childQuestion: BuilderQuestion = {
        ...base,
        ...questionData,
        id: childId,
        order,
        status: 'new',
        questionCode:
          (questionData as Question & {questionCode?: string}).questionCode ||
          parentExtQ.questionCode ||
          'Q1',
        version: parentExtQ.version || '2024',
      } as BuilderQuestion & {parentId?: string; groupQuestionId?: string};

      // Set parentId and groupQuestionId as separate properties
      (
        childQuestion as Question & {
          parentId?: string;
          groupQuestionId?: string;
        }
      ).parentId = parentId;
      (
        childQuestion as Question & {
          parentId?: string;
          groupQuestionId?: string;
        }
      ).groupQuestionId =
        (questionData as Question & {groupQuestionId?: string})
          .groupQuestionId || parentExtQ.id;

      // Get the current page and add child question to it
      const currentPage = state.pages[state.currentPageIndex];
      const newPageQuestionIds = currentPage
        ? [...currentPage.questionIds, childId]
        : [childId];

      const updatedPages = state.pages.map((page, idx) =>
        idx === state.currentPageIndex
          ? {...page, questionIds: newPageQuestionIds}
          : page
      );

      return {
        questions: [...state.questions, childQuestion],
        pages: updatedPages,
        activeQuestionId: childQuestion.id,
        isDirty: true,
      };
    }),
}));
