import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check } from "lucide-react"

interface TracerStudyProgressBarProps {
  currentPage: number
  totalPages: number
  pageTitle: string
  pageDescription: string
  onBack?: () => void
  showBackButton?: boolean
  className?: string
}

function TracerStudyProgressBar({
  currentPage,
  totalPages,
  pageTitle,
  pageDescription,
  onBack,
  showBackButton = true,
  className
}: TracerStudyProgressBarProps) {
  const progressPercentage = (currentPage / totalPages) * 100

  return (
    <div className={cn(
      "bg-background border-b shadow-sm sticky top-0 z-50",
      className
    )}>
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {/* Back Button */}
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          {/* Page Info */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {pageTitle}
              </h2>
              <p className="text-sm text-muted-foreground">
                {pageDescription}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round(progressPercentage)}% selesai
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            
            {/* Page Indicators */}
            <div className="flex items-center justify-between">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                const isCompleted = pageNumber < currentPage
                const isCurrent = pageNumber === currentPage
                
                return (
                  <div
                    key={pageNumber}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-200",
                      isCompleted && "bg-primary text-primary-foreground",
                      isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      pageNumber
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TracerStudyProgressBar }
export type { TracerStudyProgressBarProps }

