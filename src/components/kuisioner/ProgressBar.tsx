import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check } from "lucide-react"

interface ProgressBarProps {
  currentPage: number
  totalPages: number
  onBack?: () => void
  showBackButton?: boolean
  className?: string
}

function ProgressBar({
  currentPage,
  totalPages,
  onBack,
  showBackButton = true,
  className
}: ProgressBarProps) {
  const progressPercentage = (currentPage / totalPages) * 100

  return (
    <div className={cn(
      "bg-background border-b shadow-sm sticky top-0 z-50",
      className
    )}>
      <div className="container mx-auto px-4 py-4 pb-7">
        {/* Header with Back Button and Page Info */}
        <div className="flex items-start justify-between mb-4">
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
          
          {/* Page Info */}
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">

          {/* Progress Bar with Positioned Dots */}
          <div className="relative">
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            
            {/* Page Indicators - Positioned along progress bar */}
            <div className="absolute top-0 left-0 w-full h-2 flex items-center">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                const isCompleted = pageNumber < currentPage
                const isCurrent = pageNumber === currentPage
                
                // Calculate position: start at (1/totalPages * 100)% for first page, then distribute evenly
                const startPosition = (1 / totalPages) * 100 // Start at (1/totalPages * 100)%
                const remainingSpace = 100 - startPosition // Remaining space for distribution
                const stepSize = totalPages > 1 ? remainingSpace / (totalPages - 1) : 0
                const position = totalPages === 1 ? 50 : startPosition + (index * stepSize)
                
                return (
                  <div
                    key={pageNumber}
                    className="absolute transform -translate-x-1/2"
                    style={{ left: `${position}%` }}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 border-2",
                        isCompleted && "bg-primary text-primary-foreground border-primary",
                        isCurrent && "bg-primary text-primary-foreground border-primary",
                        !isCompleted && !isCurrent && "bg-background text-muted-foreground border-muted"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        pageNumber
                      )}
                    </div>
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

export { ProgressBar }
export type { ProgressBarProps }

