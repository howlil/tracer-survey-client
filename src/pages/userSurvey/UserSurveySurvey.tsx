/** @format */

import {ProgressBar} from '@/components/kuisioner/ProgressBar';
import {SurveyForm} from '@/components/kuisioner/SurveyForm';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  userSurveyConditionalQuestions,
  userSurveyMetadata,
  userSurveyPages,
  userSurveyQuestions,
} from '@/data/userSurveyData';
import {useAuthStore} from '@/stores/auth-store';
import {useSurveyStore} from '@/stores/survey-store';
import {cleanupOldUserData} from '@/store/userStorage';
import {useSubmitResponse, type SubmitAnswer} from '@/api/response.api';
import {toast} from 'sonner';
import {getDetailedErrorMessage, logError} from '@/utils/error-handler';
import {ArrowLeft} from 'lucide-react';
import * as React from 'react';
import {useNavigate, useParams} from 'react-router-dom';

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

  const currentPageNumber = parseInt(page || '1', 10);
  const currentPage = userSurveyPages.find((p) => p.page === currentPageNumber);
  const isLastPage = currentPageNumber === userSurveyPages.length;

  // Redux state

  // Get questions for current page
  const currentPageQuestions = React.useMemo(() => {
    if (!currentPage) return [];
    return currentPage.questionIds
      .map((id) => userSurveyQuestions.find((q) => q.id === id))
      .filter((q): q is (typeof userSurveyQuestions)[0] => q !== undefined);
  }, [currentPage]);

  React.useEffect(() => {
    cleanupOldUserData();

    if (user?.id) {
      setUserId(user.id);
      loadUserData(user.id);
      initializeSurvey({
        questions: userSurveyQuestions,
        surveyId: userSurveyMetadata.id,
        surveyTitle: userSurveyMetadata.title,
        userId: user.id,
        preserveData: true,
      });
    } else {
      initializeSurvey({
        questions: userSurveyQuestions,
        surveyId: userSurveyMetadata.id,
        surveyTitle: userSurveyMetadata.title,
      });
    }
  }, [user?.id, setUserId, loadUserData, initializeSurvey]);

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

  // Handle conditional questions change
  const handleConditionalQuestionsChange = React.useCallback(() => {
    // Conditional questions state updated
  }, []);

  const handleSubmit = React.useCallback(
    async (_answers: Record<string, unknown>) => {
      if (!surveyId) {
        toast.error('Survey ID tidak ditemukan');
        return;
      }

      setSubmitting(true);

      try {
        // Convert answers to SubmitAnswer format
        const submitAnswers: SubmitAnswer[] = questions.map((question) => {
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
              // Single choice: answer is a single value (option ID)
              if (answer) {
                answerOptionIds.push(answer as string);
              }
            } else if (question.type === 'multiple') {
              // Multiple choice: answer is an array of option IDs
              if (Array.isArray(answer)) {
                answerOptionIds.push(...(answer as string[]));
              }
            }

            // Handle "other" option
            if (otherValue) {
              answerText = otherValue;
              // Find the "other" option ID
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
            // ComboBox: answer is an object with combobox item IDs as keys
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
            // Rating: answer is an object with rating item IDs as keys
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
          }

          // Default: return empty answer
          return {
            questionId: question.id,
          };
        }).filter((answer) => {
          // Filter out empty answers
          return (
            answer.answerText !== undefined ||
            (answer.answerOptionIds && answer.answerOptionIds.length > 0)
          );
        });

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
      submitResponseMutation,
      setSubmitting,
      setCompleted,
      navigate,
    ]
  );

  if (!currentPage) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center'>
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
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20'>
      {/* Progress Bar Navbar */}
      <ProgressBar
        currentPage={currentPageNumber}
        totalPages={userSurveyPages.length}
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
              totalPages={userSurveyPages.length}
              onSubmit={handleSubmit}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              submitButtonText={isLastPage ? 'Submit Survey' : 'Selanjutnya'}
              showSubmitButton={true}
              conditionalQuestions={userSurveyConditionalQuestions}
              onConditionalQuestionsChange={handleConditionalQuestionsChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserSurveySurvey;
