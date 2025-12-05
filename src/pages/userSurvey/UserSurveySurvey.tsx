/** @format */

import {ProgressBar} from '@/components/kuisioner/ProgressBar';
import {SurveyForm} from '@/components/kuisioner/SurveyForm';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {useAuthStore} from '@/stores/auth-store';
import {useSurveyStore} from '@/stores/survey-store';
import {cleanupOldUserData} from '@/store/userStorage';
import {useSubmitResponse, useSaveDraft, type SubmitAnswer} from '@/api/response.api';
import {useSurveyQuestions, useSurveys, type Question as APIQuestion} from '@/api/survey.api';
import {toast} from 'sonner';
import {getDetailedErrorMessage, logError} from '@/utils/error-handler';
import {ArrowLeft} from 'lucide-react';
import * as React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import type {Question} from '@/types/survey';

// Transform API Question to Component Question
const transformAPIQuestionToComponent = (apiQ: APIQuestion): Question & {questionCode?: string; codeId?: string} => {
  const baseQuestion: Partial<Question> = {
    id: apiQ.id,
    label: apiQ.questionText,
    required: apiQ.isRequired,
  };

  // Map API question types to component question types
  switch (apiQ.questionType) {
    case 'ESSAY':
    case 'LONG_TEST': {
      return {
        ...baseQuestion,
        type: apiQ.questionType === 'LONG_TEST' ? 'textarea' : 'text',
        placeholder: apiQ.placeholder,
        inputType: 'text',
        questionCode: apiQ.questionCode || apiQ.codeId,
        codeId: apiQ.codeId,
      } as Question & {questionCode?: string; codeId?: string};
    }
    case 'SINGLE_CHOICE': {
      const options = (apiQ.answerQuestion || []).map((opt) => ({
        value: opt.id || '',
        label: opt.answerText,
        isOther: !!opt.otherOptionPlaceholder,
      }));
      return {
        ...baseQuestion,
        type: 'single',
        options,
        layout: 'vertical',
        otherInputPlaceholder: apiQ.answerQuestion?.find((opt) => opt.otherOptionPlaceholder)?.otherOptionPlaceholder,
        questionCode: apiQ.questionCode || apiQ.codeId,
        codeId: apiQ.codeId,
      } as Question & {questionCode?: string; codeId?: string};
    }
    case 'MULTIPLE_CHOICE': {
      const options = (apiQ.answerQuestion || []).map((opt) => ({
        value: opt.id || '',
        label: opt.answerText,
        isOther: !!opt.otherOptionPlaceholder,
      }));
      return {
        ...baseQuestion,
        type: 'multiple',
        options,
        layout: 'vertical',
        otherInputPlaceholder: apiQ.answerQuestion?.find((opt) => opt.otherOptionPlaceholder)?.otherOptionPlaceholder,
        questionCode: apiQ.questionCode || apiQ.codeId,
        codeId: apiQ.codeId,
      } as Question & {questionCode?: string; codeId?: string};
    }
    case 'COMBO_BOX': {
      // For combobox, all answer options become dropdown options in a single combobox item
      const options = (apiQ.answerQuestion || []).map((opt) => ({
        value: opt.id || '',
        label: opt.answerText,
      }));
      const comboboxItems = [
        {
          id: apiQ.id || `combobox-${apiQ.codeId || ''}`,
          label: apiQ.questionText,
          placeholder: apiQ.placeholder || 'Pilih...',
          searchPlaceholder: apiQ.searchplaceholder || 'Cari...',
          required: apiQ.isRequired,
          options: options,
        },
      ];
      return {
        ...baseQuestion,
        type: 'combobox',
        comboboxItems,
        layout: 'vertical',
        questionCode: apiQ.questionCode || apiQ.codeId,
        codeId: apiQ.codeId,
      } as Question & {questionCode?: string; codeId?: string};
    }
    case 'MATRIX_SINGLE_CHOICE': {
      // Matrix single choice is similar to rating
      // Rating items are children questions, not answer options of the parent
      // This will be handled in componentQuestions useMemo
      const ratingOptions = (apiQ.answerQuestion || []).map((opt) => ({
        value: opt.id || '',
        label: opt.answerText,
      }));
      return {
        ...baseQuestion,
        type: 'rating',
        ratingItems: [], // Will be populated from children
        ratingOptions,
        questionCode: apiQ.questionCode || apiQ.codeId,
        codeId: apiQ.codeId,
        _parentId: apiQ.id,
      } as Question & {questionCode?: string; codeId?: string; _parentId?: string; _childrenIds?: string[]};
    }
    default:
      return {
        ...baseQuestion,
        type: 'text',
        placeholder: apiQ.placeholder,
        questionCode: apiQ.questionCode || apiQ.codeId,
        codeId: apiQ.codeId,
      } as Question & {questionCode?: string; codeId?: string};
  }
};

// Create pages from questions grouped by questionCode
const createPagesFromQuestions = (questions: Question[]): Array<{
  page: number;
  title: string;
  description?: string;
  questionIds: string[];
}> => {
  if (questions.length === 0) {
    return [];
  }

  // Group questions by questionCode
  const questionsByCode = questions.reduce((acc, q) => {
    const questionWithCode = q as Question & {questionCode?: string; codeId?: string};
    const code = questionWithCode.questionCode || questionWithCode.codeId || 'A';
    
    if (!acc[code]) {
      acc[code] = [];
    }
    acc[code].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  const codes = Object.keys(questionsByCode).sort();
  
  return codes.map((code, index) => {
    const sortedQuestions = questionsByCode[code].sort((a, b) => {
      const aOrder = (a as Question & {sortOrder?: number}).sortOrder || 0;
      const bOrder = (b as Question & {sortOrder?: number}).sortOrder || 0;
      return aOrder - bOrder;
    });

    return {
      page: index + 1,
      title: `Halaman ${index + 1}`,
      description: `Pertanyaan ${code}`,
      questionIds: sortedQuestions.map((q) => q.id),
    };
  });
};

function UserSurveySurvey() {
  const navigate = useNavigate();
  const {page} = useParams<{page: string}>();
  const user = useAuthStore((state) => state.user);
  const initializeSurvey = useSurveyStore((state) => state.initializeSurvey);
  const setUserId = useSurveyStore((state) => state.setUserId);
  const loadUserData = useSurveyStore((state) => state.loadUserData);
  const setSubmitting = useSurveyStore((state) => state.setSubmitting);
  const setCompleted = useSurveyStore((state) => state.setCompleted);
  const answers = useSurveyStore((state) => state.answers);
  const otherValues = useSurveyStore((state) => state.otherValues);
  const surveyId = useSurveyStore((state) => state.surveyId);
  const questions = useSurveyStore((state) => state.questions);
  const submitResponseMutation = useSubmitResponse();
  const saveDraftMutation = useSaveDraft();

  // Fetch user survey (using public endpoint, no auth required)
  const {data: surveysData, isLoading: isLoadingSurveys} = useSurveys({
    targetRole: 'MANAGER',
    public: true, // Use public endpoint
  });

  // Find user survey
  const userSurvey = React.useMemo(() => {
    if (!surveysData?.surveys) return null;
    return surveysData.surveys.find((s) => s.type === 'USER_SURVEY') || null;
  }, [surveysData]);

  // Fetch questions from server (using public endpoint, no auth required)
  const {data: surveyData, isLoading: isLoadingQuestions} = useSurveyQuestions(
    userSurvey?.id || '',
    undefined, // codeId
    true // isPublic
  );

  // Transform API questions to component questions
  // Need to handle rating questions specially - they need children questions as rating items
  const componentQuestions = React.useMemo(() => {
    if (!surveyData?.questions) return [];
    
    // Separate parent and children questions
    const parentQuestions = surveyData.questions.filter((q: APIQuestion) => !q.parentId);
    const childrenQuestions = surveyData.questions.filter((q: APIQuestion) => q.parentId);
    
    // Transform parent questions
    const transformed = parentQuestions.map((apiQ: APIQuestion) => {
      // For rating questions, we need to get children questions as rating items
      if (apiQ.questionType === 'MATRIX_SINGLE_CHOICE') {
        // Find children questions for this parent
        const ratingItemChildren = childrenQuestions.filter(
          (c: APIQuestion) => c.parentId === apiQ.id && c.questionType === 'SINGLE_CHOICE'
        );
        
        // Rating items are children questions
        const ratingItems = ratingItemChildren.map((child: APIQuestion) => ({
          id: child.id, // Use child question ID
          label: child.questionText,
        }));
        
        // Rating options come from parent's answerQuestion
        const ratingOptions = (apiQ.answerQuestion || []).map((opt) => ({
          value: opt.id || '',
          label: opt.answerText,
        }));
        
        return {
          ...transformAPIQuestionToComponent(apiQ),
          type: 'rating',
          ratingItems,
          ratingOptions,
          // Store parent question ID and children IDs for later use
          _parentId: apiQ.id,
          _childrenIds: ratingItemChildren.map((c: APIQuestion) => c.id),
        } as Question & {questionCode?: string; codeId?: string; _parentId?: string; _childrenIds?: string[]};
      }
      
      return transformAPIQuestionToComponent(apiQ);
    });
    
    return transformed;
  }, [surveyData?.questions]);

  // Use pages from backend, or create from questions as fallback
  const pages = React.useMemo(() => {
    if (surveyData?.pages && surveyData.pages.length > 0) {
      // Use pages from backend
      return surveyData.pages;
    }
    // Fallback: create pages from questions if backend doesn't provide pages
    return createPagesFromQuestions(componentQuestions);
  }, [surveyData?.pages, componentQuestions]);

  const currentPageNumber = parseInt(page || '1', 10);
  const currentPage = pages.find((p) => p.page === currentPageNumber);
  const isLastPage = currentPageNumber === pages.length;

  // Get questions for current page
  // Only get parent questions - children will be handled by their parent questions
  const currentPageQuestions = React.useMemo(() => {
    if (!currentPage) return [];
    const questionIdsSet = new Set(currentPage.questionIds);
    // Filter to only include questions that are in the page's questionIds
    // and are parent questions (no parentId or null parentId)
    return componentQuestions
      .filter((q) => {
        const questionWithParent = q as Question & {parentId?: string | null};
        return questionIdsSet.has(q.id) && (!questionWithParent.parentId || questionWithParent.parentId === null);
      })
      .sort((a, b) => {
        const aOrder = (a as Question & {sortOrder?: number}).sortOrder || 0;
        const bOrder = (b as Question & {sortOrder?: number}).sortOrder || 0;
        return aOrder - bOrder;
      });
  }, [currentPage, componentQuestions]);

  // Initialize survey when data is loaded
  React.useEffect(() => {
    if (isLoadingSurveys || isLoadingQuestions || !userSurvey || !surveyData?.questions) {
      return;
    }

    cleanupOldUserData();

    if (user?.id) {
      setUserId(user.id);
      loadUserData(user.id);
      initializeSurvey({
        questions: componentQuestions,
        surveyId: userSurvey.id,
        surveyTitle: userSurvey.name,
        userId: user.id,
        preserveData: true,
      });
    } else {
      initializeSurvey({
        questions: componentQuestions,
        surveyId: userSurvey.id,
        surveyTitle: userSurvey.name,
      });
    }
  }, [
    isLoadingSurveys,
    isLoadingQuestions,
    userSurvey,
    surveyData?.questions,
    componentQuestions,
    user?.id,
    setUserId,
    loadUserData,
    initializeSurvey,
  ]);

  // Navigate to next page
  const handleNextPage = React.useCallback(() => {
    navigate(`/user-survey/survey/${currentPageNumber + 1}`);
  }, [navigate, currentPageNumber]);

  // Navigate to previous page
  const handlePreviousPage = React.useCallback(() => {
    navigate(`/user-survey/survey/${currentPageNumber - 1}`);
  }, [navigate, currentPageNumber]);

  // Handle back to main page
  const handleBack = React.useCallback(() => {
    navigate('/user-survey');
  }, [navigate]);

  // Helper function to convert answers to SubmitAnswer format
  const convertAnswersToSubmitFormat = React.useCallback((questionsArray: Question[]): SubmitAnswer[] => {
    const allAnswers: (SubmitAnswer | SubmitAnswer[])[] = questionsArray.map((question: Question) => {
      const answer = answers[question.id];
      const otherValue = otherValues[question.id];

      // Handle different question types
      if (question.type === 'text' || question.type === 'textarea') {
        return {
          questionId: question.id,
          answerText: (answer as string) || otherValue || '',
        };
      } else if (question.type === 'single' || question.type === 'multiple') {
        const answerOptionIds: string[] = [];
        let answerText: string | undefined;

        if (question.type === 'single') {
          if (answer) {
            answerOptionIds.push(answer as string);
          }
        } else if (question.type === 'multiple') {
          if (Array.isArray(answer)) {
            answerOptionIds.push(...(answer as string[]));
          }
        }

        if (otherValue) {
          answerText = otherValue;
          const otherOption = question.options?.find((opt) => opt.isOther);
          if (otherOption) {
            answerOptionIds.push(otherOption.value);
          }
        }

        return {
          questionId: question.id,
          answerOptionIds: answerOptionIds.length > 0 ? answerOptionIds : undefined,
          answerText,
        };
      } else if (question.type === 'combobox') {
        const answerOptionIds: string[] = [];
        if (answer && typeof answer === 'object') {
          Object.values(answer).forEach((value) => {
            if (typeof value === 'string') {
              answerOptionIds.push(value);
            }
          });
        }
        return {
          questionId: question.id,
          answerOptionIds: answerOptionIds.length > 0 ? answerOptionIds : undefined,
        };
      } else if (question.type === 'rating') {
        // For rating questions, answers are stored with children question IDs as keys
        // Each child question (rating item) has one answer option ID
        const ratingAnswers: SubmitAnswer[] = [];
        
        const ratingQuestion = question as Question & {_parentId?: string; _childrenIds?: string[]};
        const childrenIds = ratingQuestion._childrenIds || [];
        
        // For each child question (rating item), get the answer
        childrenIds.forEach((childId: string) => {
          const childAnswer = answers[childId];
          if (childAnswer && typeof childAnswer === 'string') {
            ratingAnswers.push({
              questionId: childId, // Use child question ID, not parent
              answerOptionIds: [childAnswer], // The selected option ID
            });
          }
        });
        
        // Return array of answers for all children, or empty array
        return ratingAnswers;
      }

      // Default: return empty answer
      return {
        questionId: (question as Question).id,
      };
    });
    
    // Flatten array (rating questions return array of answers)
    const flattenedAnswers = allAnswers.flat();
    
    // Filter out completely empty answers
    return flattenedAnswers.filter((answer) => {
      const hasAnswerText = answer.answerText !== undefined && answer.answerText !== null && answer.answerText !== '';
      const hasAnswerOptionIds = answer.answerOptionIds && answer.answerOptionIds.length > 0;
      return hasAnswerText || hasAnswerOptionIds;
    });
  }, [answers, otherValues]);

  const handleSaveDraft = React.useCallback(
    async () => {
      if (!surveyId) {
        toast.error('Survey ID tidak ditemukan');
        return;
      }

      try {
        const questionsArray: Question[] = Array.isArray(questions) ? (questions as Question[]) : [];
        const submitAnswers = convertAnswersToSubmitFormat(questionsArray);

        const payload = {
          surveyId: String(surveyId),
          answers: Array.isArray(submitAnswers) ? submitAnswers : [],
        };

        await saveDraftMutation.mutateAsync(payload);

        toast.success('Progress berhasil disimpan sementara');
      } catch (error) {
        logError(error, 'handleSaveDraft');
        const errorMessage = getDetailedErrorMessage(
          error,
          'Gagal menyimpan progress'
        );
        toast.error(errorMessage);
      }
    },
    [surveyId, questions, convertAnswersToSubmitFormat, saveDraftMutation]
  );

  const handleSubmit = React.useCallback(
    async () => {
      if (!surveyId) {
        toast.error('Survey ID tidak ditemukan');
        return;
      }

      setSubmitting(true);

      try {
        // Convert answers to SubmitAnswer format
        const questionsArray: Question[] = Array.isArray(questions) ? (questions as Question[]) : [];
        
        // Validasi: Pastikan semua required questions sudah diisi
        const requiredQuestions = questionsArray.filter((q) => q.required === true);
        const unansweredRequired: Question[] = [];
        
        for (const question of requiredQuestions) {
          const answer = answers[question.id];
          const otherValue = otherValues[question.id];
          
          let isAnswered = false;
          
          if (question.type === 'text' || question.type === 'textarea') {
            isAnswered = !!(answer && typeof answer === 'string' && answer.trim() !== '');
          } else if (question.type === 'single') {
            isAnswered = !!(answer && typeof answer === 'string' && answer !== '');
            if (!isAnswered && otherValue && otherValue.trim() !== '') {
              isAnswered = true;
            }
          } else if (question.type === 'multiple') {
            isAnswered = !!(Array.isArray(answer) && answer.length > 0);
            if (!isAnswered && otherValue && otherValue.trim() !== '') {
              isAnswered = true;
            }
          } else if (question.type === 'combobox') {
            if (answer && typeof answer === 'object') {
              const values = Object.values(answer);
              isAnswered = values.some((v) => typeof v === 'string' && v !== '');
            }
          } else if (question.type === 'rating') {
            // For rating questions, check if all rating items (children) are answered
            if (question.ratingItems && question.ratingItems.length > 0) {
              const ratingQuestion = question as Question & {_childrenIds?: string[]};
              const childrenIds = ratingQuestion._childrenIds || question.ratingItems.map(item => item.id);
              isAnswered = childrenIds.every((childId: string) => {
                const childAnswer = answers[childId];
                return childAnswer && typeof childAnswer === 'string' && childAnswer !== '';
              });
            } else {
              // Fallback for rating if no items (shouldn't happen for valid rating questions)
              isAnswered = !!(answer && typeof answer === 'object' && Object.values(answer).some(v => typeof v === 'string' && v !== ''));
            }
          }
          
          if (!isAnswered) {
            unansweredRequired.push(question);
          }
        }
        
        if (unansweredRequired.length > 0) {
          const questionTexts = unansweredRequired
            .slice(0, 3)
            .map((q) => q.label || 'Pertanyaan')
            .join(', ');
          const moreText = unansweredRequired.length > 3 
            ? ` dan ${unansweredRequired.length - 3} pertanyaan lainnya` 
            : '';
          toast.error(`Mohon lengkapi semua pertanyaan wajib terlebih dahulu. Pertanyaan yang belum diisi: ${questionTexts}${moreText}`);
          setSubmitting(false);
          return;
        }

        const submitAnswers = convertAnswersToSubmitFormat(questionsArray);

        // Submit response
        await submitResponseMutation.mutateAsync({
          surveyId,
          answers: submitAnswers,
        });

        setCompleted(true);
        setSubmitting(false);
        toast.success('Survey berhasil dikirim!');
        navigate('/user-survey/success');
      } catch (error) {
        logError(error, 'handleSubmit');
        const errorMessage = getDetailedErrorMessage(
          error,
          'Gagal mengirim survey'
        );
        toast.error(errorMessage);
        setSubmitting(false);
      }
    },
    [
      surveyId,
      answers,
      otherValues,
      questions,
      convertAnswersToSubmitFormat,
      submitResponseMutation,
      setSubmitting,
      setCompleted,
      navigate,
    ]
  );

  // Show loading state
  if (isLoadingSurveys || isLoadingQuestions || !userSurvey || !surveyData?.questions) {
    return (
      <div className='min-h-screen bg-linear-to-br from-background to-muted/20 flex items-center justify-center'>
        <Card className='text-center'>
          <CardContent className='p-8'>
            <div className='flex flex-col items-center space-y-4'>
              <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
              <p className='text-muted-foreground'>Memuat survey...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className='min-h-screen bg-linear-to-br from-background to-muted/20 flex items-center justify-center'>
        <Card className='text-center'>
          <CardContent className='p-8'>
            <h1 className='text-2xl font-bold text-foreground mb-4'>
              Halaman Tidak Ditemukan
            </h1>
            <p className='text-muted-foreground mb-6'>
              Halaman survey yang Anda cari tidak ditemukan.
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Kembali ke Halaman Utama
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-background to-muted/20'>
      {/* Progress Bar Navbar */}
      <ProgressBar
        currentPage={currentPageNumber}
        totalPages={pages.length}
        onBack={handleBack}
        showBackButton={true}
      />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        <Card>
          <CardContent className='p-8'>
            <SurveyForm
              pageTitle={currentPage?.title}
              pageDescription={currentPage?.description}
              questions={currentPageQuestions}
              currentPage={currentPageNumber}
              totalPages={pages.length}
              onSubmit={handleSubmit}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              submitButtonText={isLastPage ? 'Submit Survey' : 'Selanjutnya'}
              showSubmitButton={true}
              onSaveDraft={handleSaveDraft}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserSurveySurvey;
