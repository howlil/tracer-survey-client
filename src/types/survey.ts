// Base Question Interface
export interface BaseQuestion {
  id: string
  type: 'text' | 'single' | 'multiple' | 'combobox' | 'rating'
  label: string
  required: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
}

// Text Question
export interface TextQuestion extends BaseQuestion {
  type: 'text'
  placeholder?: string
  inputType?: 'text' | 'email' | 'number' | 'tel' | 'url'
  variant?: 'text' | 'email' | 'number'
}

// Single Choice Question
export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single'
  options: Array<{
    value: string
    label: string
    disabled?: boolean
    isOther?: boolean
  }>
  layout?: 'vertical' | 'horizontal'
  otherValue?: string
  onOtherValueChange?: (value: string) => void
  otherInputPlaceholder?: string
  validateOther?: boolean
  errorMessage?: string
}

// Multiple Choice Question
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple'
  options: Array<{
    value: string
    label: string
    disabled?: boolean
    isOther?: boolean
  }>
  layout?: 'vertical' | 'horizontal'
  otherValue?: string
  onOtherValueChange?: (value: string) => void
  otherInputPlaceholder?: string
  validateOther?: boolean
  errorMessage?: string
}

// ComboBox Question
export interface ComboBoxQuestion extends BaseQuestion {
  type: 'combobox'
  comboboxItems: Array<{
    id: string
    label: string
    placeholder?: string
    searchPlaceholder?: string
    required?: boolean
    disabled?: boolean
    options: Array<{
      value: string
      label: string
      disabled?: boolean
    }>
  }>
  layout?: 'vertical' | 'horizontal'
}

// Rating Question
export interface RatingQuestion extends BaseQuestion {
  type: 'rating'
  ratingItems: Array<{
    id: string
    label: string
    disabled?: boolean
  }>
  ratingOptions?: Array<{
    value: string
    label: string
  }>
  tableClassName?: string
  headerClassName?: string
  cellClassName?: string
}

// Union type for all question types
export type Question = 
  | TextQuestion 
  | SingleChoiceQuestion 
  | MultipleChoiceQuestion 
  | ComboBoxQuestion 
  | RatingQuestion

// Survey Form Props
export interface SurveyFormProps {
  questions: Question[]
  values: Record<string, any>
  onChange: (questionId: string, value: any) => void
  onSubmit?: (answers: Record<string, any>) => void
  onValidate?: (questionId: string, value: any) => string | null
  className?: string
  submitButtonText?: string
  showSubmitButton?: boolean
  isLoading?: boolean
}

// Survey State
export interface SurveyState {
  currentQuestionIndex: number
  answers: Record<string, any>
  errors: Record<string, string>
  isSubmitting: boolean
  isCompleted: boolean
}

// Survey Actions
export interface SurveyActions {
  setAnswer: (questionId: string, value: any) => void
  setError: (questionId: string, error: string | null) => void
  nextQuestion: () => void
  prevQuestion: () => void
  goToQuestion: (index: number) => void
  submitSurvey: () => void
  resetSurvey: () => void
}
