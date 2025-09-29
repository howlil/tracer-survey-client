import { SoalComboBox } from "@/components/kuisioner/soal/SoalComboBox"
import { SoalMultiChoice } from "@/components/kuisioner/soal/SoalMultiChoice"
import { SoalRating } from "@/components/kuisioner/soal/SoalRating"
import { SoalSingleChoice } from "@/components/kuisioner/soal/SoalSingleChoice"
import { SoalTeks } from "@/components/kuisioner/soal/SoalTeks"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
    selectCanGoNext,
    setAnswer,
    setError,
    setOtherValue
} from "@/store/slices/surveySlice"
import type { Question } from "@/types/survey"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import * as React from "react"

interface SurveyFormProps {
  questions: Question[]
  currentPage: number
  totalPages: number
  pageTitle?: string
  pageDescription?: string
  onSubmit?: (answers: Record<string, any>) => void
  onNextPage?: () => void
  onPreviousPage?: () => void
  onValidate?: (questionId: string, value: any) => string | null
  className?: string
  submitButtonText?: string
  showSubmitButton?: boolean
}

function SurveyForm({
  questions,
  currentPage,
  totalPages,
  pageTitle,
  pageDescription,
  onSubmit,
  onNextPage,
  onPreviousPage,
  onValidate,
  className,
  submitButtonText = "Submit Survey",
  showSubmitButton = true,
}: SurveyFormProps) {
  const dispatch = useAppDispatch()
  const { answers, otherValues, errors, isSubmitting } = useAppSelector(state => state.survey)
  const canGoNext = useAppSelector(selectCanGoNext)

  const isLastPage = currentPage === totalPages
  const isFirstPage = currentPage === 1

  // Handle value change for different question types
  const handleValueChange = React.useCallback((questionId: string, value: any) => {
    dispatch(setAnswer({ questionId, value }))
  }, [dispatch])

  // Handle other value change for single/multiple choice
  const handleOtherValueChange = React.useCallback((questionId: string, value: string) => {
    dispatch(setOtherValue({ questionId, value }))
  }, [dispatch])

  // Validate current page questions
  const validateCurrentPage = React.useCallback(() => {
    let hasError = false
    
    questions.forEach(question => {
      if (!question.required) return
      
      const value = answers[question.id]
      let error: string | null = null
      
      // Required validation
      if (question.type === 'rating') {
        const unansweredItems = question.ratingItems?.filter(item => {
          const itemValue = answers[item.id]
          return !itemValue || itemValue.trim() === ''
        }) || []
        
        if (unansweredItems.length > 0) {
          error = "Semua item rating harus diisi"
        }
      } else {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          error = "Pertanyaan ini wajib diisi"
        }
      }

      // Custom validation
      if (onValidate && !error) {
        error = onValidate(question.id, value)
      }

      // Other value validation for single/multiple choice
      if ((question.type === 'single' || question.type === 'multiple') && 
          question.options?.some(opt => opt.isOther && value === opt.value)) {
        const otherValue = otherValues[question.id]
        if (!otherValue?.trim()) {
          error = "Harap isi jawaban lainnya"
        }
      }

      if (error) {
        dispatch(setError({ questionId: question.id, error }))
        hasError = true
      } else {
        dispatch(setError({ questionId: question.id, error: null }))
      }
    })
    
    return !hasError
  }, [questions, answers, otherValues, onValidate, dispatch])

  // Navigate to next page
  const handleNext = React.useCallback(() => {
    if (validateCurrentPage()) {
      if (isLastPage) {
        onSubmit?.(answers)
      } else {
        onNextPage?.()
      }
    }
  }, [validateCurrentPage, isLastPage, onSubmit, answers, onNextPage])

  // Navigate to previous page
  const handlePrevious = React.useCallback(() => {
    if (!isFirstPage) {
      onPreviousPage?.()
    }
  }, [isFirstPage, onPreviousPage])

  // Render question based on type
  const renderQuestion = React.useCallback((question: Question) => {
    const commonProps = {
      label: question.label,
      required: question.required,
      disabled: false,
      className: question.className,
      labelClassName: question.labelClassName,
    }

    switch (question.type) {
      case 'text':
        return (
          <SoalTeks
            {...commonProps}
            {...question}
            value={answers[question.id] || ""}
            onChange={(value) => handleValueChange(question.id, value)}
          />
        )

      case 'single':
        return (
          <SoalSingleChoice
            {...commonProps}
            opsiJawaban={question.options}
            value={answers[question.id] || ""}
            onChange={(value) => handleValueChange(question.id, value)}
            otherValue={otherValues[question.id] || ""}
            onOtherValueChange={(value) => handleOtherValueChange(question.id, value)}
            layout={question.layout}
            otherInputPlaceholder={question.otherInputPlaceholder}
            validateOther={question.validateOther}
            errorMessage={question.errorMessage}
          />
        )

      case 'multiple':
        return (
          <SoalMultiChoice
            {...commonProps}
            opsiJawaban={question.options}
            value={answers[question.id] || []}
            onChange={(value) => handleValueChange(question.id, value)}
            otherValue={otherValues[question.id] || ""}
            onOtherValueChange={(value) => handleOtherValueChange(question.id, value)}
            layout={question.layout}
            otherInputPlaceholder={question.otherInputPlaceholder}
            validateOther={question.validateOther}
            errorMessage={question.errorMessage}
          />
        )

      case 'combobox':
        return (
          <SoalComboBox
            {...commonProps}
            comboboxItems={question.comboboxItems.map(item => ({
              ...item,
              opsiComboBox: item.options
            }))}
            values={answers}
            onChange={handleValueChange}
            layout={question.layout}
          />
        )

      case 'rating':
        return (
          <SoalRating
            {...commonProps}
            ratingItems={question.ratingItems}
            ratingOptions={question.ratingOptions}
            values={answers}
            onChange={handleValueChange}
            tableClassName={question.tableClassName}
            headerClassName={question.headerClassName}
            cellClassName={question.cellClassName}
          />
        )

      default:
        return null
    }
  }, [answers, otherValues, handleValueChange, handleOtherValueChange])

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Tidak ada pertanyaan yang tersedia</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Page Header */}
      {(pageTitle || pageDescription) && (
        <div className="text-center space-y-2">
          {pageTitle && (
            <h2 className="text-2xl font-semibold text-foreground">
              {pageTitle}
            </h2>
          )}
          {pageDescription && (
            <p className="text-muted-foreground">
              {pageDescription}
            </p>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-4">
            {renderQuestion(question)}
            
            {/* Error Message */}
            {errors[question.id] && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{errors[question.id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstPage || isSubmitting}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Sebelumnya</span>
        </Button>

        <div className="flex items-center space-x-2">
          {showSubmitButton && (
            <Button
              onClick={handleNext}
              disabled={isSubmitting || !canGoNext}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : isLastPage ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>{submitButtonText}</span>
                </>
              ) : (
                <>
                  <span>Selanjutnya</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { SurveyForm }
export type { SurveyFormProps }

