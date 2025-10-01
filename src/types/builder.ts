import type { Question } from "@/types/survey"

// QuestionType mengikuti yang sudah ada pada Question di survey.ts
export type QuestionType = Question["type"]

// Metadata tambahan untuk kebutuhan builder
export interface BuilderQuestionMeta {
  id: string
  order: number
  status?: "new" | "edited" | "saved"
}

// Pertanyaan yang digunakan builder: reuse struktur Question + metadata
export type BuilderQuestion = Question & BuilderQuestionMeta

export interface PackageMeta {
  id?: string
  name?: string
  description?: string
  version?: number
  updatedAt?: string
}

export interface BuilderState {
  questions: BuilderQuestion[]
  // Halaman builder
  pages: Array<{ id: string; title?: string; description?: string; questionIds: string[] }>
  currentPageIndex: number
  activeQuestionId?: string
  isDirty: boolean
  packageMeta: PackageMeta
}


