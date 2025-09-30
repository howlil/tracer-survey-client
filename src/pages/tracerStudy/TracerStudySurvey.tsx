import { ProgressBar } from "@/components/kuisioner/ProgressBar"
import { SurveyForm } from "@/components/kuisioner/SurveyForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { tracerStudyMetadata, tracerStudyPages, tracerStudyQuestions, tracerStudyConditionalQuestions } from "@/data/tracerStudyData"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectUser } from "@/store/slices/authSlice"
import {
  initializeSurvey,
  loadUserData,
  setCompleted,
  setSubmitting,
  setUserId
} from "@/store/slices/surveySlice"
import { cleanupOldUserData } from "@/store/userStorage"
import { ArrowLeft } from "lucide-react"
import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"

function TracerStudySurvey() {
  const navigate = useNavigate()
  const { page } = useParams<{ page: string }>()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  
  const currentPageNumber = parseInt(page || "1", 10)
  const currentPage = tracerStudyPages.find(p => p.page === currentPageNumber)
  const isLastPage = currentPageNumber === tracerStudyPages.length

  // Redux state

  // Get questions for current page
  const currentPageQuestions = React.useMemo(() => {
    if (!currentPage) return []
    return currentPage.questionIds
      .map(id => tracerStudyQuestions.find(q => q.id === id))
      .filter((q): q is typeof tracerStudyQuestions[0] => q !== undefined)
  }, [currentPage])

  // Initialize survey on mount
  React.useEffect(() => {
    // Clean up old data with timestamp-based user IDs
    cleanupOldUserData()
    
    if (user?.id) {
      // Set user ID first
      dispatch(setUserId(user.id))
      
      // Load user's saved data first
      dispatch(loadUserData(user.id))
      
      // Initialize survey (will preserve loaded data)
      dispatch(initializeSurvey({
        questions: tracerStudyQuestions,
        surveyId: tracerStudyMetadata.id,
        surveyTitle: tracerStudyMetadata.title,
        userId: user.id,
        preserveData: true
      }))
    } else {
      // Initialize without user ID (fallback)
      dispatch(initializeSurvey({
        questions: tracerStudyQuestions,
        surveyId: tracerStudyMetadata.id,
        surveyTitle: tracerStudyMetadata.title
      }))
    }
  }, [dispatch, user?.id])

  // Navigate to next page
  const handleNextPage = React.useCallback(() => {
    navigate(`/tracer-study/survey/${currentPageNumber + 1}`)
  }, [navigate, currentPageNumber])

  // Navigate to previous page
  const handlePreviousPage = React.useCallback(() => {
    navigate(`/tracer-study/survey/${currentPageNumber - 1}`)
  }, [navigate, currentPageNumber])

  // Handle back to main page
  const handleBack = React.useCallback(() => {
    navigate("/tracer-study")
  }, [navigate])

  // Handle conditional questions change
  const handleConditionalQuestionsChange = React.useCallback(() => {
    // Conditional questions state updated
  }, [])

  // Handle survey submission
  const handleSubmit = React.useCallback((answers: Record<string, unknown>) => {
    dispatch(setSubmitting(true))
    
    // Simulate API call
    setTimeout(() => {
      console.log("Tracer Study submitted:", answers)
      dispatch(setCompleted(true))
      dispatch(setSubmitting(false))
      navigate("/tracer-study/success")
    }, 2000)
  }, [dispatch, navigate])

  if (!currentPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="text-center">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground mb-6">
              Halaman survey yang Anda cari tidak ditemukan.
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Halaman Utama
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Progress Bar Navbar */}
      <ProgressBar
        currentPage={currentPageNumber}
        totalPages={tracerStudyPages.length}
        onBack={handleBack}
        showBackButton={true}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <SurveyForm
              pageTitle="Pengisian Tracer Study"
              pageDescription="Universitas Andalas"
              questions={currentPageQuestions}
              currentPage={currentPageNumber}
              totalPages={tracerStudyPages.length}
              onSubmit={handleSubmit}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              submitButtonText={isLastPage ? "Submit Survey" : "Selanjutnya"}
              showSubmitButton={true}
              conditionalQuestions={tracerStudyConditionalQuestions}
              onConditionalQuestionsChange={handleConditionalQuestionsChange}
            />
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}

export default TracerStudySurvey
