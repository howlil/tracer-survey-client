/** @format */

import {SoalComboBox} from '@/components/kuisioner/soal/SoalComboBox';
import {SoalMultiChoice} from '@/components/kuisioner/soal/SoalMultiChoice';
import {SoalRating} from '@/components/kuisioner/soal/SoalRating';
import {SoalSingleChoice} from '@/components/kuisioner/soal/SoalSingleChoice';
import {SoalTeks} from '@/components/kuisioner/soal/SoalTeks';
import {SoalTeksArea} from '@/components/kuisioner/soal/SoalTeksArea';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {useSurveyStore, selectCanGoNext} from '@/stores/survey-store';
import type {Question, ConditionalQuestion} from '@/types/survey';
import {ArrowLeft, ArrowRight, Check} from 'lucide-react';
import * as React from 'react';

interface SurveyFormProps {
  questions: Question[];
  currentPage: number;
  totalPages: number;
  pageTitle?: string;
  pageDescription?: string;
  onSubmit?: (answers: Record<string, unknown>) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onSaveDraft?: () => void;
  onValidate?: (questionId: string, value: unknown) => string | null;
  className?: string;
  submitButtonText?: string;
  showSubmitButton?: boolean;
  conditionalQuestions?: ConditionalQuestion[];
  onConditionalQuestionsChange?: (
    conditionalQuestions: ConditionalQuestion[]
  ) => void;
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
  onSaveDraft,
  onValidate,
  className,
  submitButtonText = 'Submit Survey',
  showSubmitButton = true,
  conditionalQuestions = [],
  onConditionalQuestionsChange,
}: SurveyFormProps) {
  const answers = useSurveyStore((state) => state.answers);
  const otherValues = useSurveyStore((state) => state.otherValues);
  const errors = useSurveyStore((state) => state.errors);
  const isSubmitting = useSurveyStore((state) => state.isSubmitting);
  const setAnswer = useSurveyStore((state) => state.setAnswer);
  const setOtherValue = useSurveyStore((state) => state.setOtherValue);
  const setError = useSurveyStore((state) => state.setError);
  const canGoNext = selectCanGoNext();

  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;

  // State untuk conditional questions
  const [visibleConditionalQuestions, setVisibleConditionalQuestions] =
    React.useState<ConditionalQuestion[]>([]);

  // Function untuk mendapatkan conditional questions yang harus ditampilkan
  const getVisibleConditionalQuestions = React.useCallback(() => {
    const visible: ConditionalQuestion[] = [];

    conditionalQuestions.forEach((conditional) => {
      const triggerAnswer = answers[conditional.triggerQuestionId];
      if (triggerAnswer === conditional.triggerOptionValue) {
        visible.push(conditional);
      }
    });

    return visible;
  }, [conditionalQuestions, answers]);

  // Update visible conditional questions ketika answers berubah
  React.useEffect(() => {
    const visible = getVisibleConditionalQuestions();
    setVisibleConditionalQuestions(visible);

    // Notify parent component tentang perubahan conditional questions
    if (onConditionalQuestionsChange) {
      onConditionalQuestionsChange(visible);
    }
  }, [getVisibleConditionalQuestions, onConditionalQuestionsChange]);

  // Function untuk mendapatkan semua questions yang harus ditampilkan (original + conditional)
  const getAllVisibleQuestions = React.useCallback(() => {
    const allQuestions = [...questions];

    // Tambahkan conditional questions yang visible dengan urutan yang benar
    // Urutkan berdasarkan posisi soal pemicu
    const sortedConditionals = visibleConditionalQuestions.sort((a, b) => {
      const aIndex = allQuestions.findIndex(
        (q) => q.id === a.triggerQuestionId
      );
      const bIndex = allQuestions.findIndex(
        (q) => q.id === b.triggerQuestionId
      );
      return aIndex - bIndex;
    });

    // Insert conditional questions setelah soal pemicu masing-masing
    let insertOffset = 0;
    sortedConditionals.forEach((conditional) => {
      const triggerIndex = allQuestions.findIndex(
        (q) => q.id === conditional.triggerQuestionId
      );
      if (triggerIndex !== -1) {
        // Insert conditional question setelah soal pemicu (dengan offset untuk multiple conditionals)
        const insertIndex = triggerIndex + 1 + insertOffset;
        allQuestions.splice(insertIndex, 0, conditional.question);
        insertOffset++;
      }
    });

    return allQuestions;
  }, [questions, visibleConditionalQuestions]);

  const handleValueChange = React.useCallback(
    (questionId: string, value: unknown) => {
      setAnswer({questionId, value});

      const newVisibleConditionalQuestions = getVisibleConditionalQuestions();
      const currentVisibleIds = newVisibleConditionalQuestions.map(
        (cq) => cq.question.id
      );

      Object.keys(answers).forEach((answerKey) => {
        const isConditionalQuestion = conditionalQuestions.some(
          (cq) => cq.question.id === answerKey
        );
        if (isConditionalQuestion && !currentVisibleIds.includes(answerKey)) {
          setAnswer({questionId: answerKey, value: null});
        }
      });
    },
    [setAnswer, getVisibleConditionalQuestions, conditionalQuestions, answers]
  );

  const handleOtherValueChange = React.useCallback(
    (questionId: string, value: string) => {
      setOtherValue({questionId, value});
    },
    [setOtherValue]
  );

  // Validate current page questions
  const validateCurrentPage = React.useCallback(() => {
    let hasError = false;
    const allVisibleQuestions = getAllVisibleQuestions();

    allVisibleQuestions.forEach((question) => {
      if (!question.required) return;

      const value = answers[question.id];
      let error: string | null = null;

      // Required validation
      if (question.type === 'rating') {
        const unansweredItems =
          question.ratingItems?.filter((item) => {
            const itemValue = answers[item.id];
            return !itemValue || (itemValue as string).trim() === '';
          }) || [];

        if (unansweredItems.length > 0) {
          error = 'Semua item rating harus diisi';
        }
      } else {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          error = 'Pertanyaan ini wajib diisi';
        }
      }

      // Custom validation
      if (onValidate && !error) {
        error = onValidate(question.id, value);
      }

      // Other value validation for single/multiple choice
      if (
        (question.type === 'single' || question.type === 'multiple') &&
        question.options?.some((opt) => opt.isOther && value === opt.value)
      ) {
        const otherValue = otherValues[question.id];
        if (!(otherValue as string)?.trim?.()) {
          error = 'Harap isi jawaban lainnya';
        }
      }

      if (error) {
        setError({questionId: question.id, error});
        hasError = true;
      } else {
        setError({questionId: question.id, error: null});
      }
    });

    return !hasError;
  }, [getAllVisibleQuestions, answers, otherValues, onValidate, setError]);

  // Navigate to next page
  const handleNext = React.useCallback(() => {
    if (validateCurrentPage()) {
      if (isLastPage) {
        onSubmit?.(answers);
      } else {
        onNextPage?.();
      }
    }
  }, [validateCurrentPage, isLastPage, onSubmit, answers, onNextPage]);

  // Navigate to previous page
  const handlePrevious = React.useCallback(() => {
    if (!isFirstPage) {
      onPreviousPage?.();
    }
  }, [isFirstPage, onPreviousPage]);

  // Render question based on type
  const renderQuestion = React.useCallback(
    (question: Question) => {
      const commonProps = {
        label: question.label,
        required: question.required,
        disabled: false,
        className: question.className,
        labelClassName: question.labelClassName,
      };

      switch (question.type) {
        case 'text':
          return (
            <SoalTeks
              {...commonProps}
              {...question}
              value={(answers[question.id] as string) || ''}
              onChange={(value) => handleValueChange(question.id, value)}
            />
          );

        case 'textarea':
          return (
            <SoalTeksArea
              {...commonProps}
              {...question}
              value={(answers[question.id] as string) || ''}
              onChange={(value) => handleValueChange(question.id, value)}
            />
          );

        case 'single':
          return (
            <SoalSingleChoice
              {...commonProps}
              opsiJawaban={question.options}
              value={(answers[question.id] as string) || ''}
              onChange={(value) => handleValueChange(question.id, value)}
              otherValue={otherValues[question.id] || ''}
              onOtherValueChange={(value) =>
                handleOtherValueChange(question.id, value)
              }
              layout={question.layout}
              otherInputPlaceholder={question.otherInputPlaceholder}
              validateOther={question.validateOther}
              errorMessage={question.errorMessage}
            />
          );

        case 'multiple':
          return (
            <SoalMultiChoice
              {...commonProps}
              opsiJawaban={question.options}
              value={(answers[question.id] as string[]) || []}
              onChange={(value) => handleValueChange(question.id, value)}
              otherValue={otherValues[question.id] || ''}
              onOtherValueChange={(value) =>
                handleOtherValueChange(question.id, value)
              }
              layout={question.layout}
              otherInputPlaceholder={question.otherInputPlaceholder}
              validateOther={question.validateOther}
              errorMessage={question.errorMessage}
            />
          );

        case 'combobox':
          return (
            <SoalComboBox
              {...commonProps}
              comboboxItems={question.comboboxItems.map((item) => ({
                ...item,
                opsiComboBox: item.options,
              }))}
              values={(answers[question.id] as Record<string, string>) || {}}
              onChange={(comboboxItemId, optionValue) => {
                // For combobox, store as object with comboboxItemId as key
                const currentValue = (answers[question.id] as Record<string, string>) || {};
                handleValueChange(question.id, {
                  ...currentValue,
                  [comboboxItemId]: optionValue,
                });
              }}
              layout={question.layout}
            />
          );

        case 'rating':
          return (
            <SoalRating
              {...commonProps}
              ratingItems={question.ratingItems}
              ratingOptions={question.ratingOptions}
              values={answers as Record<string, string>}
              onChange={(itemId: string, value: string) => {
                // For rating questions, store answers with children question IDs as keys
                // itemId is the children question ID (rating item ID)
                setAnswer({questionId: itemId, value});
              }}
              tableClassName={question.tableClassName}
              headerClassName={question.headerClassName}
              cellClassName={question.cellClassName}
            />
          );

        default:
          return null;
      }
    },
    [answers, otherValues, handleValueChange, handleOtherValueChange]
  );

  const allVisibleQuestions = getAllVisibleQuestions();

  if (!allVisibleQuestions || allVisibleQuestions.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-muted-foreground'>
          Tidak ada pertanyaan yang tersedia
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      {(pageTitle || pageDescription) && (
        <div className='text-center space-y-2'>
          {pageTitle && (
            <h2 className='text-2xl font-semibold text-foreground'>
              {pageTitle}
            </h2>
          )}
          {pageDescription && (
            <p className='text-muted-foreground'>{pageDescription}</p>
          )}
        </div>
      )}

      {/* Questions */}
      <div className='space-y-6'>
        {allVisibleQuestions.map((question) => {
          // Check if this is a conditional question
          const isConditional = visibleConditionalQuestions.some(
            (cq) => cq.question.id === question.id
          );

          return (
            <div
              key={question.id}
              className={`space-y-4 ${
                isConditional
                  ? 'animate-in slide-in-from-top-2 fade-in duration-500'
                  : ''
              }`}
              style={{
                animation: isConditional
                  ? 'slideDown 0.5s ease-out'
                  : undefined,
              }}
            >
              {renderQuestion(question)}

              {/* Error Message */}
              {errors[question.id] && (
                <div className='p-3 bg-destructive/10 border border-destructive/20 rounded-md'>
                  <p className='text-sm text-destructive'>
                    {errors[question.id]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className='flex items-center justify-between pt-6 border-t'>
        <Button
          variant='outline'
          onClick={handlePrevious}
          disabled={isFirstPage || isSubmitting}
          className='flex items-center space-x-2'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>Sebelumnya</span>
        </Button>

        <div className='flex items-center space-x-2'>
          {onSaveDraft && (
            <Button
              variant='outline'
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className='flex items-center space-x-2'
            >
              <span>Simpan Sementara</span>
            </Button>
          )}
          {showSubmitButton && (
            <Button
              onClick={handleNext}
              disabled={isSubmitting || !canGoNext}
              className='flex items-center space-x-2'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  <span>Memproses...</span>
                </>
              ) : isLastPage ? (
                <>
                  <Check className='h-4 w-4' />
                  <span>{submitButtonText}</span>
                </>
              ) : (
                <>
                  <span>Selanjutnya</span>
                  <ArrowRight className='h-4 w-4' />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export {SurveyForm};
export type {SurveyFormProps};
