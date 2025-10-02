import type { BuilderQuestion, BuilderState, QuestionType } from "@/types/builder"
import type { Question } from "@/types/survey"
import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit"

const initialState: BuilderState = {
  questions: [],
  pages: [{ id: nanoid(), title: "Halaman 1", description: "", questionIds: [] }],
  currentPageIndex: 0,
  activeQuestionId: undefined,
  isDirty: false,
  packageMeta: {
    version: 1,
  },
}

function createDefaultQuestion(type: QuestionType): Question {
  const id = nanoid()
  switch (type) {
    case "text":
      return { id, type, label: "Pertanyaan", required: false, placeholder: "", inputType: "text", variant: "text" }
    case "textarea":
      return { id, type, label: "Pertanyaan", required: false, placeholder: "", rows: 3 }
    case "single":
      return { id, type, label: "Pilih salah satu", required: false, options: [ { value: "a", label: "Opsi A" }, { value: "b", label: "Opsi B" } ], layout: "vertical" }
    case "multiple":
      return { id, type, label: "Pilih beberapa", required: false, options: [ { value: "a", label: "Opsi A" }, { value: "b", label: "Opsi B" } ], layout: "vertical" }
    case "combobox":
      return { id, type, label: "Pilih dari daftar", required: false, comboboxItems: [ { id: nanoid(), label: "Item", options: [ { value: "a", label: "Opsi A" }, { value: "b", label: "Opsi B" } ] } ], layout: "vertical" }
    case "rating":
      return { id, type, label: "Beri penilaian", required: false, ratingItems: [ { id: nanoid(), label: "Aspek" } ], ratingOptions: [ { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5", label: "5" } ] }
    default:
      return { id, type: "text", label: "Pertanyaan", required: false }
  }
}

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    addQuestion: {
      prepare: (type: QuestionType) => ({ payload: { type } }),
      reducer: (state, action: PayloadAction<{ type: QuestionType }>) => {
        const base = createDefaultQuestion(action.payload.type)
        const order = state.questions.length
        // Auto-generate questionCode based on position in current page
        const currentPageQuestionCount = state.pages[state.currentPageIndex].questionIds.length
        const questionCode = `Q${currentPageQuestionCount + 1}`
        const withMeta: BuilderQuestion = { 
          ...base, 
          order, 
          status: "new",
          questionCode,
          version: "2024"
        } as BuilderQuestion
        state.questions.push(withMeta)
        // Tambahkan ke halaman aktif
        state.pages[state.currentPageIndex].questionIds.push(withMeta.id)
        state.activeQuestionId = withMeta.id
        state.isDirty = true
      }
    },
    createQuestionVersion: (state, action: PayloadAction<Partial<Question>>) => {
      const questionData = action.payload
      const order = state.questions.length
      const withMeta: BuilderQuestion = { 
        ...questionData as Question, 
        order, 
        status: "new"
      } as BuilderQuestion
      // Add to questions pool but NOT to any page
      state.questions.push(withMeta)
      state.isDirty = true
    },
    // Navigasi halaman
    nextPage: (state) => {
      if (state.currentPageIndex < state.pages.length - 1) {
        state.currentPageIndex += 1
      } else {
        state.pages.push({ id: nanoid(), title: `Halaman ${state.pages.length + 1}`, description: "", questionIds: [] })
        state.currentPageIndex = state.pages.length - 1
      }
    },
    prevPage: (state) => {
      if (state.currentPageIndex > 0) state.currentPageIndex -= 1
    },
    setPageMeta: (state, action: PayloadAction<{ index?: number; title?: string; description?: string }>) => {
      const idx = action.payload.index ?? state.currentPageIndex
      const page = state.pages[idx]
      if (page) {
        if (action.payload.title !== undefined) page.title = action.payload.title
        if (action.payload.description !== undefined) page.description = action.payload.description
        state.isDirty = true
      }
    },
    setActiveQuestion: (state, action: PayloadAction<string | undefined>) => {
      state.activeQuestionId = action.payload
    },
    updateQuestion: (state, action: PayloadAction<{ id: string; patch: Partial<Question> }>) => {
      const idx = state.questions.findIndex(q => q.id === action.payload.id)
      if (idx !== -1) {
        state.questions[idx] = { ...state.questions[idx], ...action.payload.patch, status: state.questions[idx].status === "new" ? "new" : "edited" } as BuilderQuestion
        state.isDirty = true
      }
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(q => q.id !== action.payload)
      // Hapus referensi dari semua halaman
      state.pages = state.pages.map(p => ({ ...p, questionIds: p.questionIds.filter(id => id !== action.payload) }))
      if (state.activeQuestionId === action.payload) state.activeQuestionId = undefined
      // re-order
      state.questions = state.questions.map((q, i) => ({ ...q, order: i }))
      state.isDirty = true
    },
    reorderCurrentPageQuestions: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const page = state.pages[state.currentPageIndex]
      if (!page) return
      const { from, to } = action.payload
      if (from < 0 || to < 0 || from >= page.questionIds.length || to >= page.questionIds.length) return
      const [moved] = page.questionIds.splice(from, 1)
      page.questionIds.splice(to, 0, moved)
      state.isDirty = true
    },
    replaceQuestionInCurrentPage: (state, action: PayloadAction<{ oldQuestionId: string; newQuestionId: string }>) => {
      const page = state.pages[state.currentPageIndex]
      if (!page) return
      const { oldQuestionId, newQuestionId } = action.payload
      const index = page.questionIds.findIndex(id => id === oldQuestionId)
      if (index !== -1) {
        page.questionIds[index] = newQuestionId
        state.isDirty = true
      }
    },
    reorderQuestions: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload
      if (from < 0 || to < 0 || from >= state.questions.length || to >= state.questions.length) return
      const [moved] = state.questions.splice(from, 1)
      state.questions.splice(to, 0, moved)
      state.questions = state.questions.map((q, i) => ({ ...q, order: i }))
      state.isDirty = true
    },
    setPackageMeta: (state, action: PayloadAction<Partial<BuilderState["packageMeta"]>>) => {
      state.packageMeta = { ...state.packageMeta, ...action.payload }
      state.isDirty = true
    },
    resetBuilder: () => initialState,
    markSaved: (state) => {
      state.isDirty = false
      state.questions = state.questions.map(q => ({ ...q, status: "saved" }))
    }
  }
})

export const { addQuestion, createQuestionVersion, setActiveQuestion, updateQuestion, removeQuestion, reorderQuestions, setPackageMeta, resetBuilder, markSaved, nextPage, prevPage, setPageMeta, reorderCurrentPageQuestions, replaceQuestionInCurrentPage } = builderSlice.actions

export default builderSlice.reducer


